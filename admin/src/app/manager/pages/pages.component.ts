import { Component, OnInit, Sanitizer, HostListener } from '@angular/core';
import { Controller } from "src/interfaces/Controller";
import { Page } from "src/interfaces/Page";
import { ActivatedRoute } from "@angular/router";
import { PageService } from "src/app/services/manager/page.service";
import { environment as env } from "src/environments/environment";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  loading: boolean = true;
  pages!: Page[];
  synced = false;
  apiOptions = {};
  showAddPageForm = false;

  // When page is selected
  selectedPage: any = false;
  loadedSelectedPage: Page | boolean = false;

  rightClickedPage: any = false;

  // This will close the form if the escape key is pressed
  @HostListener('window:keydown.escape', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.showAddPageForm) {
      this.onFormClose();
    } else if (this.selectedPage) {
      this.unselectPage();
    }
  }
  @HostListener('window:click', ['$event'])
  handleMouseDown(event: MouseEvent) {
    // console.log("Mouse down:", event);
  }

  constructor(
    private activeRoute: ActivatedRoute,
    private api: PageService,
    private sanitizer: DomSanitizer
  ) {
    // this.floorSlug = this.activeRoute.snapshot.params['floor'];
    // let slugAsKey = this.floorSlug as keyof typeof env.floorAssignments;
    // this.floorId = env.floorAssignments[slugAsKey];
  }

  ngOnInit(): void {
    // Loads all the controllers
    this.api.get(this.apiOptions).subscribe(
      (pages: Page[]) => {
        this.pages = pages;
        console.log(pages);
        this.loading = false;
      }
    )
  }

  renderHtml(val: string) {
    return this.sanitizer.bypassSecurityTrustHtml(val);
  }

  stripTags(val: string) {
    return val.replace(/<\/?[^>]+(>|$)/g, ' ');
  }

  newPageAdded(event: any) {
    console.log("NewPageEvent:", event.data);
  }

  onFormClose() {
    this.showAddPageForm = false;
  }

  onFormSubmit(event: any) {
    this.pages.push(event.data);
  }

  selectPage(page: any) {
    if (page === this.selectedPage) {
      this.unselectPage();
    } else {
      this.selectedPage = page;
      // this.api.get({id: this.selectedPage.id}).subscribe(pages: )
      console.log(page);
    }
  }

  unselectPage() {
    this.selectedPage = false;
  }

  openContextMenu(event: any, page: Page) {
    // event.preventDefault();
    // this.rightClickedPage = page;
    // console.log(page);
  }

}
