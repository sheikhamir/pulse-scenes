import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  active_url: string = '';
  @Input() title: string = '';

  constructor(
    private url: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.active_url = this.url.snapshot.url[0].path;
  }

}
