import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PsalmRus } from '../../content/pslam-rus'
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
    this.content = PsalmRus.getKafizma(this.navParams.data.id);
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
