import { Component, Input, Renderer2 } from '@angular/core';
import { CSS } from "src/interfaces/Controller";

@Component({
  selector: 'app-page-css',
  templateUrl: './page-css.component.html',
  styleUrls: ['./page-css.component.css']
})
export class PageCssComponent {
  @Input() pageCSS!: CSS | '';

  constructor(
    private renderer: Renderer2
  ) {

  }

  ngOnInit() {
    if (this.pageCSS && this.pageCSS.css) {
      // Create <style> element
      const styleElement = this.renderer.createElement('style');
      this.renderer.appendChild(styleElement, this.renderer.createText(this.pageCSS.css));

      // Append <style> element to the <head> of the document
      this.renderer.appendChild(document.head, styleElement);
    }
  }
}
