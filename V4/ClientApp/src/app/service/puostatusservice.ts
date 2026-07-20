import {Gender} from "../entity/gender";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Userstatus} from "../entity/userstatus";
import {Puostatus} from "../entity/puostatus";

@Injectable({
  providedIn: 'root'
})

export class PuostatusService {

  constructor(private http: HttpClient) {  }

  async getAllList(): Promise<Array<Puostatus>> {

    const puostatus = await this.http.get<Array<Puostatus>>('http://localhost:8080/puostatuses/list').toPromise();
    if(puostatus == undefined){
      return [];
    }
    return puostatus;
  }

}


