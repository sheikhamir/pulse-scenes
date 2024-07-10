import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Controller } from "src/interfaces/Controller";
import {logMessages} from "@angular-devkit/build-angular/src/builders/browser-esbuild/esbuild";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() item!: Controller;
  @Input() active: boolean = false;
  @Output() click = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  clicked(event: any, item: Controller) {
    // Checks if this is a toggle button
    let sendValue = item.toggle && item.current_value === item.setValue
      ? item.toggleValue
      : item.setValue;
    this.click.emit({handle: item.handle, value: sendValue, item: item, event: event});
  }

}
