package de.noname.pizza4c.datamodel.pizza4c;

import com.fasterxml.jackson.annotation.JsonProperty;
import de.noname.pizza4c.datamodel.lieferando.Menu;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Data
public class CartEntry {
    private String id;
    private String product;
    private String variant;
    private Map<String, Set<String>> options;

    @JsonProperty
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
        var result = new ArrayList<String>();
        result.add(menu.getProducts().get(product).getName());

        options
                .values()
                .stream()
                .flatMap(Collection::stream)
                .map(s -> menu.getOptions().get(s).getName())
                .forEach(result::add);
        return result;
    }

    public String getOptionListHtml(Menu menu) {
        StringBuilder result = new StringBuilder();
        result.append(menu.getProducts().get(product).getName()).append("<br>");

        options
                .values()
                .stream()
                .flatMap(Collection::stream)
                .map(s -> menu.getOptions().get(s).getName())
                .forEach(s -> {
                    result.append("&nbsp;&nbsp;+&nbsp;").append(s).append("<br>");
                });
        return result.toString();
    }


}
