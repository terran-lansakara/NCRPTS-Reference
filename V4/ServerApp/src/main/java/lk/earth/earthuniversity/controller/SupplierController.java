package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.SupplierDao;
import lk.earth.earthuniversity.entity.Supplier;
import lk.earth.earthuniversity.entity.Supply;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/suppliers")
public class SupplierController {

    @Autowired
    private SupplierDao supplierDao;

    @GetMapping(produces = "application/json")
    public List<Supplier> get(@RequestParam HashMap<String, String> params) {

        List<Supplier> suppliers = this.supplierDao.findAll();

        if (params.isEmpty()) return suppliers;

        String number = params.get("regnumber");
        String name= params.get("name");

        Stream<Supplier> supplierStream = suppliers.stream();

        if (number != null) {
            supplierStream = supplierStream.filter(s -> s.getRegisternumber().equalsIgnoreCase(number));
        }
        if (name != null){
            supplierStream = supplierStream.filter(s -> s.getName().equalsIgnoreCase(name));
        }
        return supplierStream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Supplier supplier){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(supplierDao.findByRegisternumber(supplier.getRegisternumber())!=null)
            errors = errors+"<br> Existing Register Number";

        for (Supply sp : supplier.getSupplies()) sp.setSupplier(supplier);

        if(errors=="")
            supplierDao.save(supplier);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(supplier.getId()));
        responce.put("url","/suppliers/"+supplier.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(@RequestBody Supplier supplier){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Supplier extSupplier = supplierDao.findByRegisternumber(supplier.getRegisternumber());

        if (extSupplier != null) {

            if (!Objects.equals(supplier.getId(), extSupplier.getId()))
                errors = errors + "<br> Existing Registered Number";

            extSupplier.getSupplies().clear();
            supplier.getSupplies().forEach(newSupply -> {
                newSupply.setSupplier(extSupplier);
                extSupplier.getSupplies().add(newSupply);
            });

            // Update basic user properties
            BeanUtils.copyProperties(supplier, extSupplier, "id", "supplies");

            if (errors == "") supplierDao.save(extSupplier);
            else errors = "Server Validation Errors : <br> " + errors;

            responce.put("id", String.valueOf(supplier.getId()));
            responce.put("url", "/suppliers/" + supplier.getId());
            responce.put("errors", errors);
        }
        return responce;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Supplier extSupplier = supplierDao.findByMyId(id);

        if(extSupplier==null)
            errors = errors+"<br> Supplier Does Not Existed";

        if(errors=="") supplierDao.delete(extSupplier);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/suppliers/"+id);
        responce.put("errors",errors);

        return responce;
    }

}


