package de.noname.pizza4c.webpage.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NoSuchVariantException extends ResponseStatusException {
    public NoSuchVariantException(String productId, String variantId) {
        super(HttpStatus.BAD_REQUEST, "No such variant (Product: " + productId + ", Variant: " + variantId + ")");
    }
}
