package de.noname.pizza4c.datamodel.pizza4c;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findCartByUuid(String uuid);

    Cart findCartByName(String name);

    Cart findCartByEntries_uuid(String uuid);
}
