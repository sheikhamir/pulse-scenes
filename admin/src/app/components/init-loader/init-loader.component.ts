import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-init-loader',
  templateUrl: './init-loader.component.html',
  styleUrls: ['./init-loader.component.css']
})
export class InitLoaderComponent implements OnInit {
  loading: Boolean = true;
  loaded: Boolean = false;

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
      setTimeout(() => {
        this.loaded = true;
      }, 300)
    }, 3000)
  }

}
