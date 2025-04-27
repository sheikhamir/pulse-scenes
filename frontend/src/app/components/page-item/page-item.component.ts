import { Component, Input } from '@angular/core';
import { Page } from "src/interfaces/Controller";
import { Router } from "@angular/router";
import { DataService } from "src/app/services/data.service";

@Component({
  selector: 'app-page-item',
  templateUrl: './page-item.component.html',
  styleUrls: ['./page-item.component.css']
})
export class PageItemComponent {
  @Input() item!: Page;

  constructor(
    private router: Router,
    private dataService: DataService
  ) {}

  navigate(event: MouseEvent) {
    event.preventDefault(); // Prevent default anchor click behavior
    const pageId = this.item.targetPage === 'self' ? this.item.id : this.item.targetPage;
    const command = this.item.targetPage === 'self'
      ? ['page', pageId] // Value is 'self'
      : (
        this.item.targetPage === '/home' // Value is home
          ? ['/home'] // Main (root) page
          : ['page', pageId] // The provided page id
      );
    const data = {
      controller: this.item,
      navigateTo: command,
      actionFrom: 'page',
      pageId: this.item.targetPage === '/home' ? 0 : pageId
    }
    this.dataService.emitInternalData('all', 'navigate', data);
    this.router.navigate(command).then(r => function(){
      console.log("Navigated");
    }); // Navigate to the desired route
  }
}
