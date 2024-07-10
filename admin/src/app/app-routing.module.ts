import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from "./manager/pages/pages.component";
import { ConfigComponent } from "./manager/config/config.component";
import { PageNotFoundComponent } from "./manager/page-not-found/page-not-found.component";

const routes: Routes = [
  { path: "pages",title: "Manage Pages", component: PagesComponent },
  { path: "config",title: "Configuration", component: ConfigComponent },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
