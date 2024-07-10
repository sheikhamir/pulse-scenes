import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { Controller, LiveControllers } from "src/interfaces/Controller";
import { environment } from "src/environments/environment";
import { Page } from "src/interfaces/Page";

@Injectable({
  providedIn: 'root'
})
export class PageService {

  private api = environment.api

  constructor(
    private http: HttpClient
  ) { }

  get(options: { [key: string]: string | number | boolean }): Observable<Page[]> {
    let url = this.api + "/pages?";
    // Access the properties of the object within the function
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        url += '&' + key + '=' + options[key];
      }
    }
    return this.http.get<Page[]>(url);
  }
}
