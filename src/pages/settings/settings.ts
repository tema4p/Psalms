import { Component } from '@angular/core';

import { IonicPage, NavController } from 'ionic-angular';
import { SettingsService } from '../../app/services/settingsService';
// import _ from 'lodash';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {
  public settings: any;

  public fontsRange: number[] = [];
  public fonts: string[] = ['Times','Arial','Verdana','Times New Roman','Helvetica'];

  constructor(public navCtrl: NavController,
              public settingsService: SettingsService,) {
    for (let i = 15; i <= 50; i++ ) this.fontsRange.push(i);

    this.settings = settingsService.getSettings();
  }

  ionViewWillLeave() {
    console.log('SettingsPage Will Leave');
    this.settingsService.saveSettings(this.settings);
  }
}
