import { Component } from '@angular/core';

import {IonicPage, NavController, NavParams} from 'ionic-angular';
// import _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-sinod',
  templateUrl: 'sinod.html'
})

export class SinodPage {
  public content: string = '';
  public title: string = '';
  public settings: any = {};

  public psalmSn: string[] = (<any> window).psalmSn;

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.settings = navParams.data.settings;
    this.content = this.psalmSn[navParams.data.psalm];
    console.log('navParams', navParams);
  }
}
