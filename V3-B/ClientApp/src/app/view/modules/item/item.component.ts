import {Component, OnInit, ViewChild} from '@angular/core';
import {ItemService} from "../../../service/itemservice";
import {Item} from "../../../entity/item";
import {MatTableDataSource} from "@angular/material/table";
import {UiAssist} from "../../../util/ui/ui.assist";
import {MatPaginator} from "@angular/material/paginator";
import {ItemstatusService} from "../../../service/itemstatusservice";
import {BrandService} from "../../../service/brandservice";
import {CategoryService} from "../../../service/categoryservice";
import {SubcategoryService} from "../../../service/subcategoryservice";
import {UnittypeService} from "../../../service/unittypeservice";
import {Itemstatus} from "../../../entity/itemstatus";
import {Brand} from "../../../entity/brand";
import {Category} from "../../../entity/category";
import {Subcategory} from "../../../entity/subcategory";
import {Unittype} from "../../../entity/unittype";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {RegexService} from "../../../service/regexservice";
import {AuthorizationManager} from "../../../service/authorizationmanager";

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
  providers:[]
})
export class ItemComponent implements OnInit{

  itemForm! : FormGroup;
  itemSearchForm! : FormGroup;
  csSearchForm! : FormGroup;
  rangepicker! : FormGroup;


  enaAdd! : boolean;
  enaUpd! : boolean;
  enaDel! : boolean;

  hasInsertAuthority!: boolean;
  hasUpdateAuthority!: boolean;
  hasDeleteAuthority!: boolean;

  selectedRow : any;

  items : Array<Item> = [];
  data!: MatTableDataSource<Item>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  uiassist : UiAssist;

  itemstatses : Array<Itemstatus> = [];
  brands : Array<Brand> = [];
  categories : Array<Category> = [];
  subcategories : Array<Subcategory> = [];
  unittypes : Array<Unittype> = [];

  oldItem! : Item;
  item! : Item;

  regexes!: any;

  columns = ['code', 'name', 'sprice', 'status', 'brand'];
  headers = ['Code', 'Name', 'Sale Price', 'Item Status', 'Item Brand'];
  binders = ['code', 'name', 'sprice', 'itemstatus.name', 'brand.name'];

  cscoloumns = ['cscode', 'csname', 'cssprice'];
  cscolpromts = ['Search By Code', 'Search By Name', 'Search By Sprice'];

  imageempurl: string = 'assets/default.png';
  constructor(
    private itemService : ItemService,
    private itemStatusService : ItemstatusService,
    private brandService : BrandService,
    private categoryService : CategoryService,
    private subcategoryService : SubcategoryService,
    private unittypeService : UnittypeService,
    private formBuilder : FormBuilder,
    private datePipe : DatePipe,
    private matDialog : MatDialog,
    private regexService : RegexService,
    private authService : AuthorizationManager
  ) {
    this.uiassist = new UiAssist(this);

    this.itemForm = this.formBuilder.group({
      code : new FormControl('',[Validators.required]),
      name : new FormControl('',[Validators.required]),
      pprice : new FormControl('',[Validators.required]),
      sprice : new FormControl('',[Validators.required]),
      photo : new FormControl('',[Validators.required]),
      quantity : new FormControl('',[Validators.required]),
      dointroduced : new FormControl('',[Validators.required]),
      rop : new FormControl('',[Validators.required]),
      itemstatus : new FormControl('',[Validators.required]),
      brand : new FormControl('',[Validators.required]),
      subcategory : new FormControl('',[Validators.required]),
      unittype : new FormControl('',[Validators.required]),
      category : new FormControl('',[Validators.required]),
    })

    this.itemSearchForm = this.formBuilder.group({
      ssname : new FormControl(),
      ssbrand : new FormControl(),
      sscateogry : new FormControl(),
      sssubcateogry : new FormControl(),
      ssstatus : new FormControl(),
      // ssdointroducedStart : new FormControl(),
      // ssdointroducedEnd : new FormControl()

    })
    this.rangepicker = this.formBuilder.group({
      ssdointroducedStart: new FormControl(),
      ssdointroducedEnd: new FormControl()
    })

    this.csSearchForm = this.formBuilder.group({
      cscode : new FormControl(),
      csname : new FormControl(),
      cssprice : new FormControl(),

    })

  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){

    this.itemStatusService.getAllList().then((itemstatses => {
      this.itemstatses = itemstatses;
    }))

    this.brandService.getAllList().then((brands => {
      this.brands = brands;
    }))

    this.categoryService.getAllList().then((categories => {
      this.categories = categories;
    }))

    this.subcategoryService.getAllList().then((subcategories => {
      this.subcategories = subcategories;
    }))

    this.unittypeService.getAllList().then((unittypes => {
      this.unittypes = unittypes;
    }))

    this.regexService.get('items').then((regex =>{
      this.regexes = regex;
      this.createForm();
    }))

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }

