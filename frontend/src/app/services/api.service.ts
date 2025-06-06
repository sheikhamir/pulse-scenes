import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Controller, CSS } from "src/interfaces/Controller";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private api = environment.api;

  constructor(
    private http: HttpClient
  ) { }

  getCSS(options: { [key: string]: string | number | boolean }): Observable<CSS> {
    let url = this.api + "/css?";
    // Access the properties of the object within the function
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        url += '&' + key + '=' + options[key];
      }
    }
    return this.http.get<CSS>(url);
  }

  getControllers(options: { [key: string]: string | number | boolean }): Observable<Controller[]> {
    let url = this.api + "/controllers?";
    // Access the properties of the object within the function
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        url += '&' + key + '=' + options[key];
      }
    }
    return this.http.get<Controller[]>(url);
  }

  getPages(options: { [key: string]: string | number | boolean }): Observable<Controller[]> {
    let url = this.api + "/controllers?";
    // Access the properties of the object within the function
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        url += '&' + key + '=' + options[key];
      }
    }
    return this.http.get<Controller[]>(url);
  }

}
