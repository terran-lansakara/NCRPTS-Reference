import {Itemstatus} from "./itemstatus";
import {Brand} from "./brand";
import {Unittype} from "./unittype";
import {Subcategory} from "./subcategory";

export class Item {

  public id !: number;
  public name !: string;
  public code !: string;
  public pprice !: number;
  public sprice !: number;
  public photo !: string;
  public quantity !: number;
  public rop !: number;
  public dointroduced !: string;
  public itemstatus !: Itemstatus;
  public brand !: Brand;
  public unittype !: Unittype;
  public subcategory !: Subcategory;

  constructor(id: number, name: string, code: string, pprice: number, sprice: number, photo: string, quantity: number, rop: number, dointroduced: string, itemstatus: Itemstatus, brand: Brand, unittype: Unittype, subcategory: Subcategory) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.pprice = pprice;
    this.sprice = sprice;
    this.photo = photo;
    this.quantity = quantity;
    this.rop = rop;
    this.dointroduced = dointroduced;
    this.itemstatus = itemstatus;
    this.brand = brand;
    this.unittype = unittype;
    this.subcategory = subcategory;
  }
}


