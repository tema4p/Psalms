import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  public fontsRange: number[] = [];
  public fonts: string[] = ['Times','Arial','Verdana','Times New Roman','Helvetica'];

  public settings: any = {
    fontSize: '16',
    fontFamily: 'times',
    textSource: 'hh',
    perenos: false,
    hyphens: true,
    justify: true,
    repose: false,
    adds: true
  };

  constructor(public navCtrl: NavController) {
    for (let i = 15; i <= 50; i++ ) this.fontsRange.push(i);
  }

}
