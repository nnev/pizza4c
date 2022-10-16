package de.noname.pizza4c.datamodel.pizza4c;

import de.noname.pizza4c.datamodel.lieferando.Menu;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Data
public class CartEntry {
    private String product;
    private String variant;
    private Map<String, Set<String>> options;

    public BigDecimal getPrice(Menu menu) {
        return new BigDecimal(menu.getVariant(product, variant).getPrices().getDeliveryEuro()).add(
                options
                        .values()
                        .stream()
                        .flatMap(Collection::stream)
                        .map(s -> new BigDecimal(menu.getOptions().get(s).getPrices().getDeliveryEuro()))
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
        );
    }

    public List<String> getOptionList(Menu menu) {
        return options
                .values()
                .stream()
                .flatMap(Collection::stream)
                .map(s -> menu.getOptions().get(s).getName())
                .collect(Collectors.toList());
    }
}
