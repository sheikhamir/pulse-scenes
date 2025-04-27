import { Component, Input } from '@angular/core';
import { Controller, Image } from "src/interfaces/Controller";

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent {

  @Input() item!: Controller | Image;

  getClasses() {
    return {
      ...(this.item.objectFit && { [this.item.objectFit]: true })
    };
  }

}
