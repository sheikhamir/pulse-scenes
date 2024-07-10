import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RenderComponent } from "./pages/render/render.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: "home",
    title: "Home",
    component: RenderComponent
  },
  {
    path: "page/:id",
    title: "Page",
    component: RenderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
