import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Supplier} from "../../../entity/supplier";
import {SupplierStatus} from "../../../entity/supplierstatus";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {SupplierService} from "../../../service/supplierservice";
import {SupplierStatusService} from "../../../service/supplierstatusservice";
import {SupplierTypeService} from "../../../service/suppliertypeservice";
import {RegexService} from "../../../service/regexservice";
import {CategoryService} from "../../../service/categoryservice";
import {Category} from "../../../entity/category";
import {MatSelectionList} from "@angular/material/list";
import {EmployeeService} from "../../../service/employeeservice";
import {Employee} from "../../../entity/employee";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {Supplies} from "../../../entity/supplies";
import {MessageComponent} from "../../../util/dialog/message/message.component";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent implements OnInit{

  supplierForm! : FormGroup;
  supplierCsSearchForm! : FormGroup;
  supplierSsSearchForm! : FormGroup;

  imageurl: string = '';

  supplier! : Supplier;
  employees : Array<Employee> = [];
  oldsupplier! : Supplier;

  supplierStatuses: Array<SupplierStatus> = [];
  supplierTypes: Array<SupplierStatus> = [];

  regexes!: any;

  enaAdd! : boolean;
  enaUpd! : boolean;
  enaDel! : boolean;

  hasInsertAuthority!: boolean;
  hasUpdateAuthority!: boolean;
  hasDeleteAuthority!: boolean;

  selectedRow : any;

  categories: Array<Category> = [];
  selectedSupplies: Array<Supplies> =[];

  suppliers : Array<Supplier> = [];
  data!: MatTableDataSource<Supplier>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild('availableCategoryList') availableCategoryList!: MatSelectionList;
  @ViewChild('selectedCategoryList') selectedCategoryList!: MatSelectionList;

  uiassist : UiAssist;

  columns = ['number', 'name', 'regdate', 'mobile', 'status'];
  headers = ['Reg Number', 'Name', 'Register Date', 'Mobile', 'Supplier Status'];
  binders = ['registernumber', 'name', 'doregister', 'mobile', 'supplierstatus.name'];

  cscoloumns = ['csnumber', 'csname', 'cssstatus'];
  cscolpromts = ['Search By Reg: Number', 'Search By Name', 'Search By Status'];
  oldCategories!: Category[];



  constructor(
    private employeeService : EmployeeService,
    private supplierService : SupplierService,
    private supplierStatusService : SupplierStatusService,
    private supplierTypeService : SupplierTypeService,
    private categoryService : CategoryService,
    private regexService : RegexService,
    private formBuilder : FormBuilder,
    private datePipe : DatePipe,
    private authService : AuthorizationManager,
    private dialogBuilder : MatDialog,
  )
  {
    this.uiassist = new UiAssist(this);

    this.supplierForm = this.formBuilder.group({
      name : new FormControl('',[Validators.required]),
      registernumber : new FormControl('',[Validators.required]),
      doregister : new FormControl('',[Validators.required]),
      address : new FormControl('',[Validators.required]),
      email : new FormControl('',[Validators.required]),
      mobile : new FormControl('',[Validators.required]),
      description : new FormControl('',[Validators.required]),
      supplierstatus : new FormControl('',[Validators.required]),
      suppliertype : new FormControl('',[Validators.required]),
      regemployee : new FormControl('',[Validators.required]),
      supplies : new FormControl('',[Validators.required]),
    })

    this.supplierCsSearchForm = this.formBuilder.group({
      csnumber : new FormControl('',[Validators.required]),
      csname : new FormControl('',[Validators.required]),
      cssstatus : new FormControl('',[Validators.required]),
    })

    this.supplierSsSearchForm = this.formBuilder.group({
      ssname : new FormControl('',[Validators.required]),
      ssnumber : new FormControl('',[Validators.required]),
    })
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){

    this.createView();

    this.employeeService.getAllListNameId().then((employees => {
      this.employees = employees;
    }))

    this.supplierStatusService.getAllList().then((statuses => {
      this.supplierStatuses = statuses;
    }))

    this.supplierTypeService.getAllList().then((types => {
      this.supplierTypes = types;
    }))

    this.categoryService.getAllList().then((categories => {
      this.categories = categories;
      this.oldCategories = [...this.categories]; // Save original categories on component initialization
    }))

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }

    this.createForm();
  }

  createView(){
    this.loadTable('');
  }

  createForm() {
    this.supplierForm.controls['name'].setValidators([Validators.required]);
    this.supplierForm.controls['registernumber'].setValidators([Validators.required]);
    this.supplierForm.controls['doregister'].setValidators([Validators.required]);
    this.supplierForm.controls['address'].setValidators([Validators.required]);
    this.supplierForm.controls['email'].setValidators([Validators.required]);
    this.supplierForm.controls['mobile'].setValidators([Validators.required]);
    this.supplierForm.controls['description'].setValidators([Validators.required]);
    this.supplierForm.controls['supplierstatus'].setValidators([Validators.required]);
    this.supplierForm.controls['suppliertype'].setValidators([Validators.required]);
    this.supplierForm.controls['regemployee'].setValidators([Validators.required]);
    this.supplierForm.controls['supplies'].setValidators([Validators.required]);

    Object.values(this.supplierForm.controls).forEach( control => { control.markAsTouched(); } );

    for (const controlName in this.supplierForm.controls) {
      const control = this.supplierForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "doregister")
            value = this.datePipe.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldsupplier != undefined && control.valid) {
            // @ts-ignore
            if (value === this.supplier[controlName]) {
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

    this.enableButtons(true,false,false);
  }

  enableButtons(add: boolean, upd: boolean, del: boolean): void {
    this.enaAdd = add;
    this.enaUpd = upd;
    this.enaDel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'supplier' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'supplier' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'supplier' && authority.operation === 'delete');

  }

  loadTable(query : string) {
    this.supplierService.getAll(query).then((suppliers) => {
      this.suppliers = suppliers;
      this.imageurl = 'assets/fullfilled.png';
    }).catch((err) => {
      console.error(err)
      this.imageurl = 'assets/rejected.png';
    }).finally(() =>{
      this.data = new MatTableDataSource(this.suppliers);
      this.data.paginator = this.paginator;
    })
  }

  filterTable() {
    const cserchdata = this.supplierCsSearchForm.getRawValue();

    this.data.filterPredicate = (supplier: Supplier, filter: string) => {
      return (cserchdata.csnumber == null || supplier.registernumber.toLowerCase().includes(cserchdata.csnumber)) &&
        (cserchdata.csname == null || supplier.name.toLowerCase().includes(cserchdata.csname)) &&
        (cserchdata.cssstatus == null || supplier.supplierstatus.name.toLowerCase().includes(cserchdata.cssstatus))
    };

    this.data.filter = 'xx';
  }

  search() {
    let supName = this.supplierSsSearchForm.controls['ssname'].value;
    let supNumber = this.supplierSsSearchForm.controls['ssnumber'].value;

    let query = "";

    if (supName != null){query = query + "&name=" + supName;}

    if (supNumber != null){query = query + "&regnumber=" + supNumber;}

    if (query != null) query = query.replace(/^./, '?');

    this.loadTable(query);
  }

  searchClear() {
    const confirm = this.dialogBuilder.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.supplierSsSearchForm.reset();
        this.loadTable("");
      }
    });
  }

  rightSelected(): void {
    this.supplier.supplies = this.availableCategoryList.selectedOptions.selected.map(option => {
      // Create new Supply Object
      console.log(option);
      const supplies = new Supplies(option.value);
      this.categories = this.categories.filter(category => category !== option.value); //Remove Selected
      this.selectedSupplies.push(supplies); // Add selected to Right Side
      return supplies;
    });

    this.supplierForm.controls["supplies"].clearValidators();
    this.supplierForm.controls["supplies"].updateValueAndValidity();
  }

  leftSelected(): void {
    const selectedOptions = this.selectedCategoryList.selectedOptions.selected; // Right Side
    selectedOptions.forEach(option => {
      const extSupplies = option.value;
      // Remove from selectedSupplies
      this.selectedSupplies = this.selectedSupplies.filter(supplies => supplies !== extSupplies);
      // Add back to available categories
      this.categories.push(extSupplies.category);
    });
    // Optionally, you may want to update the form control validity
    this.supplierForm.controls["supplies"].clearValidators();
    this.supplierForm.controls["supplies"].updateValueAndValidity();
  }

  rightAll(): void {
    this.supplier.supplies = this.availableCategoryList.selectAll().map(option => {
      const supplies = new Supplies(option.value);
      this.categories = this.categories.filter(category => category !== option.value);
      this.selectedSupplies.push(supplies);
      return supplies;
    });

    this.supplierForm.controls["supplies"].clearValidators();
    this.supplierForm.controls["supplies"].updateValueAndValidity();
  }

  leftAll():void{
    for(let category of this.selectedSupplies) this.categories.push(category.category);
    this.selectedSupplies = [];
  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.supplierForm.controls) {
      const control = this.supplierForm.controls[controlName];

      if (control.errors) {
        if (this.regexes[controlName] != undefined) {
          errors = errors + "<br>" + this.regexes[controlName]['message'];
        } else {
          errors = errors + "<br>Invalid " + controlName;
        }
      }
    }
    return errors;
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dialogBuilder.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Add ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {

      let supplier: Supplier = this.supplierForm.getRawValue();
      this.supplier = supplier;

      let supplierdata: string = "";

      supplierdata = supplierdata + "<br>Reg Number is : " + this.supplier.registernumber;
      supplierdata = supplierdata + "<br>Name is : " + this.supplier.name;

      const confirm = this.dialogBuilder.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - User Add",
          message: "Are you sure to Add the following Supplier? <br> <br>" + supplierdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {

          console.log(JSON.stringify(this.supplier));
          this.supplierService.add(this.supplier).then((responce: [] | undefined) => {
            if (responce != undefined) {
              // @ts-ignore
              console.log("Add-" + responce['id'] + "-" + responce['url'] + "-" + (responce['errors'] == ""));
              // @ts-ignore
              addstatus = responce['errors'] == "";
              console.log("Add Sta-" + addstatus);
              if (!addstatus) {
                // @ts-ignore
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
              this.supplierForm.reset();
              this.selectedSupplies = [];
              Object.values(this.supplierForm.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
            }

            const stsmsg = this.dialogBuilder.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -User Add", message: addmessage}
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

  fillForm(supplier: Supplier) {

    this.enableButtons(false, true, true);
    this.selectedRow = supplier;

    // Deep copy the selected supplier and store the original supplier
    this.supplier = JSON.parse(JSON.stringify(supplier));
    this.oldsupplier = JSON.parse(JSON.stringify(supplier));

    //@ts-ignore - Resolve employee and supplier status relationships
    this.supplier.regemployee = this.employees.find(e => e.id === this.supplier.regemployee.id);
    //@ts-ignore
    this.supplier.supplierstatus = this.supplierStatuses.find(s => s.id === this.supplier.supplierstatus.id);

    this.selectedSupplies = this.supplier.supplies;
    //@ts-ignore
    this.supplier.suppliertype = this.supplierTypes.find(s => s.id === this.supplier.suppliertype.id);

    // Restore the original categories before filtering for the new selection
    this.categories = [...this.oldCategories];
    console.log("Before" + this.categories);

    // Filter the categories based on the new supplier's supplies
    this.supplier.supplies.forEach((supplies) => {
      this.categories = this.categories.filter((c) => c.id != supplies.category.id);
    });

    // console.log("After" + this.categories);

    // Patch form values and mark as pristine
    this.supplierForm.patchValue(this.supplier);
    this.supplierForm.markAsPristine();
  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.supplierForm.controls) {
      const control = this.supplierForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1)+" Changed";
      }
    }
    return updates;
  }

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dialogBuilder.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Supplier Update ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dialogBuilder.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Supplier Update",
            message: "Are you sure to Save folowing Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            //console.log("EmployeeService.update()");
            this.supplier = this.supplierForm.getRawValue();
            this.supplier.id = this.oldsupplier.id;

            this.supplierService.update(this.supplier).then((responce: [] | undefined) => {
              if (responce != undefined) {
                // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            } ).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.supplierForm.reset();
                this.leftAll();
                Object.values(this.supplierForm.controls).forEach(control => { control.markAsTouched(); });
                this.loadTable("");
              }

              const stsmsg = this.dialogBuilder.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status - Supplier Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

            });
          }
        });
      }
      else {

        const updmsg = this.dialogBuilder.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Supplier Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => { if (!result) { return; } });

      }
    }
  }

  delete() : void {

    const confirm = this.dialogBuilder.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Supplier Delete",
        message: "Are you sure to Delete following Supplier? <br> <br>" + this.supplier.name
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.supplierService.delete(this.supplier.id).then((responce: [] | undefined) => {

          if (responce != undefined) { // @ts-ignore
            delstatus = responce['errors'] == "";
            if (!delstatus) { // @ts-ignore
              delmessage = responce['errors'];
            }
          } else {
            delstatus = false;
            delmessage = "Content Not Found"
          }
        }).finally(() => {
          if (delstatus) {
            delmessage = "Successfully Deleted";
            this.supplierForm.reset();
            this.leftAll();
            Object.values(this.supplierForm.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
          }
          const stsmsg = this.dialogBuilder.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Supplier Delete ", message: delmessage}
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

  clear():void{

    const confirm = this.dialogBuilder.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Employee Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.supplierForm.reset();
        this.selectedSupplies = [];
        this.categories = [...this.oldCategories];
        this.selectedRow = null;
        this.createForm();
      }
    });
  }

}
