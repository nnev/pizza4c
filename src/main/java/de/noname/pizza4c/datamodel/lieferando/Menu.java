package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Menu {

    private List<MenuItem> items;

    @JsonProperty
    private List<Category> categories;

    @JsonProperty
    private Map<String, OptionGroup> optionGroups;

    @JsonProperty
    private Map<String, Option> options;

    @JsonProperty
    private Map<String, Product> products;


    public Variant getVariant(String productId, String variantId) {
        return products.get(productId)
                .getVariants()
                .stream()
                .filter(variant -> variant.getId().equals(variantId))
                .findFirst()
                .orElse(null);
    }

    public boolean isConfigurable(Product product) {
        return product.getVariants().size() > 1 ||
                product.getVariants().stream().flatMap(variant -> variant.getOptionGroupIds().stream())
                        .map(s -> getOptionGroups().get(s)).anyMatch(this::isConfigurable);
    }

    public boolean isConfigurable(OptionGroup optionGroup) {
        return optionGroup.getOptionIds().size() > 0;
    }
}
