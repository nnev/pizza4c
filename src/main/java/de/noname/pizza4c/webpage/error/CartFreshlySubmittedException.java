package de.noname.pizza4c.webpage.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

import static de.noname.pizza4c.utils.TimeUtils.formatDateTime;
import static de.noname.pizza4c.utils.TimeUtils.formatEpochMillis;

public class CartFreshlySubmittedException extends ResponseStatusException {
    public CartFreshlySubmittedException(LocalDateTime createdAt) {
        super(HttpStatus.BAD_REQUEST,
                "Bestellung wurde erst vor kurzem abgeschickt (" + formatDateTime(createdAt) + ")");
    }
}
