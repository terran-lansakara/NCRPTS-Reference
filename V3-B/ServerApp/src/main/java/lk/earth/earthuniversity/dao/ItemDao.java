package lk.earth.earthuniversity.dao;

import lk.earth.earthuniversity.entity.Item;
import lk.earth.earthuniversity.entity.Usetype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

public interface ItemDao extends JpaRepository<Item,Integer> {

    @Query("SELECT i FROM Item i WHERE i.code = :code")
    Item findByItemCode(@Param("code") String code);

    @Query("SELECT i FROM Item i WHERE i.name = :name")
    Item findByItemName(@Param("name") String name);

    @Query("SELECT i FROM Item i WHERE i.id = :id")
    Item findByMyId(@Param("id") Integer id);

    @Query("SELECT i FROM Item i WHERE i.dointroduced BETWEEN :startDate  AND :endDate")
    List<Item> findAllItemByDateRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

}
