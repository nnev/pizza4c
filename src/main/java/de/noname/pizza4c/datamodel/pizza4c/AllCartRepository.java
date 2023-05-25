package de.noname.pizza4c.datamodel.pizza4c;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AllCartRepository extends JpaRepository<AllCarts, Long> {
    @Query("SELECT a FROM AllCarts a ORDER BY a.createdAt DESC LIMIT 1")
    public AllCarts getLatest();
}
