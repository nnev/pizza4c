package de.noname.pizza4c.datamodel.lieferando;

public interface RestaurantRepository {
    Restaurant getByRestaurantSlug(String restaurantId);

    void evictAllCacheValues();
}
