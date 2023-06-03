package de.noname.pizza4c.webpage.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NotSubmittedException extends ResponseStatusException {
    public NotSubmittedException() {
        super(HttpStatus.BAD_REQUEST, "Order not submitted");
    }
}
