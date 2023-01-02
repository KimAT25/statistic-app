import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';

import { LayoutModule } from './layout/layout.module';
import { CalculationPageModule } from './components/calculation-page/calculation-page.module';

const LibrariesModule = [
  MatButtonModule
]

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ...LibrariesModule,
    LayoutModule,
    CalculationPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
