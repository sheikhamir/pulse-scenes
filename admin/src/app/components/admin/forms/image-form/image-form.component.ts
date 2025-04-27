import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Controller, Image } from 'src/interfaces/Controller';

@Component({
  selector: 'app-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.css']
})
export class ImageFormComponent {

  @Input() item!: Image | Controller;
  // This will be sent to the parent
  @Output() submit = new EventEmitter();

  onSubmit(event: any, item: Image) {
    this.submit.emit({
      action: 'submit',
      event: event,
      item: item
    });
  }
}
