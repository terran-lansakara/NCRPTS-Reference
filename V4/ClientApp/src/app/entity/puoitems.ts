import {Supplier} from "./supplier";
import {Employee} from "./employee";
import {Puorder} from "./puorder";
import {Item} from "./item";

export class Puoitems {

  public id!: number;
  public qty!: number;
  public linecost!: number;
  public puorder!: Puorder;
  public item!: Item;


  constructor(id: number, qty: number, linecost: number, item: Item) {
    this.id = id;
    this.qty = qty;
    this.linecost = linecost;
    this.item = item;
  }
}
