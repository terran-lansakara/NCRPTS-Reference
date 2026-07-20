package lk.earth.earthuniversity.dao;


import lk.earth.earthuniversity.entity.Supplier;
import lk.earth.earthuniversity.entity.Suppliertype;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SupplierDao extends JpaRepository<Supplier,Integer> {

    Supplier findByRegisternumber(String regNumber);
    @Query("SELECT s FROM Supplier s WHERE s.id = :id")
    Supplier findByMyId(@Param("id") Integer id);
}

