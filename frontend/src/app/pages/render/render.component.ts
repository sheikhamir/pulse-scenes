import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { Controller, Button, Fader, Icon, Image, Label, Meter, Text, CSS } from "src/interfaces/Controller";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { SyncService } from "src/app/services/sync.service";
import { DataService } from "src/app/services/data.service";
import { environment as env } from "src/environments/environment";
import { Observable, of } from "rxjs";
import { CdkDragDrop, CdkDragEnd, CdkDragRelease } from "@angular/cdk/drag-drop";
// import { ResizeEvent } from 'angular-resizable-element';
// import { Helpers } from "src/app/helpers";

@Component({
  selector: 'app-audio-input',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css']
})
export class RenderComponent implements OnInit {

  loading: boolean = true;
  // floorId!: number;
  // floorSlug!: string;
  controllers!: Controller[] | any[];
  pageCSS: CSS = {
    css: '',
    pageId: 0
  };
  apiOptions = {
    pageId: 0
  }
  history: any[] = [];
  @Output() focused = new EventEmitter();
  selectedItem?: Controller;
  // During action
  position = {top: 0, left: 0, topPercent: 0, leftPercent: 0};
  // Drag position coordinates
  dragPosition = {x: 0, y: 0};
  // Style element
  styleElement!: HTMLStyleElement;

  // pageChanges!: Observable<string|number>;

  constructor(
    private activeRoute: ActivatedRoute,
    private api: ApiService,
    private dataService: DataService,
    private renderer: Renderer2,
    private sock: SyncService
  ) {
    if (this.activeRoute.snapshot.params['id']) {
      this.apiOptions.pageId = this.activeRoute.snapshot.params['id'];
      this.pageCSS.pageId = this.apiOptions.pageId;
    } else {
      this.apiOptions.pageId = 0;
      this.pageCSS.pageId = 0;
    }
  }

  ngOnInit(): void {
    // console.log("ngOnInit ran!", "CurrentPage:", this.apiOptions.pageId);
    // This will make sure to fetch the controllers
    // only when the page is changed
    this.activeRoute.paramMap.subscribe(params => {
      if (this.activeRoute.snapshot.params['id']) {
        this.apiOptions.pageId = this.activeRoute.snapshot.params['id'];
      } else {
        this.apiOptions.pageId = 0;
      }
      // Broadcast the cpi (Current Page ID)
      this.dataService.emitInternalData('all', 'cpi', {pageId: this.apiOptions.pageId});
      // Loads the CSS files before controllers
      this.api.getCSS({pageId: this.apiOptions.pageId}).subscribe(
        (response: CSS) => {
          this.pageCSS = response;
          // Render CSS
          this.styleElement = this.renderer.createElement('style');
          // Append <style> element to the <head> of the document
          this.renderer.appendChild(document.head, this.styleElement);
          // Update the CSS with fetched CSS
          this.applyCSS(this.pageCSS);
          // Loads all the controllers
          this.api.getControllers(this.apiOptions).subscribe(
            (controllers: Controller[]) => {
              this.controllers = controllers;
              this.loading = false;
              this.initSync();
            }
          )
          // For syncing to the device
          this.sock.messages.subscribe(item => {
            this.controllers.map(controller => {
              // If the item exists and if the item value is 0
              // The value of the item can be zero; The value is between 0 - 65535
              if (item[controller.handle] || item[controller.handle] === 0) {
                // For meters and faders/sliders
                if (controller.type === 'meter' || controller.type === 'fader') {
                  controller.current_value = item[controller.handle];
                  // console.log("Handle:", controller.handle, "item.controller.handle:", item[controller.handle])
                }
                // For buttons
                if (controller.type === 'button') {
                  controller.current_value = item[controller.handle];
                  // console.log("Handle:", controller.handle, "item.controller.handle:", item[controller.handle])
                }
              }
            })
          })
          // console.log(this.apiOptions);
        }
      )
    });
  }

  initSync() {
    let syncControllers = this.sock.liveControllers;
    // console.log(syncControllers);
    if (syncControllers && this.controllers) {
      this.controllers.map(controller => {
        // If the item exists and if the item value is 0
        // The value of the item can be zero; The value is between 0 - 65535
        if (syncControllers[controller.handle] || syncControllers[controller.handle] === 0) {
          // For meters and faders/sliders
          if (controller.type === 'meter' || controller.type === 'fader') {
            controller.current_value = syncControllers[controller.handle];
            // console.log("Handle:", controller.handle, "item.controller.handle:", item[controller.handle])
          }
          // For buttons
          if (controller.type === 'button') {
            controller.current_value = syncControllers[controller.handle];
            // console.log("Handle:", controller.handle, "item.controller.handle:", item[controller.handle])
          }
        }
      })
    }
  }

  update(event: any) {
    // Send the command to the socket
    event.handle && this.sock.update(event);
    // event.handle && console.log("SENT", event.handle, event.value);
  }

  getClasses(item: any) {
    return {
      'absolute': item.top,
      ...(item.cssClass && { [item.cssClass]: true }),
      'selected': item.selected,
      //'vertical': (item.type === 'fader' || item.type === 'meter') && item.vertical == true
    };
  }

  getProperties(item: any) {
    let properties = '';
    // Position
    if (item.top) properties += `top:${item.top};`;
    if (item.left) properties += `left:${item.left};`;
    if (item.right) properties += `right:${item.right};`;
    // Dimensions
    if (item.width) properties += `width:${item.width};`;
    if (item.height) properties += `height:${item.height};`;

    return properties;
  }

  applyCSS(item: CSS | '') {
    if (item !== '') this.styleElement.textContent = item.css;
  }

}
