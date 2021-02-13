import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialModalPageRoutingModule } from './special-modal-routing.module';

import { SpecialModalPage } from './special-modal.page';
import { Storage } from '@ionic/storage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialModalPageRoutingModule
  ],
  declarations: [SpecialModalPage]
})
export class SpecialModalPageModule {}
