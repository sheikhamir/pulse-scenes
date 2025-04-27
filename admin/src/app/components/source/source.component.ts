import {Component, Input, OnInit} from '@angular/core';
import { Controller } from "src/interfaces/Controller";

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.css']
})
export class SourceComponent implements OnInit {
  @Input() item!: Controller;

  constructor() { }

  ngOnInit(): void {
  }

}
