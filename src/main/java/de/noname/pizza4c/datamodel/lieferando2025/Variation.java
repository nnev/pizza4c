package de.noname.pizza4c.datamodel.lieferando2025;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Variation {

    @JsonProperty
    private String id;
    @JsonProperty
    private String name;

    @JsonProperty
    private long price;

    @JsonProperty
    private List<ModifierGroup> modifierGroups;
}
