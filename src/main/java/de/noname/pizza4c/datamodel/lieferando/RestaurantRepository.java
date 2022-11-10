package de.noname.pizza4c.datamodel.lieferando;

public interface RestaurantRepository {
    Restaurant getByRestaurantId(String restaurantId);
}
