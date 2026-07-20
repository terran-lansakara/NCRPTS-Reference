package lk.earth.earthuniversity.controller;


import lk.earth.earthuniversity.dao.SupplierstatusDao;
import lk.earth.earthuniversity.dao.UsestatusDao;
import lk.earth.earthuniversity.entity.Supplierstatus;
import lk.earth.earthuniversity.entity.Usestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/supplierstatuses")
public class SupplierstatusController {

    @Autowired
    private SupplierstatusDao supplierstatusDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Supplierstatus> get() {

        return this.supplierstatusDao.findAll();

    }

}


