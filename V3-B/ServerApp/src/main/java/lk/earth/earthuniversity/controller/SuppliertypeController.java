package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.SuppliertypeDao;
import lk.earth.earthuniversity.dao.UsrtypeDao;
import lk.earth.earthuniversity.entity.Supplier;
import lk.earth.earthuniversity.entity.Suppliertype;
import lk.earth.earthuniversity.entity.Usetype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/suppliertypes")
public class SuppliertypeController {

    @Autowired
    private SuppliertypeDao suppliertypeDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Suppliertype> get() {

       return this.suppliertypeDao.findAll();
    }

}


