package de.noname.pizza4c.datamodel.pizza4c;

import org.springframework.data.jpa.repository.JpaRepository;

public interface KnownRestaurantRepository extends JpaRepository<KnownRestaurant, Long> {

    KnownRestaurant getByLieferandoName(String lieferandoName);
    KnownRestaurant getByHumanReadableName(String humanReadableName);
}
