import { Component, Input } from '@angular/core';
import { Label } from "src/interfaces/Controller";

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  styleUrls: ['./label.component.css']
})
export class LabelComponent {

  @Input() item!: Label;

  getClasses(item: Label) {
    return {
      'flexDirection': item.flexDirection ? `flex-direction-${item.flexDirection}` : false,
      'flexWrap': item.flexWrap ? `flex-wrap-${item.flexWrap}` : false,
      'alignContent': item.alignContent ? `align-content-${item.alignContent}` : false,
      'justifyContent': item.justifyContent ? `justify-content-${item.justifyContent}` : false,
      'alignItems': item.alignItems ? `align-items-${item.alignItems}` : false,
    };
  }

  getStyle() {
    let style = '';
    // Position
    if (this.item.flexDirection) style += `flex-direction: ${this.item.flexDirection};`;
    if (this.item.flexWrap) style += `flex-wrap: ${this.item.flexWrap};`;
    if (this.item.alignContent) style += `align-content: ${this.item.alignContent};`;
    if (this.item.justifyContent) style += `justify-content: ${this.item.justifyContent};`;
    if (this.item.alignItems) style += `align-items: ${this.item.alignItems};`;

    if (this.item.textAlign) style += `text-align: ${this.item.textAlign};`;
    // Adds the additional css
    style += this.item.css; // Commented - to be reviewed
    return style;
  }

}
