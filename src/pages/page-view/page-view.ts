import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { ToastController } from 'ionic-angular';
import { SettingsService } from '../../app/services/settingsService';
declare var $: any;

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
  public settings: any = {};
  public data: any = {
    psalm: {
      cs: (<any> window).psalmCs,
      hh: (<any> window).psalmRus,
    },
    adds: {
      cs: (<any> window).addsCs,
      hh: (<any> window).addsRus,
    }
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private settingsService: SettingsService,
              public toastCtrl: ToastController,
              private viewElement: ElementRef) {
    this.settings = this.settingsService.getSettings();
  }

  loadContent() {
    console.log('loadContent');
    if (this.navParams.data.kafisma) {
      this.content = this.data.psalm[this.settings.textSource][this.navParams.data.kafisma];
    } else if (this.navParams.data.add) {
      this.content = this.data.adds[this.settings.textSource][this.navParams.data.add];
    }

    if (this.settings.textSource === 'hh') {
      this.title = this.navParams.data.rus;
    } else {
      this.title = this.navParams.data.cs;
    }

    setTimeout(() => { this.checkExtends(); }, 1);
  }

  checkExtends() {
    console.log('this.settings.textSource', this.settings.textSource);
    console.log('this.settings', this.settings);
    if (this.settings.textSource !== 'hh') {
      return;
    }
    let el = $(this.viewElement.nativeElement);
    (<any> window).el = el;
    if (this.settings.adds) {
      el.find('.trisv').html(this.data.adds['hh']['trisv'].data);
      el.find('.slava').html(this.data.adds['hh']['slava'].data).removeClass('red').removeClass('center');
      el.find('.slavaPre').html(this.data.adds['hh']['slavaPre'].data).removeClass('red').removeClass('center');
    }
    if (this.settings.repose) {
      console.log('this.settings.repose', this.settings.repose);
      el.find('.slava').html(this.data.adds['hh']['repose'].data).removeClass('red').removeClass('center');
      el.find('.trop-normal').html(this.data.adds['hh']['reposeM'].data);

      console.log('this.data', this.data);
      console.log(el.find('.slava'), this.data.adds['hh']['repose'].data);
      console.log(el.find('.trop-normal'), this.data.adds['hh']['reposeM'].data);
    }
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    let newSettings = this.settingsService.getSettings();
    if (this.content === '' ||
        this.settings.textSource !== newSettings.textSource ||
        this.settings.adds !== newSettings.adds ||
        this.settings.repose !== newSettings.repose) {
      this.settings = newSettings;
      this.loadContent();
    } else {
      this.settings = newSettings;
    }
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
