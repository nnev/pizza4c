package de.noname.pizza4c.webpage.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class InvalidDeliveryTimeException extends ResponseStatusException {
    public InvalidDeliveryTimeException() {
        super(HttpStatus.BAD_REQUEST, "Wer hat an der Uhr gedreht?" +
                "Ist es wirklich schon so spät?" +
                "Soll das heißen, ja ihr Leut, " +
                "mit der Pizza ist Schluss für heut'");
    }
}
