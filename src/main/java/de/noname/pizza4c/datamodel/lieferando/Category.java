package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Category {
    @JsonProperty
    private String id;

    @JsonProperty
    private String name;

    @JsonProperty
    private List<String> description;

    @JsonProperty
    private List<String> productIds;

    @JsonProperty
    public boolean isVegetarian;

    @JsonProperty
    public boolean isVegan;
}
