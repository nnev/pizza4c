package de.noname.pizza4c.datamodel.lieferando2025;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Variation {
    @JsonProperty
    private String name;

    @JsonProperty
    private long priceCents;

    @JsonProperty
    private Map<String, ModifierGroup> modifierGroups;
}
