package de.noname.pizza4c.datamodel.lieferando2025;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ModifierGroup {

    @JsonProperty
    private String id;
    @JsonProperty
    private String name;

    @JsonProperty
    private int minAmount;

    @JsonProperty
    private int maxAmount;

    @JsonProperty
    private List<Modifier> modifiers;

    @JsonProperty
    private boolean isVegetarian;

    @JsonProperty
    private boolean isVegan;
}
