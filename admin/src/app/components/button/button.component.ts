import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Button } from "src/interfaces/Controller";

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  @Input() item!: Button;
  @Input() active: boolean = false;
  @Output() click = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  clicked(event: any, item: Button) {
    // Checks if this is a toggle button
    let sendValue = item.toggle && item.current_value === item.setValue
      ? item.toggleValue
      : item.setValue;
    // this.click.emit({handle: item.handle, value: sendValue, item: item, event: event});
  }

  getStyle() {
    let style = '';
    // Adds the additional css
    style += this.item.css; // Commented - to be reviewed
    return style;
  }

}
