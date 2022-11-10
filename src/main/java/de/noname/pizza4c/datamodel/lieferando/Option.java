package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Option {
    @JsonProperty
    private String name;

    @JsonProperty
    private int minAmount;

    @JsonProperty
    private int maxAmount;

    @JsonProperty
    private Prices prices;
}
