package de.noname.pizza4c.webpage.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import static de.noname.pizza4c.utils.TimeUtils.formatEpochMillis;

public class CartFreshlySubmittedException extends ResponseStatusException {
    public CartFreshlySubmittedException(long createdAt) {
        super(HttpStatus.BAD_REQUEST,
                "Bestellung wurde erst vor kurzem abgeschickt (" + formatEpochMillis(createdAt) + ")");
    }
}
