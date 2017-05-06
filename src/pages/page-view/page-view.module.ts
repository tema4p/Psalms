import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PageView } from './page-view';

@NgModule({
  declarations: [
    PageView,
  ],
  imports: [
    IonicPageModule.forChild(PageView),
  ],
  exports: [
    PageView
  ]
})
export class PageViewModule {}
