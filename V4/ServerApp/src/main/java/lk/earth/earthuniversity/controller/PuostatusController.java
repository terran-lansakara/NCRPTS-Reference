package lk.earth.earthuniversity.controller;


import lk.earth.earthuniversity.dao.PuostatusDao;
import lk.earth.earthuniversity.dao.UsestatusDao;
import lk.earth.earthuniversity.entity.Puostatus;
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
@RequestMapping(value = "/puostatuses")
public class PuostatusController {

    @Autowired
    private PuostatusDao puostatusDao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Puostatus> get() {
        return this.puostatusDao.findAll();
    }
}


