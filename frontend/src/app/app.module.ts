import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { MatSliderModule } from '@angular/material/slider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { NoControllerComponent } from './components/no-controller/no-controller.component';
import { InitLoaderComponent } from './components/init-loader/init-loader.component';
import { RenderComponent } from "./pages/render/render.component";
import { PageItemComponent } from './components/page-item/page-item.component';
import { ImageComponent } from './components/image/image.component';
import { ButtonComponent } from "./components/button/button.component";
import { MeterComponent } from "./components/meter/meter.component";
import { SliderComponent } from './components/slider/slider.component';
import { LabelComponent } from './components/label/label.component';
import { PageCssComponent } from './components/page-css/page-css.component';

@NgModule({
  declarations: [
    AppComponent,
    NoControllerComponent,
    InitLoaderComponent,
    RenderComponent,
    PageItemComponent,
    ImageComponent,
    ButtonComponent,
    MeterComponent,
    SliderComponent,
    LabelComponent,
    PageCssComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSliderModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
