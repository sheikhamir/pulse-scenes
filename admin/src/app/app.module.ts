import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { MatSliderModule } from '@angular/material/slider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { SkeletonControllersComponent } from './modules/skeleton/skeleton-controllers/skeleton-controllers.component';
import { ButtonComponent } from './components/button/button.component';
import { MeterComponent } from './components/meter/meter.component';
import { NoControllerComponent } from './components/no-controller/no-controller.component';
import { InitLoaderComponent } from './components/init-loader/init-loader.component';
import { HomeComponent } from './pages/home/home.component';
import { ManagePageComponent } from './pages/manage-page/manage-page.component';
import { PcsControlsComponent } from './components/admin/pcs-controls/pcs-controls.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DragPercentDirective } from './drag-percent.directive';
import { ResizableModule } from 'angular-resizable-element';
import { PageItemComponent } from './components/page-item/page-item.component';
import { ImageComponent } from './components/image/image.component';
import { SliderComponent } from './components/slider/slider.component';
import { LabelComponent } from './components/label/label.component';
import { ImageFormComponent } from './components/admin/forms/image-form/image-form.component';
import { PageFormComponent } from './components/admin/forms/page-form/page-form.component';
import { LabelFormComponent } from './components/admin/forms/label-form/label-form.component';
import { IconFormComponent } from './components/admin/forms/icon-form/icon-form.component';
import { FaderFormComponent } from './components/admin/forms/fader-form/fader-form.component';
import { MeterFormComponent } from './components/admin/forms/meter-form/meter-form.component';
import { ButtonFormComponent } from './components/admin/forms/button-form/button-form.component';
import { TextFormComponent } from './components/admin/forms/text-form/text-form.component';
import { PageCssComponent } from './components/page-css/page-css.component';
import { FileDropDirective } from './directives/file-drop.directive';

@NgModule({
  declarations: [
    AppComponent,
    SkeletonControllersComponent,
    ButtonComponent,
    MeterComponent,
    NoControllerComponent,
    InitLoaderComponent,
    HomeComponent,
    ManagePageComponent,
    PcsControlsComponent,
    DragPercentDirective,
    PageItemComponent,
    ImageComponent,
    LabelComponent,
    SliderComponent,
    ImageFormComponent,
    PageFormComponent,
    LabelFormComponent,
    IconFormComponent,
    FaderFormComponent,
    MeterFormComponent,
    ButtonFormComponent,
    TextFormComponent,
    PageCssComponent,
    FileDropDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSliderModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    ResizableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
