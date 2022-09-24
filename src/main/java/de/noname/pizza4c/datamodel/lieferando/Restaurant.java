package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Restaurant {
    @JsonProperty
    private Brand brand;
    @JsonProperty
    private Map<String, Double> rating;
    @JsonProperty
    private Map<String, String> location;

    private String restaurantId;

    private Menu menu;
}
