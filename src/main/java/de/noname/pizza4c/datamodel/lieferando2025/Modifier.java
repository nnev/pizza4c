package de.noname.pizza4c.datamodel.lieferando2025;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Modifier {

    @JsonProperty
    private String id;
    @JsonProperty
    private String name;

    @JsonProperty
    private int price;

    @JsonProperty
    private int minAmount;

    @JsonProperty
    private int maxAmount;

    @JsonProperty
    private int defaultChoices;
}