    this.createView();
  }

  createView(){
    this.loadtable('');
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'item' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'item' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'item' && authority.operation === 'delete');

  }

  createForm() {

    this.itemForm.controls['code'].setValidators([Validators.required, Validators.pattern(this.regexes['code']['regex'])]);
    this.itemForm.controls['name'].setValidators([Validators.required]);
    this.itemForm.controls['pprice'].setValidators([Validators.required]);
    this.itemForm.controls['sprice'].setValidators([Validators.required]);
    this.itemForm.controls['rop'].setValidators([Validators.required]);
    this.itemForm.controls['quantity'].setValidators([Validators.required]);
    this.itemForm.controls['dointroduced'].setValidators([Validators.required]);
    this.itemForm.controls['itemstatus'].setValidators([Validators.required]);
    this.itemForm.controls['brand'].setValidators([Validators.required]);
    this.itemForm.controls['subcategory'].setValidators([Validators.required]);
    this.itemForm.controls['unittype'].setValidators([Validators.required]);
    this.itemForm.controls['category'].setValidators([Validators.required]);

    Object.values(this.itemForm.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.itemForm.controls) {
      const control = this.itemForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "dointroduced")
            value = this.datePipe.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldItem != undefined && control.valid) {
            // @ts-ignore
            if (value === this.item[controlName]) {
              control.markAsPristine();
            } else {
              control.markAsDirty();
            }
          } else {
            control.markAsPristine();
          }
        }
      );
    }

    this.enableButtons(true, false, false);

  }

  loadtable(query : string) {
    this.itemService.getAll(query).then((items) => {
      this.items = items;
    }).catch((err) => {
      console.error(err)
    }).finally(() =>{
      this.data = new MatTableDataSource(this.items);
      this.data.paginator = this.paginator;
    })
  }

  selectImage(e: any): void {
    if (e.target.files) {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any) => {
        this.imageempurl = event.target.result;
        this.itemForm.controls['photo'].clearValidators();
      }
    }
  }

  clearImage(): void {
    this.imageempurl = 'assets/default.png';
    this.itemForm.controls['photo'].setErrors({'required': true});
  }

  search(){
    let itemName = this.itemSearchForm.controls['ssname'].value;
    let itemBrandName = this.itemSearchForm.controls['ssbrand'].value;
    let itemCategory  = this.itemSearchForm.controls['sscateogry'].value;
    let itemSubcategory  = this.itemSearchForm.controls['sssubcateogry'].value;
    let itemStatus  = this.itemSearchForm.controls['ssstatus'].value;
    let itemdateointroducedStart  = this.rangepicker.controls['ssdointroducedStart'].value;
    let itemdateointroducedEnd  = this.rangepicker.controls['ssdointroducedEnd'].value;

    console.log(itemdateointroducedStart,itemdateointroducedEnd)


    let query = "";

    if (itemName != null){query = query + "&itemname=" + itemName;}

    if (itemBrandName != null){query = query + "&brandname=" + itemBrandName;}

    if (itemCategory != null){query = query + "&categoryname=" + itemCategory; }

    if (itemSubcategory != null){query = query + "&subcategoryname=" + itemSubcategory;}

    if (itemStatus != null){query = query + "&staus=" + itemStatus;}

    if (itemdateointroducedStart != null && itemdateointroducedEnd !=null){
      itemdateointroducedStart = this.datePipe.transform(new Date(itemdateointroducedStart), 'yyyy-MM-dd');
      itemdateointroducedEnd = this.datePipe.transform(new Date(itemdateointroducedEnd), 'yyyy-MM-dd');

      query = query + "&before=" + itemdateointroducedStart;
      query = query + "&after=" + itemdateointroducedEnd;

      console.log(query);
    }

    if (query != null) query = query.replace(/^./, '?');

    this.loadtable(query);
  }

  searchClear(){
    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.itemSearchForm.reset();
        this.loadtable("");
      }
    });
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Item Add ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      this.item = this.itemForm.getRawValue();

      this.item.photo = btoa(this.imageempurl);

      let itemdata: string = "";

      itemdata = itemdata + "<br>Code is : " + this.item.code;
      itemdata = itemdata + "<br>Name is : " + this.item.name;

      const confirm = this.matDialog.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Item Add",
          message: "Are you sure to Add the following Item? <br> <br>" + itemdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          this.itemService.add(this.item).then((responce: [] | undefined) => {
            if (responce != undefined) { // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              console.log("undefined");
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.itemForm.reset();
              this.clearImage();
              Object.values(this.itemForm.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadtable("");
            }

            const stsmsg = this.matDialog.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status - Item Add", message: addmessage}
            });

            stsmsg.afterClosed().subscribe(async result => {
              if (!result) {
                return;
              }
            });
          });
        }
      });
    }
  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.itemForm.controls) {
      const control = this.itemForm.controls[controlName];
      if (control.errors) {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    return errors;
  }

  clear(){

    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Item Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.itemForm.reset();
        this.clearImage();
        this.selectedRow = null;
        this.createForm();
      }
    });
  }

  fillForm(row: Item){

    this.enableButtons(false, true, true);

    this.selectedRow = row;

    this.item = row;
    this.oldItem = row;

    if (this.item.photo != null) {
      this.imageempurl = atob(this.item.photo);
      console.log(this.item.photo.length)
      this.itemForm.controls['photo'].clearValidators();
    } else {
      this.clearImage();
    }
    this.item.photo = "";

    //@ts-ignore
    this.item.itemstatus = this.itemstatses.find(itms => itms.id === this.item.itemstatus.id);

    //@ts-ignore
    this.item.brand = this.brands.find(brnad => brnad.id === this.item.brand.id);

    //@ts-ignore
    this.item.subcategory = this.subcategories.find(subc => subc.id === this.item.subcategory.id);

    //@ts-ignore
    this.item.unittype = this.unittypes.find(unt => unt.id === this.item.unittype.id);

    //@ts-ignore
    this.itemForm.controls['category'].setValue(this.categories.find(cat => cat.id === this.item.subcategory.category.id));
    this.itemForm.patchValue(this.item);
    this.itemForm.markAsPristine();
  }

  filterTable() {
    const cserchdata = this.csSearchForm.getRawValue();

    this.data.filterPredicate = (item: Item, filter: string) => {
      return (cserchdata.cscode == null || item.code.toLowerCase().includes(cserchdata.cscode.toLowerCase())) &&
       (cserchdata.csname == null || item.name.toLowerCase().includes(cserchdata.csname.toLowerCase())) &&
       (cserchdata.cssprice == null || item.sprice.toString().toLowerCase().includes(cserchdata.cssprice.toLowerCase()))
    };

    this.data.filter = 'xx';
  }
  enableButtons(add: boolean, upd: boolean, del: boolean){
    this.enaAdd = add;
    this.enaUpd = upd;
    this.enaDel = del;
  }

  getUpdates() : string{
    let updates = '';
    for (const controlName in this.itemForm.controls) {
      const control = this.itemForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "Item " + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Updates <br>";
      }
    }
    return updates;
  }
  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.matDialog.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Item Update ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.matDialog.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Item Update",
            message: "Are you sure to Save the following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.item = this.itemForm.getRawValue();

            if (this.itemForm.controls['photo'].dirty) this.item.photo = btoa(this.imageempurl);
            else this.item.photo = this.oldItem.photo

            this.item.id = this.oldItem.id;

            this.itemService.update(this.item).then((responce: [] | undefined) => {
              if (responce != undefined) {
                // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) {
                  // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.itemForm.reset();
                this.clearImage();
                Object.values(this.itemForm.controls).forEach(control => { control.markAsTouched(); });
                this.loadtable("");
              }

              const stsmsg = this.matDialog.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Item Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
            });
          }
        });
      }
      else {
        const updmsg = this.matDialog.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Item Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });
      }
    }
  }

  delete() {

    const confirm = this.matDialog.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Item Delete",
        message: "Are you sure to Delete following Item? <br> <br>" + this.item.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.itemService.delete(this.item.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        } ).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.itemForm.reset();
            this.clearImage();
            Object.values(this.itemForm.controls).forEach(control => { control.markAsTouched(); });
            this.loadtable("");
          }

          const stsmsg = this.matDialog.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Item Delete ", message: delmessage}
          });
          stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

        });
      }
    });
  }
}
