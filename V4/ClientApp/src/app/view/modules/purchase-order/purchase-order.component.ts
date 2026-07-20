import {Component, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Item} from "../../../entity/item";
import {Puoitems} from "../../../entity/puoitems";
import {Puorder} from "../../../entity/puorder";
import {MatPaginator} from "@angular/material/paginator";
import {UiAssist} from "../../../util/ui/ui.assist";
import {Puostatus} from "../../../entity/puostatus";
import {Employee} from "../../../entity/employee";
import {Supplier} from "../../../entity/supplier";
import {ItemService} from "../../../service/itemservice";
import {EmployeeService} from "../../../service/employeeservice";
import {SupplierService} from "../../../service/supplierservice";
import {RegexService} from "../../../service/regexservice";
import {MatDialog} from "@angular/material/dialog";
import {DatePipe} from "@angular/common";
import {AuthorizationManager} from "../../../service/authorizationmanager";
import {PuoderService} from "../../../service/puoderservice";
import {PuostatusService} from "../../../service/puostatusservice";
import {ConfirmComponent} from "../../../util/dialog/confirm/confirm.component";
import {MessageComponent} from "../../../util/dialog/message/message.component";

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit{

  columns: string[] = ['ponumber', 'employee', 'postatus', 'date', 'description', 'expectedcost'];
  headers: string[] = ['Ponumber', 'Employee', 'Status', 'Date', 'Description', 'Expected Cost'];
  binders: string[] = ['puonumber', 'employee.callingname', 'puostatus.name', 'date', 'description', 'expectedcost'];

  cscolumns: string[] = ['csponumber', 'csemployee', 'cspostatus', 'csdate', 'csdescription', 'csexpectedcost'];
  csprompts: string[] = ['Search by Ponumber', 'Search by Employee', 'Search by Status', 'Search by Date', 'Search by Description', 'Search by Expected Cost'];

  incolumns: string[] = ['item', 'qty', 'explinetotal', 'remove'];
  inheaders: string[] = ['Item', 'QTY', 'Line total', 'Remove',];
  inbinders: string[] = ['item.name', 'qty', 'linecost', 'getBtn()'];

  innerdata: any;
  oldinnerdata: any;

  indata!: MatTableDataSource<Puoitems>;
  innerform!: FormGroup;
  items: Array<Item> = [];
  poitems: Array<Puoitems> = [];
  poitemsChanges: Array<Puoitems> = [];

  poitem!: Puoitems;
  olPoitem!: Puoitems;

  today = new Date();

  public csearch!: FormGroup;
  public ssearch!: FormGroup;
  public puordrForm!: FormGroup;

  purorder!: Puorder;
  oldpurorder!: Puorder;

  purorders: Array<Puorder> = [];
  data!: MatTableDataSource<Puorder>;
  imageurl: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  imageempurl: string = 'assets/default.png'
  uiassist: UiAssist;

  regexes: any;
  selectedrow: any;

  postatuses: Array<Puostatus> = [];
  employees: Array<Employee> = [];
  suppliers: Array<Supplier> = [];

  enaAdd: boolean = false;
  enaUpd: boolean = false;
  enaDel: boolean = false;

  hasInsertAuthority: boolean = false;
  hasUpdateAuthority: boolean = false;
  hasDeleteAuthority: boolean = false;


  constructor(
    private puoderService: PuoderService,
    private puostatusService: PuostatusService,
    private itemService: ItemService,
    private employeeService: EmployeeService,
    private supplierService: SupplierService,
    private regexService: RegexService,
    private formBuilder: FormBuilder,
    private dialogBuilder: MatDialog,
    private datePipe: DatePipe,
    public authService: AuthorizationManager) {

    this.uiassist = new UiAssist(this);

    this.csearch = this.formBuilder.group({
      csponumber: new FormControl(),
      csemployee: new FormControl(),
      cspostatus: new FormControl(),
      csdate: new FormControl(),
      csdescription: new FormControl(),
      csexpectedcost: new FormControl(),
    });

    this.ssearch = this.formBuilder.group({
      ssponumber: new FormControl(),
      sspostatus: new FormControl(),
    });

    this.puordrForm = this.formBuilder.group({
      "puonumber": new FormControl('', [Validators.required]),
      "date": new FormControl(this.today, [Validators.required]),
      "expectedcost": new FormControl('', [Validators.required]),
      "description": new FormControl('', [Validators.required]),
      "puostatus": new FormControl('', [Validators.required]),
      "employee": new FormControl('', [Validators.required]),
      "supplier": new FormControl('', [Validators.required]),
    }, {updateOn: 'change'});

    this.innerform = this.formBuilder.group({
      "item": new FormControl('', [Validators.required]),
      "qty": new FormControl(0, [Validators.required]),
      "linecost": new FormControl(0.0, [Validators.required]),
    }, {updateOn: 'change'});

  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {

    this.createView();

    this.puostatusService.getAllList().then((vsts: Puostatus[]) => {
      this.postatuses = vsts;
    });

    this.employeeService.getAll('').then((vsts: Employee[]) => {
      this.employees = vsts;
    });

    this.supplierService.getAll('').then((vsts: Supplier[]) => {
      this.suppliers = vsts;
    });

    this.itemService.getAll('').then((vsts: Item[]) => {
      this.items = vsts;
    });

    // this.rs.get('purorder').then((regs: []) => {
    //   this.regexes = regs;
    //
    // });
    this.createForm();

    const authoritiesArray = this.authService.getAuthorities();
    if (authoritiesArray !== undefined && Array.isArray(authoritiesArray)) {
      const authorities = this.authService.extractAuthorities(authoritiesArray);
      this.buttonStates(authorities);
    }
  }

  createView() {
    this.imageurl = 'assets/pending.gif';
    this.loadTable("");
  }

  createForm() {

    this.puordrForm.controls['puonumber'].setValidators([Validators.required]);
    this.puordrForm.controls['date'].setValidators([Validators.required]);
    this.puordrForm.controls['expectedcost'].setValidators([Validators.required]);
    this.puordrForm.controls['description'].setValidators([Validators.required]);
    this.puordrForm.controls['puostatus'].setValidators([Validators.required]);
    this.puordrForm.controls['employee'].setValidators([Validators.required]);
    this.puordrForm.controls['supplier'].setValidators([Validators.required]);

    this.innerform.controls['item'].setValidators([Validators.required]);
    this.innerform.controls['qty'].setValidators([Validators.required, Validators.pattern(/^\d+$/)]);
    this.innerform.controls['linecost'].setValidators([Validators.required]);


    Object.values(this.puordrForm.controls).forEach(control => {
      control.markAsTouched();
    });

    for (const controlName in this.puordrForm.controls) {
      const control = this.puordrForm.controls[controlName];
      control.valueChanges.subscribe(value => {
          // @ts-ignore
          if (controlName == "date" || controlName == "date")
            value = this.datePipe.transform(new Date(value), 'yyyy-MM-dd');

          if (this.oldpurorder != undefined && control.valid) {
            // @ts-ignore
            if (value === this.purorder[controlName]) {
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

  enableButtons(add: boolean, upd: boolean, del: boolean): void {
    this.enaAdd = add;
    this.enaUpd = upd;
    this.enaDel = del;
  }

  buttonStates(authorities: { module: string; operation: string }[]): void {
    this.hasInsertAuthority = authorities.some(authority => authority.module === 'purchase order' && authority.operation === 'insert');
    this.hasUpdateAuthority = authorities.some(authority => authority.module === 'purchase order' && authority.operation === 'update');
    this.hasDeleteAuthority = authorities.some(authority => authority.module === 'purchase order' && authority.operation === 'delete');
  }

  loadTable(query: string) {

    this.puoderService.getAll(query)
      .then((emps: Puorder[]) => {
        this.purorders = emps;
        this.imageurl = 'assets/fullfilled.png';
      })
      .catch((error) => {
        this.imageurl = 'assets/rejected.png';
      })
      .finally(() => {
        this.data = new MatTableDataSource(this.purorders.slice().reverse());
        this.data.paginator = this.paginator;
      });

  }

  filterTable(): void {

    const cserchdata = this.csearch.getRawValue();

    this.data.filterPredicate = (purorder: Puorder, filter: string) => {
      // @ts-ignore
      return (cserchdata.csponumber == null || purorder.ponumber.toLowerCase().includes(cserchdata.csponumber.toLowerCase())) &&
        (cserchdata.csemployee == null || purorder.employee.fullname.toLowerCase().includes(cserchdata.csemployee.toLowerCase())) &&
        (cserchdata.cspostatus == null || purorder.puostatus.name.toLowerCase().includes(cserchdata.cspostatus.toLowerCase())) &&
        (cserchdata.csdescription == null || purorder.description.toLowerCase().includes(cserchdata.csdescription.toLowerCase())) &&
        (cserchdata.csexpectedcost == null || purorder.expectedcost == cserchdata.csexpectedcost) &&
        (cserchdata.csdate == null || purorder.date.includes(cserchdata.csitem.toLowerCase()));
    };

    this.data.filter = 'xx';

  }



  btnSearchMc(): void {

    this.csearch.reset();
    const sserchdata = this.ssearch.getRawValue();

    let ponumber = sserchdata.ssponumber;
    let postatusid = sserchdata.sspostatus;

    let query = "";

    if (ponumber != null && ponumber.trim() != "") query = query + "&ponumber=" + ponumber;
    if (postatusid != null) query = query + "&postatusid=" + postatusid;

    if (query != "") query = query.replace(/^./, "?")

    this.loadTable(query);

  }

  btnSearchClearMc(): void {

    const confirm = this.dialogBuilder.open(ConfirmComponent, {
      width: '500px',
      data: {heading: "Search Clear", message: "Are you sure to Clear the Search?"}
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.csearch.reset();
        this.ssearch.reset();
        this.loadTable("");
      }
    });

  }

  getErrors(): string {

    let errors: string = "";

    for (const controlName in this.puordrForm.controls) {
      const control = this.puordrForm.controls[controlName];
      if (control.errors) {
        errors = errors + "<br>Invalid " + controlName;
      }
    }
    return errors;
  }

  fillForm(purorder: Puorder) {

    this.enableButtons(false, true, true);

    this.selectedrow = purorder;

    this.purorder = JSON.parse(JSON.stringify(purorder));
    this.oldpurorder = JSON.parse(JSON.stringify(purorder));


    //@ts-ignore
    this.purorder.puostatus = this.postatuses.find(s => s.id === this.purorder.puostatus.id);
    //@ts-ignore
    this.purorder.employee = this.employees.find(e => e.id === this.purorder.employee.id);
    //@ts-ignore
    this.purorder.supplier = this.suppliers.find(e => e.id === this.purorder.supplier.id);

    this.indata = new MatTableDataSource(this.purorder.puoitems);
    this.puordrForm.patchValue(this.purorder);
    this.puordrForm.markAsPristine();
  }

  add() {

    let errors = this.getErrors();

    if (errors != "") {
      const errmsg = this.dialogBuilder.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Purchase Order Add ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });
    } else {


      this.purorder = this.puordrForm.getRawValue();
      this.purorder.puoitems = this.poitems;
      // @ts-ignore
      this.poitems.forEach((i) => delete i.id);

      let vehdata: string = "";

      // vehdata = vehdata + "<br>Ponumber is : " + this.purorder.ponumber;

      const confirm = this.dialogBuilder.open(ConfirmComponent, {
        width: '500px',
        data: {
          heading: "Confirmation - Purchase Order Add",
          message: "Are you sure to Add the following Purorder? <br> <br>" + vehdata
        }
      });

      let addstatus: boolean = false;
      let addmessage: string = "Server Not Found";

      confirm.afterClosed().subscribe(async result => {
        if (result) {
          this.puoderService.add(this.purorder).then((responce: [] | undefined) => {
            if (responce != undefined) {
              // @ts-ignore
              addstatus = responce['errors'] == "";
              if (!addstatus) { // @ts-ignore
                addmessage = responce['errors'];
              }
            } else {
              addstatus = false;
              addmessage = "Content Not Found"
            }
          }).finally(() => {

            if (addstatus) {
              addmessage = "Successfully Saved";
              this.puordrForm.reset();
              this.createForm();
              Object.values(this.puordrForm.controls).forEach(control => {
                control.markAsTouched();
              });
              this.loadTable("");
              this.indata.data = [];
            }

            const stsmsg = this.dialogBuilder.open(MessageComponent, {
              width: '500px',
              data: {heading: "Status -Purchase Order Add", message: addmessage}
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

  update() {

    let errors = this.getErrors();

    if (errors != "") {

      const errmsg = this.dialogBuilder.open(MessageComponent, {
        width: '500px',
        data: {heading: "Errors - Purchase Order Update ", message: "You have the following Errors <br> " + errors}
      });
      errmsg.afterClosed().subscribe(async result => {
        if (!result) {
          return;
        }
      });

    } else {

      let updates: string = this.getUpdates();

      if (updates != "") {

        let updstatus: boolean = false;
        let updmessage: string = "Server Not Found";

        const confirm = this.dialogBuilder.open(ConfirmComponent, {
          width: '500px',
          data: {
            heading: "Confirmation - Purchase Order Update",
            message: "Are you sure to Save following Updates? <br> <br>" + updates
          }
        });
        confirm.afterClosed().subscribe(async result => {
          if (result) {
            this.purorder = this.puordrForm.getRawValue();
            this.purorder.puoitems = this.poitems;

            this.purorder.id = this.oldpurorder.id;

            // @ts-ignore
            this.poitems.forEach((i) => delete i.id);


            // @ts-ignore
            this.purorder.date = this.datePipe.transform(this.purorder.date, "yyyy-MM-dd");

            this.puoderService.update(this.purorder).then((responce: [] | undefined) => {
              if (responce != undefined) { // @ts-ignore
                updstatus = responce['errors'] == "";
                if (!updstatus) { // @ts-ignore
                  updmessage = responce['errors'];
                }
              } else {
                updstatus = false;
                updmessage = "Content Not Found"
              }
            }).finally(() => {
              if (updstatus) {
                updmessage = "Successfully Updated";
                this.puordrForm.reset();
                this.innerform.reset();
                this.loadTable("");
                this.indata.data = [];
                Object.values(this.puordrForm.controls).forEach(control => {
                  control.markAsTouched();
                });
              }

              const stsmsg = this.dialogBuilder.open(MessageComponent, {
                width: '500px',
                data: {heading: "Status -Purchase Order Update", message: updmessage}
              });
              stsmsg.afterClosed().subscribe(async result => {
                if (!result) {
                  return;
                }
              });

            });
          }
        });
      } else {

        const updmsg = this.dialogBuilder.open(MessageComponent, {
          width: '500px',
          data: {heading: "Confirmation - Purchase Order Update", message: "Nothing Changed"}
        });
        updmsg.afterClosed().subscribe(async result => {
          if (!result) {
            return;
          }
        });

      }
    }


  }

  getUpdates(): string {

    let updates: string = "";
    for (const controlName in this.puordrForm.controls) {
      const control = this.puordrForm.controls[controlName];
      if (control.dirty) {
        updates = updates + "<br>" + controlName.charAt(0).toUpperCase() + controlName.slice(1) + " Changed";
      }
    }

    updates = updates + this.getInnerDataUpdates();

    return updates;
  }

  getInnerDataUpdates(): string {
    let updates: string = "";

    if (this.poitemsChanges.length > 0) {
      updates = updates + "<br>" + "Purchase Order Items Changed";
      this.poitemsChanges = [];
    }
    return updates;
  }

  delete() {

    const confirm = this.dialogBuilder.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Purchase Order Delete",
        message: "Are you sure to Delete following Purorder? <br> <br>" + this.purorder.puonumber
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        let delstatus: boolean = false;
        let delmessage: string = "Server Not Found";

        this.puoderService.delete(this.purorder.id).then((responce: [] | undefined) => {

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
            this.puordrForm.reset();
            Object.values(this.puordrForm.controls).forEach(control => {
              control.markAsTouched();
            });
            this.loadTable("");
            this.indata.data = [];
          }

          const stsmsg = this.dialogBuilder.open(MessageComponent, {
            width: '500px',
            data: {heading: "Status - Purchase Order Delete ", message: delmessage}
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

  clear(): void {
    const confirm = this.dialogBuilder.open(ConfirmComponent, {
      width: '500px',
      data: {
        heading: "Confirmation - Purchase Order Clear",
        message: "Are you sure to Clear following Details ? <br> <br>"
      }
    });

    confirm.afterClosed().subscribe(async result => {
      if (result) {
        this.puordrForm.reset()
        this.createForm();
        this.indata.data = [];
        this.selectedrow = null;
      }
    });
  }

  btnaddMc() {

    let id = 0;
    //Extract Form Data
    this.innerdata = this.innerform.getRawValue();

    if (this.innerdata != null) {
      //Calculate linecost
      let explinetotal = this.innerform.controls['linecost'].value;

      //Create a New Puoitems Instance:
      let poitem = new Puoitems(id, this.innerdata.qty, explinetotal, this.innerdata.item);

      //Copy Existing Data to Temporary Array
      let tem: Puoitems[] = [];
      if (this.indata != null) this.indata.data.forEach((i) => tem.push(i));

      //Copy Data to poitems
      this.poitems = [];
      tem.forEach((t) => this.poitems.push(t));

      //Add New poitem to poitems and Track Changes
      this.poitems.push(poitem);
      this.poitemsChanges.push(poitem);
      //Update the Table Data Source
      this.indata = new MatTableDataSource(this.poitems);

      //Increment the ID
      id++;
      //Recalculate Grand Total
      this.calculateGrandTotal();
      this.innerform.reset();
    }
  }

  calculateGrandTotal() {

    let expectedcost = 0;
    this.indata.data.forEach((m) => {
      expectedcost = expectedcost + m.linecost
    })
    let roundedValue = parseFloat(expectedcost.toString()).toFixed(2);
    this.puordrForm.controls['expectedcost'].setValue(roundedValue);
  }

  deleteRaw(x: any) {

    //Retrieve Existing Data Source
    let datasources = this.indata.data

    //Find the Index of the Item to Delete
    const index = datasources.findIndex(m => m.id === x.id);
    //Remove the Item if it Exists
    if (index > -1) {
      datasources.splice(index, 1);
    }
    //Update the Data Source
    this.indata.data = datasources;
    //Track Changes
    this.poitemsChanges.push(x);
    //Update the Displayed Items
    this.poitems = this.indata.data;

    this.calculateGrandTotal();
  }

  calculateLinecost() {
    let itemPrice = parseFloat(this.innerform.controls['item'].value?.pprice || 0);
    let roundedValue = Math.round(itemPrice * 100) / 100; // Round to 2 decimal places
    let quantity = this.innerform.controls['qty'].value || 0; // Default to 0 if quantity is null or undefined

    // Calculate line cost and set it, defaulting to 0.0 if inputs are invalid
    let lineCost = roundedValue * quantity || 0.0;
    this.innerform.controls['linecost'].setValue(lineCost);
  }

}
