import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialModalPage } from './special-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialModalPageRoutingModule {}
