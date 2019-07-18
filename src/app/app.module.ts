import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { DataService } from './services/data.service';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { DisplaySceneComponent } from './display-scene/display-scene.component';

@NgModule({
  declarations: [
    AppComponent,
    QrScannerComponent,
    HomeComponent,
    DisplaySceneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
