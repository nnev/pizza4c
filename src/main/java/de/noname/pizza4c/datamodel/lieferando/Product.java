package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Product {
    @JsonProperty
    private String name;

    @JsonProperty
    private List<String> description;

    @JsonProperty
    private String imageUrl;

    @JsonProperty
    private List<Variant> variants;

    @JsonProperty
    private AllergenHolder allergenHolder = new AllergenHolder();
}
