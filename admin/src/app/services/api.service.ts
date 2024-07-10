import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import {Controller, LiveControllers} from "src/interfaces/Controller";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private api = environment.api

  constructor(
    private http: HttpClient
  ) { }

  getControllers(options: { [key: string]: string | number | boolean }): Observable<Controller[]> {
    let url = this.api + "/controllers?active=true";
    // Access the properties of the object within the function
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        url += '&' + key + '=' + options[key];
      }
    }
    // SA3645000000155283245001
    return this.http.get<Controller[]>(url);
  }
}
