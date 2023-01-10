package de.noname.pizza4c.webpage;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NoSuchOptionGroupException extends ResponseStatusException {
    public NoSuchOptionGroupException(String productId, String variantId, String optionGroupId) {
        super(HttpStatus.BAD_REQUEST, "No such variant (Product: " + productId + ", Variant: " + variantId + ", OptionGroup: " + optionGroupId + ")");
    }
}
