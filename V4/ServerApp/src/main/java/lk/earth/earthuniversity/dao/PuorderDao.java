package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Puorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PuorderDao extends JpaRepository<Puorder,Integer> {

    Puorder findByPuonumber(String number);

    @Query("SELECT p FROM Puorder p WHERE p.id = :id")
    Puorder findByMyId(@Param("id") Integer id);
}
