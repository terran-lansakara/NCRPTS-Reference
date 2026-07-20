package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.PuorderDao;
import lk.earth.earthuniversity.dao.SupplierDao;
import lk.earth.earthuniversity.entity.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/puorders")
public class PuorderController {

    @Autowired
    private PuorderDao puorderDao;

    @Autowired
    private SupplierDao supplierDao;

    @GetMapping(produces = "application/json")
    public List<Puorder> get(@RequestParam HashMap<String, String> params) {

        List<Puorder> puorders = this.puorderDao.findAll();

        if (params.isEmpty()) return puorders;

        String number = params.get("number");

        Stream<Puorder> puorderStream = puorders.stream();

        if (number != null) {
            puorderStream = puorderStream.filter(po -> po.getPuonumber().equalsIgnoreCase(number));
        }

        return puorderStream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> add(@RequestBody Puorder puorder){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        if(puorderDao.findByPuonumber(puorder.getPuonumber())!=null)
            errors = errors+"<br> Existing Purchase Order Number";

        for (Puoitem poi : puorder.getPuoitems()) poi.setPuorder(puorder);

        if(errors=="")
            puorderDao.save(puorder);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(puorder.getId()));
        responce.put("url","/suppliers/"+puorder.getId());
        responce.put("errors",errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> update(@RequestBody Puorder puorder){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Puorder extPuorder = puorderDao.findByPuonumber(puorder.getPuonumber());

        if (extPuorder != null) {

            if (!Objects.equals(puorder.getId(), extPuorder.getId()))
                errors = errors + "<br> Existing Purchase Order";

            extPuorder.getPuoitems().clear();
            puorder.getPuoitems().forEach(newPoitems -> {
                newPoitems.setPuorder(extPuorder);
                extPuorder.getPuoitems().add(newPoitems);
            });

            // Update basic user properties
            BeanUtils.copyProperties(puorder, extPuorder, "id", "puoitems");

            if (errors == "") puorderDao.save(extPuorder);
            else errors = "Server Validation Errors : <br> " + errors;

            responce.put("id", String.valueOf(puorder.getId()));
            responce.put("url", "/suppliers/" + puorder.getId());
            responce.put("errors", errors);
        }
        return responce;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Puorder extPuorder = puorderDao.findByMyId(id);

        if(extPuorder==null)
            errors = errors+"<br> Purchase Order Does Not Existed";

        if(errors=="") puorderDao.delete(extPuorder);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("id",String.valueOf(id));
        responce.put("url","/suppliers/"+id);
        responce.put("errors",errors);

        return responce;
    }


    @GetMapping(path = "/itemsbySupplier/{supnumber}", produces = "application/json")
    public List<Item> getAllItemBySupplier(@PathVariable String supnumber){

        List<Item> items = new ArrayList<>();

        Supplier supplier = supplierDao.findByRegisternumber(supnumber);

//        for ( Supply sp : supplier.getSupplies() ){
//           for (Subcategory sbc : sp.getCategory().getSubcategories()){
//              items.addAll( sbc.getItems());
//           }
//        }
        supplier.getSupplies().forEach((supply -> {
            supply.getCategory().getSubcategories().forEach((subcategory -> {
                items.addAll(subcategory.getItems());
            }));
        }));

        return items;

    }

}


