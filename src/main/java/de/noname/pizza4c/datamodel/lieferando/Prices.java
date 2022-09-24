package de.noname.pizza4c.datamodel.lieferando;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class Prices {
    @JsonProperty
    private long delivery;

    @JsonProperty
    private long pickup;

    @JsonProperty
    private long deposit;

    public String getDeliveryEuro(){
        return new BigDecimal(delivery).scaleByPowerOfTen(-2).toString();
    }

    public String getPickupEuro(){
        return new BigDecimal(pickup).scaleByPowerOfTen(-2).toString();
    }
}
