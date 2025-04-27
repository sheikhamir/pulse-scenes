import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { Fader } from "src/interfaces/Controller";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.css']
})
export class SliderComponent implements AfterViewInit, OnChanges   {

  @Input() item!: Fader;
  @Output() input = new EventEmitter();

  // Input properties
  min: number = 0;
  max: number = 100;
  value: number = 50;
  orientation: 'horizontal' | 'vertical' = 'horizontal'; // Default horizontal

  // Seeker
  seekerPosition: number = 0;

  slider: Slider = {
    min: 0,
    max: 100,
    value: 50,
    percentage: 50,
    height: 0,
    width: 0,
    track: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    },
    seeker: {
      top: 0,
      left: 0,
      width: 0,
      height: 0
    },
    xAxis: {
      min: 0,
      max: 0
    },
    yAxis: {
      min: 0,
      max: 0
    }
  }

  // The slider track
  @ViewChild('track') trackElementRef!: ElementRef;
  // The seeker
  @ViewChild('seeker') seekerElementRef!: ElementRef;

  private dragging = false;
  // Drag position coordinates
  dragPosition = {x: 0, y: 0};

  constructor(
    private dataService: DataService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    const track = this.trackElementRef.nativeElement.getBoundingClientRect();
    const seeker = this.seekerElementRef.nativeElement.getBoundingClientRect();
    // Only apply to vertical element
    if (this.item.vertical) this.renderer.setStyle(this.seekerElementRef.nativeElement, 'bottom', `${this.seekerPosition}px`);

    // For calculation
    const xMax = track.height - seeker.height; // Vertical
    const yMax = track.width - seeker.width; // Horizontal

    // Update internal variables (internally for this component)
    this.slider = {
      min: <number>this.item.min,
      max: <number>this.item.max,
      value: this.item.current_value,
      percentage: this.item.current_value / this.item.max,
      width: track.width,
      height: track.height,
      track: {
        top: track.top,
        left: track.left,
        width: track.width,
        height: track.height
      },
      seeker: {
        top: seeker.top,
        left: seeker.left,
        width: seeker.width,
        height: seeker.height
      },
      xAxis: {
        min: track.bottom - seeker.height,
        max: xMax
      },
      yAxis: {
        min: track.left,
        max: yMax
      }
    }

    this.seekerPosition = this.item.vertical
      ? (this.item.current_value / this.item.max * 100) * this.slider.xAxis.max / 100
      : (this.item.current_value / this.item.max * 100) * this.slider.yAxis.max / 100;

    this.renderer.setStyle(this.seekerElementRef.nativeElement, this.item.vertical ? 'bottom' : 'left', `0`);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("All changes:", changes);
    // // Check if the input variable has changed
    // if (changes['item'] && !changes['item'].firstChange) {
    //   // Perform the action when the input variable changes
    //   console.log('Input value changed:', this.item);
    //   // You can perform any action here based on the new value
    // }
  }

  ngOnInit() {
    this.dataService.internalCommunicationData$.subscribe((broadcast: any) => {
      // Filters out data only to be used here
      if (broadcast.target === 'slider') {
        // This will update pageId
        if (broadcast.action === 'resize') {
          if (this.item.id !== broadcast.data.item.id) return;
          this.orientation = broadcast.data.height <= broadcast.data.width ? 'horizontal' : 'vertical';
          this.item.vertical = this.orientation === 'vertical';
          this.dragPosition = {x: 0, y: 0};
        }
      }
    });
    this.seekerPosition = 0;
    /*this.seekerPosition = this.item.vertical
      ? (this.item.current_value / this.item.max * 100) * this.slider.xAxis.max / 100
      : (this.item.current_value / this.item.max * 100) * this.slider.yAxis.max / 100;*/
  }

  getStyle() {
    let style = '';
    // Adds the additional css
    style += this.item.css; // Commented - to be reviewed
    return style;
  }

  onSlideMove(event: any, item: Fader) {
    const track = this.trackElementRef.nativeElement.getBoundingClientRect();
    const seeker = this.seekerElementRef.nativeElement.getBoundingClientRect();
    const positionValue = this.item.vertical ? seeker.top - track.top : track.left - seeker.left;
    // Calculate percentage for internal object
    let percentage = this.item.vertical
      ? this.makePercent(positionValue, this.slider.xAxis.max)
      : this.makePercent(positionValue, this.slider.yAxis.max);
    // If somehow percentage goes less than zero
    if (percentage < 0) percentage = 0;
    // Calculate value
    this.item.current_value = this.item.max * percentage / 100;
  }

  sliderOverlayStyle() {
    let position = this.item.vertical
      ? (this.slider.value / this.item.max * 100) * this.slider.xAxis.max / 100
      : (this.slider.value / this.item.max * 100) * this.slider.yAxis.max / 100;

    let realPosition = this.item.vertical ? this.slider.xAxis.max - position : this.slider.yAxis.max - position;
    if (this.slider.seeker.width > 0) {
      // Deduct the seeker dimension for better visual
      realPosition += this.slider.seeker.width / 2 - this.slider.seeker.width / 20;
    }
    //console.log(this.slider.value);
    //console.log(realPosition);
    return this.item.vertical ? `top:${realPosition}px` : `left:${realPosition}px`;
  }

  onSlideEnd(event: any, item: Fader) {
    this.dragPosition = {x: 0, y: 0};
    console.log(this.dragPosition);
  }

  movement() {
    // const trackPosition = this.trackElementRef.nativeElement.getBoundingClientRect();
    // console.log(trackPosition);
  }

  seekerMouseDown() {}

  mouseDown(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      console.log(event);
    }
    // const elementPosition = this.trackElementRef.nativeElement.getBoundingClientRect();
    // console.log(elementPosition);
  }

  makePercent(up: number, down: number) {
    return this.item.vertical
      ? 100 /* To reverse percentage */ - Math.min(Math.abs( up / down * 100 ), 100)
      : Math.min(Math.abs( up / down * 100 ), 100)
  }

  /*getPosition() {
    let pos = this.item.vertical
      ? (this.item.current_value / this.item.max * 100) * this.slider.xAxis.max / 100
      : (this.item.current_value / this.item.max * 100) * this.slider.yAxis.max / 100;
    // if (this.item.vertical) {
    //   this.dragPosition.x =
    // }
    console.log(pos);
  }*/

}


interface Slider {
  min: number;
  max: number;
  value: number;
  percentage: number;
  height: number;
  width: number;
  track: Position;
  seeker: Position;
  xAxis: MinMax;
  yAxis: MinMax;
}

interface Position {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface MinMax {
  min: number;
  max: number;
}
