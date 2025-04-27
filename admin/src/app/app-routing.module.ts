import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
// import { AudioControlComponent } from "./pages/audio-control/audio-control.component";
// import { ProjectorAndLaserComponent } from "./pages/projector-and-laser/projector-and-laser.component";
// import { BowlingLightsComponent } from "./pages/bowling-lights/bowling-lights.component";
// import { RestaurantLightsComponent } from "./pages/restaurant-lights/restaurant-lights.component";
// import { OutdoorLightsComponent } from "./pages/outdoor-lights/outdoor-lights.component";
import { ManagePageComponent } from "./pages/manage-page/manage-page.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: "home",
    title: "Home",
    component: ManagePageComponent
  },
  {
    path: "page/:id",
    title: "Manage Page",
    component: ManagePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
