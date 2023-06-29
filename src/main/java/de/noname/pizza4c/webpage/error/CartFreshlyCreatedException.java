package de.noname.pizza4c.webpage.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

import static de.noname.pizza4c.utils.TimeUtils.formatDateTime;

public class CartFreshlyCreatedException extends ResponseStatusException {
    public CartFreshlyCreatedException(LocalDateTime createdAt) {
        super(HttpStatus.BAD_REQUEST,
                "Bestellung wurde erst vor kurzem erzeugt (" + formatDateTime(createdAt) + ")");
    }
}
