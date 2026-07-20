package lk.earth.earthuniversity.controller;

import lk.earth.earthuniversity.dao.ItemDao;
import lk.earth.earthuniversity.entity.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/items")
public class ItemController {

    @Autowired
    private ItemDao itemDao;

    // 1) View All and View Selected
    @GetMapping(produces = "application/json")
    public List<Item> get(@RequestParam HashMap<String, String> param) {

        List<Item> items = itemDao.findAll();

        if (param.isEmpty()) return items;

        String itemName = param.get("itemname");
        String brandName = param.get("brandname");
        String category = param.get("categoryname");
        String subcategory = param.get("subcategoryname");
        String itemstatus = param.get("staus");

        String before = param.get("before");
        String after = param.get("after");

//        LocalDate startDate = LocalDate.parse(before);
//        LocalDate endDate =  LocalDate.parse(after);



        Stream<Item> itemStream = items.stream();

        if (itemName != null){
            itemStream = itemStream.filter(item -> item.getName().equalsIgnoreCase(itemName));
        }
        if (brandName != null){
            itemStream = itemStream.filter(item -> item.getBrand().getName().equalsIgnoreCase(brandName));
        }
        if (category != null){
            itemStream = itemStream.filter(item -> item.getSubcategory().getCategory().getName().equalsIgnoreCase(category));
        }
        if (subcategory != null){
            itemStream = itemStream.filter(item -> item.getSubcategory().getName().equalsIgnoreCase(subcategory));
        }
        if (itemstatus != null){
            itemStream = itemStream.filter(item -> item.getItemstatus().getName().equalsIgnoreCase(itemstatus));
        }

        if (!(before == null) && !(after == null)){
            LocalDate startDate = LocalDate.parse(before);
            LocalDate endDate = LocalDate.parse(after);

            Date beforeDate = Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            Date nextDate = Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

            List<Item> returnItems =  itemDao.findAllItemByDateRange(beforeDate,nextDate);
            itemStream = returnItems.stream();

        }
//        String before = "2021-09-12";
//        String after = "2024-09-15";

        return itemStream.collect(Collectors.toList());
    }

    // 2) Save
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> save(@RequestBody Item item){

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Item extItemCode = itemDao.findByItemCode(item.getCode());
        Item extItemName = itemDao.findByItemName(item.getName());

        if (extItemCode != null){ errors = errors + "Existing Item Code <br>"; }
        if (extItemName != null){ errors = errors + "Existing Item Name <br>"; }

        if (errors == ""){ itemDao.save(item); }
        else { errors = "Server Validation Errors : <br> " +  errors ;}

        response.put("ItemCode" , item.getCode());
        response.put("url" , "/items/post");
        response.put("errors" , errors);

        return response;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Item item){
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Item extItemCode = itemDao.findByItemCode(item.getCode());
        Item extItemName = itemDao.findByItemName(item.getName());

        if (extItemCode != null && (!Objects.equals(item.getId(), extItemCode.getId()))){
            errors = errors + "Existing Item Code <br>";
        }
        if (extItemName != null && (!Objects.equals(item.getId(), extItemName.getId()))){
            errors = errors + "Existing Item Name <br>";
        }

        if (errors == ""){ itemDao.save(item); }
        else { errors = "Server Validation Errors : <br> " +  errors ;}

        response.put("ItemCode" , item.getCode());
        response.put("url" , "/items/put");
        response.put("errors" , errors);

        return response;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id){
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (itemDao.existsById(id)) {
            itemDao.delete(itemDao.findByMyId(id));
        }else {
            errors = "Server Validation Errors : <br> No Existing Item";
        }
        response.put("url" , "/items/put");
        response.put("errors" , errors);

        return response;
    }
}
