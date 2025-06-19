package de.noname.pizza4c.datamodel.lieferando2025;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ModifierGroup {
    @JsonProperty
    private String name;

    @JsonProperty
    private int minAmount;

    @JsonProperty
    private int maxAmount;

    @JsonProperty
    private Map<String, Modifier> modifiers;
}
