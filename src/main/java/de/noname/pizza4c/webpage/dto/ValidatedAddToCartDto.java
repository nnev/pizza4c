package de.noname.pizza4c.webpage.dto;

import de.noname.pizza4c.datamodel.lieferando.Product;
import de.noname.pizza4c.utils.Name;
import lombok.Data;

import java.util.Map;
import java.util.Set;

@Data
public class ValidatedAddToCartDto {
    Product product;
    String productId;
    String variantId;
    Map<String, Set<String>> options;

    Name name;

    String comment;
}