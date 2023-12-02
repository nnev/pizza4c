package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Restaurant {
    @JsonProperty
    private Brand brand;
    @JsonProperty
    private Map<String, Double> rating;
    @JsonProperty
    private Map<String, String> location;

    @JsonProperty
    private Colophon colophon;

    private String restaurantId;
    private String restaurantSlug;

    private Menu menu;

    private String restaurantPhoneNumber;
}
