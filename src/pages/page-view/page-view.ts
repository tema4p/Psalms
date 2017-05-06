import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { ToastController } from 'ionic-angular';


/**
 * Generated class for the PageView page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-page-view',
  templateUrl: 'page-view.html',
})

export class PageView {
  public content: string = '';
  public title: string = '';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PageView');
    console.log('navParams', this.navParams);
    if (this.navParams.data.kafisma) {
      this.content = (<any> window).psalmRus[this.navParams.data.kafisma];
    } else if (this.navParams.data.add) {
      this.content = (<any> window).addsRus[this.navParams.data.add];
    }

    this.title = this.navParams.data.rus;
  }

  goSettings(): void {
    this.navCtrl.push(SettingsPage);
  }

  bookMark(): void {
    let toast = this.toastCtrl.create({
      message: 'Кафизма добавленна в закладки',
      duration: 3000
    });
    toast.present();
  }
}
