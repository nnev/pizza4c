package de.noname.pizza4c.datamodel.pizza4c;

import org.springframework.data.jpa.repository.JpaRepository;

public interface KnownRestaurantRepository extends JpaRepository<KnownRestaurant, Long> {

    boolean existsByLieferandoName(String lieferandoName);
    boolean existsByHumanReadableName(String humanReadableName);
}
