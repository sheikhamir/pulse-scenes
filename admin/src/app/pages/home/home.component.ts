import { Component, OnInit } from '@angular/core';
import { Page, Config } from "src/interfaces/Page";
import { ApiService } from "src/app/services/api.service";
import { ResizeEvent } from 'angular-resizable-element';
import {Controller} from "../../../interfaces/Controller";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading: boolean = true;
  controllers!: Controller[];
  config?: Config[];
  apiOptions = {
    type: 'page',
    pageId: 0
  }

  app_name!: string;
  author!: string;
  version!: string;
  client_name!: string;
  title_homepage!: string;
  image_homepage!: string;
  body_background!: string;

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    // Loads all the controllers
    this.api.getPages(this.apiOptions).subscribe(
      (pages: Controller[]) => {
        this.controllers = pages;
        this.loading = false;
      }
    )
    /*this.api.getConfig({}).subscribe(
      (config: Config[]) => {
        this.config = config;
        this.app_name = this.getConfigItem('app_name');
        this.author = this.getConfigItem('author');
        this.version = this.getConfigItem('version');
        this.client_name = this.getConfigItem('client_name');
        this.title_homepage = this.getConfigItem('title_homepage');
        this.image_homepage = this.getConfigItem('image_homepage');
        this.body_background = this.getConfigItem('body_background');
      }
    )*/
  }

  getConfigItem(key: string) {
    if (this.config) {
      const clientNameIndex = this.config.findIndex(item => item.key === key);
      if (clientNameIndex !== -1) {
        return this.config[clientNameIndex].value;
      }
    }
    return ''; // Handle case where config isn't loaded or key not found
  }

  gotFocus($event: any) {
    console.log($event);
  }

  onResizeEnd(event: ResizeEvent): void {
    console.log('Element was resized', event);
  }

}
