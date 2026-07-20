import {Supplier} from "./supplier";
import {Employee} from "./employee";
import {Puostatus} from "./puostatus";
import {Puoitems} from "./puoitems";

export class Puorder {

  public id!: number;
  public puonumber!: string;
  public date!: string;
  public expectedcost!: number;
  public description!: string;
  public puoitems!: Array<Puoitems>;
  public puostatus!: Puostatus;
  public employee!: Employee;
  public supplier!: Supplier;


  constructor(id: number, puonumber: string, date: string, expectedcost: number, description: string, puoitems: Array<Puoitems>, puostatus: Puostatus, employee: Employee, supplier: Supplier) {
    this.id = id;
    this.puonumber = puonumber;
    this.date = date;
    this.expectedcost = expectedcost;
    this.description = description;
    this.puoitems = puoitems;
    this.puostatus = puostatus;
    this.employee = employee;
    this.supplier = supplier;
  }
}
