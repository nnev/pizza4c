package de.noname.pizza4c.datamodel.lieferando;

import lombok.Data;

import java.util.List;

@Data
public class AllergenHolder {
    private List<String> additives;
    private List<String> allergens;
    private String alcoholVolume;
    private String caffeineAmount;
    private boolean isFoodInformationVerifiedByRestaurant;
    private List<String> nutritionalTextManual;

}
