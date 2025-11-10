package com.team.ResidentManagement.configuration;

import java.text.ParseException;
import java.util.Objects;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.team.ResidentManagement.dto.request.IntrospectRequest;
import com.team.ResidentManagement.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;

/**
 * Decoder JWT tuỳ chỉnh giúp kiểm tra tính hợp lệ token thông qua dịch vụ AuthenticationService
 * trước khi uỷ quyền cho NimbusJwtDecoder giải mã.
 */
@Component
public class CustomJwtDecoder implements JwtDecoder {

    /** Khoá bí mật dùng để tạo SecretKeySpec cho thuật toán HS512. */
    @Value("${jwt.signer-key}")
    private String signerKey;

    /** Dịch vụ xác thực cung cấp API introspect để kiểm tra token. */
    @Autowired
    private AuthenticationService authenticationService;

    /** Decoder Nimbus được cache để tránh khởi tạo lại nhiều lần. */
    private NimbusJwtDecoder nimbusJwtDecoder = null;

    /**
     * Kiểm tra token bằng introspect và decode bằng Nimbus.
     * @param token chuỗi JWT từ header Authorization.
     * @return đối tượng Jwt chứa thông tin claims.
     * @throws JwtException khi token không hợp lệ hoặc lỗi giải mã.
     */
    @Override
    public Jwt decode(String token) throws JwtException {

        try {
            var response = authenticationService.introspect(
                    IntrospectRequest.builder().token(token).build());

            if (!response.isValid()) throw new JwtException("Token invalid");
        } catch (JOSEException | ParseException e) {
            throw new JwtException(e.getMessage());
        }

        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }

        return nimbusJwtDecoder.decode(token);
    }
}