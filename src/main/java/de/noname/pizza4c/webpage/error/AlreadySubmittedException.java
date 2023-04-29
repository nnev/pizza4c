package de.noname.pizza4c.webpage.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AlreadySubmittedException extends ResponseStatusException {
    public AlreadySubmittedException() {
        super(HttpStatus.BAD_REQUEST, "Order already submitted");
    }
}
