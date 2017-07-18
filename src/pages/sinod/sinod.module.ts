import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SinodPage } from './sinod';

@NgModule({
  declarations: [
    SinodPage,
  ],
  imports: [
    IonicPageModule.forChild(SinodPage),
  ],
  exports: [
    SinodPage
  ]
})
export class SinodPageModule {}
