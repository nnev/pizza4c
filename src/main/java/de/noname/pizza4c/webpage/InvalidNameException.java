package de.noname.pizza4c.webpage;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class InvalidNameException extends ResponseStatusException {
    public InvalidNameException(String longName, String shortName) {
        super(HttpStatus.BAD_REQUEST, "Invalid name (Long: " + longName + ", Short: " + shortName + ")");
    }
}
