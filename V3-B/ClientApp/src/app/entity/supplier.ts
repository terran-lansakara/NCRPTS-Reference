import {Employee} from "./employee";
import {SupplierStatus} from "./supplierstatus";
import {SupplierType} from "./suppliertype";
import {Supplies} from "./supplies";

export class Supplier{

  public id !: number;
  public name !: string;
  public registernumber !: string;
  public doregister !: string;
  public address !: string;
  public email !: string;
  public mobile !: string;
  public description !: string;
  public supplierstatus !: SupplierStatus;
  public suppliertype !: SupplierType;
  public regemployee !: Employee;
  public supplies !: Array<Supplies>;


  constructor() {
  }

}





