package com.team.ResidentManagement.validator;

import com.nimbusds.jose.Payload;
import jakarta.validation.Constraint;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({FIELD})
@Retention(RUNTIME)
@Constraint(validatedBy = {BirthdayValidator.class})
public @interface BirthdayConstraint {
    String message() default "Birthday constraint is invalid";

    int min();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
