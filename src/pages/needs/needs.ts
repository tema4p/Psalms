import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {SettingsService} from "../../app/services/settingsService";
import {PageView} from "../page-view/page-view";

declare var _:any;
declare var moment:any;

@IonicPage()
@Component({
  selector: 'page-needs',
  templateUrl: 'needs.html'
})
export class NeedsPage {
  settings: any;

  constructor(public navCtrl: NavController,
              public settingsService: SettingsService) {
    this.settings = this.settingsService.getSettings();
  }

  loadPsalms(): void {

  }

  openPage(page: any): void {
    this.navCtrl.push(PageView, {
      item: {
        'psalm': page,
        'ru': 'Псалом ' + (+page),
        'cs': 'Псалом ' + (+page)
      },
      isFavorite: false,
      component: PageView,
      note: ''
    });
  }
}
