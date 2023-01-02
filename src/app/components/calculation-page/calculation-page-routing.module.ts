import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CalculationPageComponent } from './calculation-page.component';

const routes: Routes = [
  {
    path: '',
    component: CalculationPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculationPageRoutingModule { }
