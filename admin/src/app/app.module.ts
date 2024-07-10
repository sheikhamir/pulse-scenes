import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { HeaderComponent } from "./components/header/header.component";
import { PagesComponent } from './manager/pages/pages.component';
import { InitLoaderComponent } from "./components/init-loader/init-loader.component";
import { NoControllerComponent } from "./components/no-controller/no-controller.component";
import { FaderComponent } from "./components/fader/fader.component";
import { ButtonComponent } from "./components/button/button.component";
import { MeterComponent } from "./components/meter/meter.component";
import { ConfigComponent } from './manager/config/config.component';
import { PageNotFoundComponent } from './manager/page-not-found/page-not-found.component';
import { AddPageFormComponent } from './manager/component/add-page-form/add-page-form.component';

@NgModule({
    declarations: [
        AppComponent,
        PagesComponent,
        FaderComponent,
        ButtonComponent,
        MeterComponent,
        InitLoaderComponent,
        NoControllerComponent,
        HeaderComponent,
        ConfigComponent,
        PageNotFoundComponent,
        AddPageFormComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
