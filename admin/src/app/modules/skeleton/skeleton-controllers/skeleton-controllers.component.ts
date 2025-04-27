import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-controllers',
  templateUrl: './skeleton-controllers.component.html',
  styleUrls: ['./skeleton-controllers.component.css']
})
export class SkeletonControllersComponent implements OnInit {

  @Input() items!: number;
  @Input() containerClass!: string;

  constructor() { }

  ngOnInit(): void {
  }

  createRange(n: number){
    return new Array(n).fill(0)
      .map((n, index) => index + 1);
  }

}
