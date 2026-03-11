package com.team.ResidentManagement.service;

import com.team.ResidentManagement.dto.request.AuthenticationRequest;
import com.team.ResidentManagement.dto.request.IntrospectRequest;
import com.team.ResidentManagement.dto.request.LogoutRequest;
import com.team.ResidentManagement.dto.request.RefreshRequest;
import com.team.ResidentManagement.dto.response.AuthenticationResponse;
import com.team.ResidentManagement.dto.response.IntrospectResponse;
import com.team.ResidentManagement.entity.InvalidatedToken;
import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.exception.AppException;
import com.team.ResidentManagement.exception.ErrorCode;
import com.team.ResidentManagement.repository.InvalidatedTokenRepository;
import com.team.ResidentManagement.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

/**
 * Xử lý toàn bộ nghiệp vụ xác thực JWT: phát hành, kiểm tra, làm mới và thu hồi
 * token.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    /** Repository truy cập dữ liệu người dùng. */
    UserRepository userRepository;
    /** Repository lưu token đã vô hiệu hoá. */
    private final InvalidatedTokenRepository invalidatedTokenRepository;

    /** Khoá ký JWT nạp từ cấu hình. */
    @NonFinal
    @Value("${jwt.signer-key}")
    protected String SIGNER_KEY;

    /** Thời gian token có hiệu lực (giây). */
    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    /** Thời gian được phép refresh kể từ thời điểm phát hành. */
    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    /**
     * Kiểm tra token có hợp lệ hay không dựa trên verifyToken.
     */
    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException exception) {
            isValid = false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    /**
     * Xác thực người dùng bằng email/password và phát hành JWT mới.
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String identifier = request.getIdentifier(); // Treated as CCCD or Phone Number now
        var user = userRepository.findByPersonalId(identifier)
                .or(() -> userRepository.findByPhoneNumber(identifier))
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        if (user.getStatus().equals("PENDING") || user.getStatus().equals("REJECTED")) {
            throw new AppException(ErrorCode.USER_NOT_ACCEPT);
        }

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    /**
     * Verify chữ ký, hạn dùng và trạng thái thu hồi của token.
     * 
     * @param token   chuỗi JWT cần kiểm tra.
     * @param refresh true nếu đang kiểm tra cho mục đích refresh.
     */
    private SignedJWT verifyToken(String token, boolean refresh) throws JOSEException, ParseException {
        MACVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expireTime = (refresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant()
                        .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify((verifier));

        if (!(verified && expireTime.after(new Date()))) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        return signedJWT;
    }

    /**
     * Thu hồi token hiện tại bằng cách lưu vào bảng invalidated_token.
     */
    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .token(jit)
                    .expireTime(expiryTime)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (AppException exception) {
            System.out.println("Token already expired");
        }
    }

    /**
     * Làm mới token: thu hồi token cũ và phát hành token mới.
     */
    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken(), true);

        String jit = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .token(jit)
                .expireTime(expiryTime)
                .build();

        invalidatedTokenRepository.save(invalidatedToken);

        var email = signedJWT.getJWTClaimsSet().getSubject();

        var user = userRepository.findByEmail(email).orElseThrow(
                () -> new AppException(ErrorCode.UNAUTHENTICATED));

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .authenticated(true)
                .token(token)
                .build();
    }

    /**
     * Tạo JWT chứa thông tin người dùng và phạm vi quyền hạn.
     */
    private String generateToken(User user) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issuer("devteria.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .claim("userId", user.getId())
                .claim("fullName", user.getFullName())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            System.out.println("Cannot create token");
            throw new RuntimeException(e);
        }
    }

    /**
     * Ghép các vai trò và quyền thành chuỗi scope truyền vào JWT.
     */
    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");

        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
                }
            });
        }

        return stringJoiner.toString();
    }
}
