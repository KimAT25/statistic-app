import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalculationPageRoutingModule } from './calculation-page-routing.module';

import { CalculationPageComponent } from './calculation-page.component';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';

const angularMaterialModules = [
  MatSelectModule,
  MatButtonModule,
  MatExpansionModule,
  MatTableModule
]

@NgModule({
  declarations: [
    CalculationPageComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    CalculationPageRoutingModule,
    ...angularMaterialModules
  ]
})
export class CalculationPageModule { }
