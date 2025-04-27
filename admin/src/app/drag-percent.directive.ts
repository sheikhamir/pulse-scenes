import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDragPercent]'
})
export class DragPercentDirective {

  @Input() appDragPercent?: { top: number; left: number }; // Initial percentage values

  private initialX!: number;
  private initialY!: number;
  private dragging: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener('mousedown')
  onMouseDown(event: MouseEvent) {
    this.dragging = true;
    this.initialX = event.clientX;
    this.initialY = event.clientY;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.dragging) {
      return;
    }

    const deltaX = event.clientX - this.initialX;
    const deltaY = event.clientY - this.initialY;

    // Calculate percentages relative to screen size
    const newTop = (deltaY / window.innerHeight) * 100;
    const newLeft = (deltaX / window.innerWidth) * 100;

    // Update element position with percentage values
    this.el.nativeElement.style.top = `${newTop}%`;
    this.el.nativeElement.style.left = `${newLeft}%`;

    // Update appDragPercent input with new values
    this.appDragPercent = { top: newTop, left: newLeft };
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.dragging = false;
  }

}
