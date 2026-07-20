import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Puorder} from "../entity/puorder";
import {Item} from "../entity/item";
@Injectable({
  providedIn: 'root'
})

export class PuoderService {

  constructor(private http: HttpClient) {  }

  async delete(id: number): Promise<[]|undefined>{
    //@ts-ignore
    return this.http.delete('http://localhost:8080/puorders/' + id).toPromise();
  }

  async update(puorder: Puorder): Promise<[]|undefined>{
    return this.http.put<[]>('http://localhost:8080/puorders', puorder).toPromise();
  }


  async getAll(query:string): Promise<Array<Puorder>> {
    const puorders = await this.http.get<Array<Puorder>>('http://localhost:8080/puorders'+query).toPromise();
    if(puorders == undefined){
      return [];
    }
    return puorders;
  }

  async add(puorder: Puorder): Promise<[]|undefined>{
    return this.http.post<[]>('http://localhost:8080/puorders', puorder).toPromise();
  }

}


