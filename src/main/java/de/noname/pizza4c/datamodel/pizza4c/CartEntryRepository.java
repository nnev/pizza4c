package de.noname.pizza4c.datamodel.pizza4c;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CartEntryRepository extends JpaRepository<CartEntry, Long> {
}
