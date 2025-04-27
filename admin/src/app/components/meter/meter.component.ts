import { Component, Input, OnInit } from '@angular/core';
import { Controller } from "src/interfaces/Controller";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-meter',
  templateUrl: './meter.component.html',
  styleUrls: ['./meter.component.css']
})
export class MeterComponent implements OnInit {
  @Input() item!: Controller;
  allowDanger: Boolean = environment.allowDanger;
  dangerLevel: number = environment.dangerLevel;
  value: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  percentage(value: any): number {
    const min = this.item.min;
    const max = <number>this.item.max;
    return (parseInt(value) / max * 100);
  }

  getStyle() {
    let style = '';
    // Adds the additional css
    style += this.item.css; // Commented - to be reviewed
    return style;
  }

}
