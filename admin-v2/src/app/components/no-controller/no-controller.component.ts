import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-no-controller',
  templateUrl: './no-controller.component.html',
  styleUrls: ['./no-controller.component.css']
})
export class NoControllerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  createComponent(event: Event, type: string) {

  }

}
