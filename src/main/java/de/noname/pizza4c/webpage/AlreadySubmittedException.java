package de.noname.pizza4c.webpage;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AlreadySubmittedException extends ResponseStatusException {
    public AlreadySubmittedException() {
        super(HttpStatus.BAD_REQUEST, "Order already submitted");
    }
}
