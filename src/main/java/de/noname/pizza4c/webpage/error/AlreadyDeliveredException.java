package de.noname.pizza4c.webpage.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class AlreadyDeliveredException extends ResponseStatusException {
    public AlreadyDeliveredException() {
        super(HttpStatus.BAD_REQUEST, "Order already delivered");
    }
}
