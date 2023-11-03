package de.noname.pizza4c.webpage.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class UnauthorizedException extends ResponseStatusException {
    public UnauthorizedException() {
        super(HttpStatus.UNAUTHORIZED, "Not authorized to do admin tasks");
    }
}
