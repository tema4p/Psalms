import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
declare var _: any;
import {ToastController} from 'ionic-angular';
import {SettingsService} from '../services/settingsService';

@Component({
  template: `
    <ion-list>
      <ion-list-header>{{title}}</ion-list-header>
      <button ion-item (click)="setPsalmFavorite()" *ngIf="!isMarked()">Добавить в избранное</button>
      <button ion-item (click)="setPsalmFavorite()" *ngIf="isMarked()">Удалить из избарнного</button>
      <button ion-item (click)="setPsalmFavorite()">Посмотреть современный перевод</button>
    </ion-list>
  `
})
export class PsalmPopover {
  public title: string = '';
  public psalmId: string = '';
  public settings: any;
  public toastCtrl: ToastController;
  public settingsService: SettingsService;

  constructor(public viewCtrl: ViewController) {
    console.log('this.viewCtrl.data', this.viewCtrl.data);
    this.settingsService = this.viewCtrl.data.settingsService;
    this.toastCtrl = this.viewCtrl.data.toastCtrl;
    this.settings = this.settingsService.getSettings();

    let target = this.viewCtrl.data.event.currentTarget;
    if (target.id) {
      this.psalmId = target.id.match(/\d+/g)[0];
    } else {
      this.psalmId = target.innerHTML.match(/\d+/g)[0];
    }
    if (parseInt(this.psalmId) < 10) this.psalmId = '0' + this.psalmId;
    this.title = target.innerHTML;
    console.log('this.psalmId', this.psalmId);
  }

  close() {
    console.log('viewCtrl', this.viewCtrl);
    this.viewCtrl.dismiss();
  }

  isMarked(): boolean {
    return this.settings.psalms.indexOf(this.psalmId) !== -1;
  }

  setPsalmFavorite() {
    if (!this.isMarked()) {
      this.settings.psalms.push(this.psalmId);
      this.settings.psalms = _.sortBy(this.settings.psalms);
      this.settingsService.saveSettings(this.settings);
      let toast = this.toastCtrl.create({
        message: `Псалом ${+this.psalmId} добавлен в избарнное`,
        duration: 3000
      });
      toast.present();
    } else {
      this.settings.psalms = _.without(this.settings.psalms, this.psalmId);
      this.settingsService.saveSettings(this.settings);
      let toast = this.toastCtrl.create({
        message: `Псалом ${+this.psalmId} удален из избарнного`,
        duration: 3000
      });
      toast.present();
    }
    this.viewCtrl.dismiss();
  }
}
