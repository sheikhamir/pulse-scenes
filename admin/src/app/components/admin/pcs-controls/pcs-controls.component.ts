import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Controller, CSS } from "src/interfaces/Controller";
import { DataService } from "src/app/services/data.service";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";
import { v4 as uuid } from 'uuid';
import { ApiService } from "src/app/services/api.service";
import { Helpers } from "src/app/helpers";

@Component({
  selector: 'app-pcs-controls',
  templateUrl: './pcs-controls.component.html',
  styleUrls: ['./pcs-controls.component.css']
})
export class PcsControlsComponent implements OnInit {

  myForm?: FormGroup;
  selected?: Controller | null;
  showCssForm : boolean = false;
  pageCSS!: CSS;
  newPageCss?: CSS;
  showEditForm: boolean = false;
  newController!: Controller;
  newFormId?: number|string = 0;
  controllers!: Controller[];
  availablePages?: Controller[];

  current_route?: any;
  currentPage?: any = 0;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) {
    // Set the new form object values
    this.resetFormObject();
    this.activatedRoute.paramMap.subscribe(params => {
      this.current_route = params;
    })
    this.apiService.getControllers({type: 'page'}).subscribe((items: Controller[]) => {
      this.availablePages = items;
    });
  }

  ngOnInit(): void {
    this.dataService.internalCommunicationData$.subscribe((broadcast: any) => {
      // Filters out data only to be used here
      if (broadcast.target === 'pcs-controls' || broadcast.target === 'all') {
        // If the page CSS was received
        if (broadcast.action === 'page-css-received') {
          this.pageCSS = broadcast.data.item;
        }
        // If the page CSS was added, it will show the edit form
        if (broadcast.action === 'page-css-added') {
          this.pageCSS = broadcast.data.item;
          this.showCssForm = true;
        }
        // If the controller was selected
        if (broadcast.action === 'controller-selected') {
          this.selected = broadcast.data.item;
        }
        // This will update pageId
        if (broadcast.action === 'navigate') {
          // this.newForm.pageId = broadcast.
          this.selected = null;
          this.resetAddNewForm();
          this.currentPage = broadcast.data.pageId;
          // console.log("Page data:", broadcast);
        }
        if (broadcast.action === 'ajax-put-controller') {
          this.selected = null;
          this.update(false, broadcast.data.item);
        }
        // To update the current page ID on every reload inside any page
        // CPI = Current Page ID
        if (broadcast.action === 'cpi') this.currentPage = broadcast.data.pageId;
        // broadcast.action === 'cpi' && console.log("CurrentPageId: ", this.currentPage);
      }
    });
  }

  showControllerEditForm() {
    this.showEditForm = true;
    let data = {};
    this.newController.pageId = this.currentPage;
    // Send AJAX request
    this.apiService.addController(this.newController).subscribe((newController) => {
      data = {item: newController, action: 'post'};
      // Broadcast the new item
      // this.dataService.sendToPageManager(data);
      this.dataService.emitInternalData('manage-page', 'post', data);
      this.resetAddNewForm();
    });
  }

  showPageCSSForm() {
    this.showCssForm = true;
    if (this.pageCSS) {
      // console.log(this.pageCSS);
    } else {
      let data = {};
      const css: CSS = {
        css: '/* Write your CSS here */',
        pageId: <number>this.currentPage
      }
      // console.log("Submit with page ID:", this.currentPage);
      // Send AJAX request
      this.apiService.addCSS(css).subscribe((newCSS) => {
        data = {item: css, action: 'post'};
        // Broadcast the new item
        this.dataService.emitInternalData('manage-page', 'post-css', data);
      });
    }
  }

  onCSSSubmit() {
    this.showCssForm = false;
    return;
  }

  onChangeCSS() {
    this.apiService.updateCSS(<CSS>this.pageCSS).subscribe((updatedCSS) => {
      const data = {item: updatedCSS, action: 'update-css'};
      // Broadcast the new item
      // this.dataService.sendToPageManager(data);
      this.dataService.emitInternalData('manage-page', data.action, data);
    });
  }

  cancelControllerEdit(event: Event, item: Controller) {
    const data = {item: item, action: 'cancel'}
    this.dataService.sendToPageManager(data);
    this.resetAddNewForm();
  }

  removeController(event: Event, item: Controller) {
    const data = {item: item, action: 'remove'}
    // this.dataService.sendToPageManager(data);
    this.update(true, item, 'delete');
    this.selected = null;
    this.resetAddNewForm();
  }

  beingEdited: boolean = false;
  editingTimer: any;
  onChange(delay: number = 1800) {
    if (this.beingEdited) return;
    this.beingEdited = true;
    // if (this.selected) {
    //   if (this.selected.type === 'page' && this.selected.setValue === '') {
    //     this.selected.setValue = 'self';
    //   } else {
    //     this.selected.setValue = '';
    //   }
    // }
    this.editingTimer = setTimeout(() => {
      this.beingEdited = false;
      this.update(false);
      clearTimeout(this.editingTimer);
    }, delay);
  }

  onSubmit() {
    this.update(true, false, 'done');
    this.selected = null;
    this.resetAddNewForm();
  }

  onUpdate() {}

  private update(reset: boolean = true, item: boolean|Controller = false, action: string = 'put') {
    if (item) {
      const standardisedItem = Helpers.standardise(item);
      // console.log("Standardised:",<Controller>standardisedItem);
      if (action === 'delete') {
        this.apiService.deleteController(<Controller>item).subscribe((response: any) => {
          const data = {item: item, action: action};
          // Broadcast the new item
          // this.dataService.sendToPageManager(data);
          this.dataService.emitInternalData('manage-page', action, data);
        });
        return;
      }
      this.apiService.updateController(<Controller>item).subscribe((updatedController) => {
        const data = {item: updatedController, action: action};
        // Broadcast the new item
        // this.dataService.sendToPageManager(data);
        this.dataService.emitInternalData('manage-page', action, data);
      });
      return;
    }
    if (this.selected) this.selected.pageId = <number>this.selected.pageId;
    this.apiService.updateController(<Controller>this.selected).subscribe((updatedController) => {
      const data = {item: updatedController, action: action};
      // Broadcast the new item
      // this.dataService.sendToPageManager(data);
      this.dataService.emitInternalData('manage-page', action, data);
      reset && this.resetAddNewForm();
    });
  }

  resetAddNewForm() {
    // const data = {item: this.newForm, action: 'cancel'}
    // this.dataService.addNewItem(data);
    this.resetFormObject();
    this.newFormId = 0;
    this.showEditForm = false;
  }

  resetFormObject() {
    // this.newController = {} as Controller;
    this.newController = {
      id: 0,
      type: 'label',
      pageId: this.currentPage,
      css: '',
      cssClass: '',
      active: true,
      width: '100px',
      height: '100px',
      top: '10px',
      left: '10px',

      // Image properties
      srcType: 'external', // Options: local | external
      value: '',
      objectFit: 'contain',

      // Page properties
      targetPage: 'self',
      title: 'Page',

      // Label and flex properties
      // Flex properties
      flexDirection: '',
      flexWrap: '',
      alignContent: '',
      justifyContent: '',
      alignItems: '',
      // Label properties
      tag: 'h1',
      textAlign: 'left',
      // value: 'Label', // Matches with page value

      // Icon properties
      // value: '', // Matches with page and label value

      // Fader properties
      handle: 0,
      min: 0,
      max: 100,
      vertical: true,
      current_value: 0,

      // Meter properties
      // Same as fader

      // Button properties
      // handle
      toggle: false,
      toggleValue: 0,
      setValue: 100,
      // current_value: 0
      label: 'Button',

      // Text properties
      operation: 'value * 24',
      // label: 'Text'
      labelPosition: 'left'
    }
  }

  deselect() {
    this.selected = {} as Controller;
  }

  visible(types: string[]): boolean {

    return true;
  }

}
