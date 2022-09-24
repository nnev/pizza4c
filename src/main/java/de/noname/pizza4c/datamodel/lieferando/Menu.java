package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Menu {
    @JsonProperty
    private List<Category> categories;

    @JsonProperty
    private Map<String, OptionGroup> optionGroups;

    @JsonProperty
    private Map<String, Option> options;

    @JsonProperty
    private Map<String, Product> products;

}
