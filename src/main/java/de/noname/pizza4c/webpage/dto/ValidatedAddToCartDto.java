package de.noname.pizza4c.webpage.dto;

import de.noname.pizza4c.datamodel.lieferando2025.MenuItem;
import de.noname.pizza4c.utils.Name;
import lombok.Data;

import java.util.Map;
import java.util.Set;

@Data
public class ValidatedAddToCartDto {
    MenuItem menuItem;
    String menuItemId;
    String variantId;
    Map<String, Set<String>> modifiers;

    Name name;

    String comment;
}