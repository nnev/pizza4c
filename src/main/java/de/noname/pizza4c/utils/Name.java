package de.noname.pizza4c.utils;

import de.noname.pizza4c.webpage.error.InvalidNameException;
import lombok.Data;

@Data
public class Name {
    private String longName;
    private String shortName;

    public void ensureValid() {
        if (longName == null || shortName == null || longName.length() < 3 || longName.length() >= 20 || shortName.length() != 3) {
            throw new InvalidNameException(longName, shortName);
        }
    }

    public static void ensureValid(Name name) {
        if (name == null) {
            throw new InvalidNameException(null, null);
        }
        name.ensureValid();
    }
}
