import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Fader } from "src/interfaces/Controller";

@Component({
  selector: 'app-fader',
  templateUrl: './fader.component.html',
  styleUrls: ['./fader.component.css']
})
export class FaderComponent implements OnInit {
  @Input() item!: Fader;
  value: number = 0;

  // This will be sent to the parent
  @Output() change = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  detectChange(e: any) {
    this.value = e.target.value;
  }

  percentage(v: any) {
    v = parseInt(v);
    return (100 * (v / 65535)).toFixed(1);
  }

  // Runs when the slider is changed
  input(event: any, item: Fader) {
    this.change.emit({handle: item.handle, value: event.target.value, item: item, event: event})
  }

}
