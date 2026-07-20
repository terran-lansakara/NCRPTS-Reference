import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Emptype} from "../entity/emptype";
import {Usrtype} from "../entity/usrtype";
import {SupplierType} from "../entity/suppliertype";

@Injectable({
  providedIn: 'root'
})

export class SupplierTypeService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<SupplierType>> {

    const supplierTypes = await this.http.get<Array<SupplierType>>('http://localhost:8080/suppliertypes/list').toPromise();
    if(supplierTypes == undefined){
      return [];
    }
    return supplierTypes;
  }

}


