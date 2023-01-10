package de.noname.pizza4c.webpage;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NoSuchProductException extends ResponseStatusException {
    public NoSuchProductException(String productId) {
        super(HttpStatus.BAD_REQUEST, "No such product " + productId);
    }
}
