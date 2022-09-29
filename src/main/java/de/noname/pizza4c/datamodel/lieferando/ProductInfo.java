package de.noname.pizza4c.datamodel.lieferando;

import lombok.Data;

import java.util.List;

@Data
public class ProductInfo {
    private List<String> additives;
    private List<String> allergens;
    private String alcoholVolume;
    private String caffeineAmount;
    private boolean isFoodInformationVerifiedByRestaurant;
    private List<String> nutritionalTextManual;

    public boolean anyInformation() {
        return (additives != null && !additives.isEmpty()) ||
                (allergens != null && !allergens.isEmpty()) ||
                (alcoholVolume != null && !alcoholVolume.isBlank()) ||
                (caffeineAmount != null && !caffeineAmount.isBlank()) ||
                (nutritionalTextManual != null && !nutritionalTextManual.isEmpty());
    }

}
