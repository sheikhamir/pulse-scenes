import { Component, EventEmitter, OnInit, Output, Renderer2, HostListener, ElementRef } from '@angular/core';
import { Controller, Button, Fader, Icon, Image, Label, Meter, Text, CSS } from "src/interfaces/Controller";
import { Page } from "src/interfaces/Page";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { SyncService } from "src/app/services/sync.service";
import { DataService } from "src/app/services/data.service";
import { environment as env } from "src/environments/environment";
import { Observable, of } from "rxjs";
import { CdkDragDrop, CdkDragEnd, CdkDragRelease } from "@angular/cdk/drag-drop";
import { ResizeEvent } from 'angular-resizable-element';
import { Helpers } from "src/app/helpers";
import { FileDropDirective } from "src/app/directives/file-drop.directive";

@Component({
  selector: 'app-manage-page',
  templateUrl: './manage-page.component.html',
  styleUrls: ['./manage-page.component.css']
})
export class ManagePageComponent implements OnInit {

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
    private el: ElementRef
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
          const data = {item: this.pageCSS, action: 'page-css-received'};
          // Render CSS
          this.styleElement = this.renderer.createElement('style');
          // Append <style> element to the <head> of the document
          this.renderer.appendChild(document.head, this.styleElement);
          // Update the CSS with fetched CSS
          this.applyCSS(this.pageCSS);
          // this.pageCSS.css && this.renderStylesheet(this.pageCSS.css);
          this.dataService.emitInternalData('pcs-controls', 'page-css-received', data);
          // Loads all the controllers
          this.api.getControllers(this.apiOptions).subscribe(
            (controllers: Controller[]) => {
              this.controllers = controllers;
              // this.controllers.forEach(controller => controller.selected = false);
              this.loading = false;
              // console.log(this.apiOptions);
            }
          )
          // console.log(this.apiOptions);
        }
      )
    });
    // Handles all internal communication
    this.dataService.internalCommunicationData$.subscribe((broadcast: any) => {
      if (broadcast === undefined || !broadcast.action) return;
      if (broadcast.target === 'manage-page' || broadcast.target === 'all') {
        if (broadcast.action === 'post-css') {
          this.pageCSS = broadcast.data.item;
          this.applyCSS(this.pageCSS);
          const data = {item: this.pageCSS, action: 'page-css-added'};
          this.dataService.emitInternalData('pcs-controls', data.action, data);
        }
        // For CSS action
        if (broadcast.action === 'update-css') {
          this.pageCSS = broadcast.data.item;
          // Update the CSS with fetched CSS
          this.applyCSS(this.pageCSS);
          console.log("CSS Updated:", this.pageCSS);
        }
        if (broadcast.action === 'navigate') {
          this.pageCSS.css = "/* No CSS */";
          this.applyCSS(this.pageCSS)
        }
        if (typeof performAction[broadcast.action] !== 'function') {
          return;
        }
        console.log(broadcast.action);
        // Performs the action and updates the controllers
        this.controllers = performAction[broadcast.action](this.controllers, broadcast.data, this.apiOptions.pageId);
        broadcast.action === 'post' && this.clicked('new', broadcast.data.item);
      }
    });
  }

  dragging = false;
  clicked(event: any, item: Controller) {
    const data = {item: item, event: event};
    // Checks if it is being dragged
    if (this.dragging) return;
    this.focused.emit(data);
    // Remove "selected" flag from all controllers
    this.controllers.map(controller => controller.selected = false);
    // Sets the clicked controller as selected
    item.selected = true;
    // Emits the event
    this.dataService.emitInternalData('pcs-controls', 'controller-selected', data);
  }

  onDragMoved(event: any, item: Controller) {
    const draggedElement = event.source.element.nativeElement;
    const { offsetLeft, offsetTop } = event.source.element.nativeElement;
    // Fetch the size of the screen
    const screenSize = Helpers.screen();
    const { pageX, pageY, screenX, screenY, offsetX, offsetY } = event.event;
    this.position.left = pageX - offsetX;
    this.position.leftPercent = (pageX - offsetX) / screenSize.width * 100;
    this.position.top = pageY - offsetY;
    this.position.topPercent = (pageY - offsetY) / screenSize.height * 100;
    //console.log(offsetLeft, offsetTop, this.position.top, this.position.left, event);
  }

  onDragEnd(event: any, item: Controller) {
    const oldItem = {...item}

    item.top = this.position.top + 'px';
    item.left = this.position.leftPercent + '%';

    // Deactivate the item
    item.selected = false;

    // Reset the drag position
    this.dragPosition = {x: 0, y: 0};
    const data = {item: item, action: 'position-update'};
    // Broadcast the updated item
    this.dataService.emitInternalData('pcs-controls', 'ajax-put-controller', data);
    // this.history.push({id: item.id, item: {...item}});
    this.addHistory('position', oldItem, item);
    // To disable the form opening when item is clicked
    this.dragging = true;
    setTimeout( () => {
      this.dragging = false;
    }, 150);
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

  addHistory(action: string, old: Controller, updated: Controller) {
    const updates = this.getUpdatedValues(old, updated);
    this.history.push({
      id: updated.id,
      action: action,
      updates: {updates}
    });
    console.log(this.history);
  }

  getUpdatedValues(old: any, updated: any): any | null {
    const updatedValues: any = {};
    for (const key in updated) {
      if (key in old && old[key] !== updated[key]) {
        updatedValues[key] = old[key];
        updatedValues[key] = updated[key];
      }
    }
    return updatedValues;
  }

  onResize(event: ResizeEvent, item: Controller): void {
    item.height = event.rectangle.height + 'px';
    item.top = event.rectangle.top + 'px';
    const screenSize = Helpers.screen();
    const data = {item: item, action: 'resize'};
    // Calculate width and height for slider
    const resizeData = {
      ...data,
      top: event.rectangle.top,
      left: event.rectangle.left,
      leftPercentage: event.rectangle.left / screenSize.width * 100,
      width: event.rectangle.width,
      widthPercentage: event.rectangle.width ? (event.rectangle.width / screenSize.width * 100) : (item.width ? parseFloat( item.width.toString().replace('%', '')) : 0),
      height: event.rectangle.height
    }
    this.dataService.emitInternalData('slider', 'resize', resizeData);
  }

  onResizeEnd(event: ResizeEvent, item: Controller): void {
    const oldItem = {...item}
    item.height = event.rectangle.height + 'px';
    item.top = event.rectangle.top + 'px';

    const screenSize = Helpers.screen();
    item.left = (event.rectangle.left / screenSize.width * 100) + '%';
    item.width = event.rectangle.width ? (event.rectangle.width / screenSize.width * 100) + '%' : item.width;

    // Deactivate the item
    item.selected = false;

    this.addHistory('resize', oldItem, item);
    const data = {item: item, action: 'resize'};
    // Broadcast the updated item
    this.dataService.emitInternalData('pcs-controls', 'ajax-put-controller', data);
    // Calculate width and height for slider
    const resizeData = {
      ...data,
      top: event.rectangle.top,
      left: event.rectangle.left,
      leftPercentage: event.rectangle.left / screenSize.width * 100,
      width: event.rectangle.width,
      widthPercentage: event.rectangle.width ? (event.rectangle.width / screenSize.width * 100) : (item.width ? parseFloat(item.width.toString().replace('%', '')) : 0),
      height: event.rectangle.height
    }
    this.dataService.emitInternalData('slider', 'resize', resizeData);
    console.log('Element was resized', event);
  }

  getPixels(value: string) {
    let percentage = parseFloat( value.replace('%', '') );
    // Ensure percentage is a valid value between 0 and 100
    percentage = Math.min(100, Math.max(0, percentage));
    const screenWidth = window.innerWidth;
    return (percentage / 100) * screenWidth;
  }

  randomValue(item: Controller, min: number, max: number) {
    item.current_value = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(item.current_value);
  }

  renderStylesheet(css: string) {
    // Create <style> element
    // this.styleElement = this.renderer.createElement('style');
    // const styleElement = this.renderer.createElement('style');
    // styleELement.textContent = '';
    // this.renderer.appendChild(styleElement, this.renderer.createText(css));
    // styleElement.textContent = css;

    // Append <style> element to the <head> of the document
    // this.renderer.appendChild(document.head, styleElement);
  }

  files: any[] = [];
  onFileDropped(files: FileList) {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/') && file.size <= 5000000) { // Example: only accept image files under 5MB
        validFiles.push(file);
      } else {
        console.error('Invalid file:', file.name);
      }
    }

    if (validFiles.length > 0) {
      this.processFiles(validFiles);
    }
  }

  processFiles(files: File[]) {
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileData = {
          name: file.name,
          type: file.type,
          url: e.target.result,
          position: { x: 0, y: 0 }
        };
        this.files.push(fileData);
        this.uploadFile(file);
      };
      reader.readAsDataURL(file);
    }
  }

  uploadFile(file: File) {
    console.log("File upload");
    console.log("File:", file);
    // this.fileUploadService.uploadFile(file).subscribe(response => {
    //   console.log('File uploaded successfully', response);
    // }, error => {
    //   console.error('Error uploading file', error);
    // });
  }

  @HostListener('document:drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    console.log('Drop detected in component');
    const boundingRect = document.body.getBoundingClientRect();
    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;

    console.log("Coordinates: ", x, y);

    if (this.files.length > 0) {
      this.files[this.files.length - 1].position = { x, y };
    }
  }

  applyCSS(item: CSS) {
    this.styleElement.textContent = item.css;
  }

}

// The actions here are performed after the AJAX call
const performAction: { [key: string]: (controller: Controller[] | any[], data: any, page?: any) => Controller[] | any[] } = {
  post: function(controllers: Controller[] | any[], data: any, page: any|null) {
    // Adds the default page id (whatever page it is)
    data.item.pageId = page;
    // Adds the new item draft in the controllers list to be able to be displayed
    controllers.push(data.item);
    return controllers;
  },
  put: function(controllers: Controller[] | any[], data: any) {
    return controllers;
  },
  done: function(controllers: Controller[] | any[], data: any) {
    controllers.map(controller => {
      if (controller.id === data.item.id)
        controller.selected = false
    });
    return controllers;
  },
  delete: function(controllers: Controller[] | any[], data: any) {
    console.log("Removed item:", data.item);
    const indexToDelete = controllers.findIndex(controller => controller.id && controller.id === data.item.id);
    if (indexToDelete !== -1) {
      controllers.splice(indexToDelete, 1);
    }
    return controllers;
  }
}
