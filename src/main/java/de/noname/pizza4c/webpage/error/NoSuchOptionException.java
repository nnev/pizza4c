package de.noname.pizza4c.webpage.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NoSuchOptionException extends ResponseStatusException {
    public NoSuchOptionException(String productId, String variantId, String optionGroupId, String optionId) {
        super(HttpStatus.BAD_REQUEST, "No such variant (Product: " + productId + ", Variant: " + variantId + ", OptionGroup: " + optionGroupId + ", Option: " + optionId + ")");
    }
}
