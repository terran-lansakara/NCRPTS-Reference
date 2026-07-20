import {Supplier} from "./supplier";
import {Category} from "./category";

export class Supplies{

  public id !: number;

  public supplier!: Supplier;

  public category!: Category;

  constructor(category : Category) {
    this.category = category;
  }

}





