package de.noname.pizza4c.datamodel.lieferando2025;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MenuItem {
    @JsonProperty
    private String name;
    @JsonProperty
    private String description;

    @JsonProperty
    private Map<String, Variation> variations;

    @JsonProperty
    private boolean isVegetarian;

    @JsonProperty
    private boolean isVegan;
}
