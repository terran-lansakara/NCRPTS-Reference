import {Empstatus} from "../entity/empstatus";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Emptype} from "../entity/emptype";
import {Usrtype} from "../entity/usrtype";
import {SupplierStatus} from "../entity/supplierstatus";

@Injectable({
  providedIn: 'root'
})

export class SupplierStatusService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<SupplierStatus>> {

    const supplierStatuses = await this.http.get<Array<SupplierStatus>>('http://localhost:8080/supplierstatuses/list').toPromise();
    if(supplierStatuses == undefined){
      return [];
    }
    return supplierStatuses;
  }

}


