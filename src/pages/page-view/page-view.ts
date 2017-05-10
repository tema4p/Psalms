import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { ToastController } from 'ionic-angular';
import { SettingsService } from '../../app/services/settingsService';
declare var $: any;
declare var _:any;
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
  public page: number = 0;
  public pagesTotal: number = 0;
  public displayOrientation: string = (<any> window).screen.orientation.type;

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

    window.addEventListener("orientationchange", () => { this.onRotateChange()  }, false);
  }

  onRotateChange() {
    console.log('view orientationchange');
    const progress = this.page/this.pagesTotal;
    this.calculatePagesTotal();
    this.page = Math.round(this.pagesTotal * progress);
    this.displayOrientation = (<any> window).screen.orientation.type;
  }

  loadContent() {
    if (this.navParams.data.kafisma) {
      this.content = this.data.psalm[this.settings.textSource][this.navParams.data.kafisma].data;
    } else if (this.navParams.data.add) {
      this.content = this.data.adds[this.settings.textSource][this.navParams.data.add].data;
    }

    if (this.settings.textSource === 'hh') {
      this.title = this.navParams.data.rus;
    } else {
      this.title = this.navParams.data.cs;
    }

    this.checkExtends();
  }

  checkExtends() {
    if (this.settings.textSource !== 'hh') {
      return;
    }
    let el = $('<div></div>').html(this.content);
    if (this.settings.adds) {
      el.find('.trisv').html(this.data.adds['hh']['trisv'].data);
      el.find('.slava').html(this.data.adds['hh']['slava'].data).removeClass('red').removeClass('center');
      el.find('.slavaPre').html(this.data.adds['hh']['slavaPre'].data).removeClass('red').removeClass('center');
    }
    if (this.settings.repose) {
      el.find('.slava').html(this.data.adds['hh']['repose'].data).removeClass('red').removeClass('center');
      el.find('.trop-normal').html(this.data.adds['hh']['reposeM'].data);
    }
    this.content = el.html();
    setTimeout(() => {
      this.calculatePagesTotal();
    })
  }

  ionViewWillEnter() {
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
    if (!this.isMarked()) {
      this.settings.bookmarks.push(this.navParams.data.kafisma);
      this.settings.bookmarks = _.sortBy(this.settings.bookmarks);
      this.settingsService.saveSettings(this.settings);
      let toast = this.toastCtrl.create({
        message: `Кафизма ${+this.navParams.data.kafisma} добавленна в закладки`,
        duration: 3000
      });
      toast.present();
    } else {
      this.settings.bookmarks = _.without(this.settings.bookmarks, this.navParams.data.kafisma);
      this.settingsService.saveSettings(this.settings);
      let toast = this.toastCtrl.create({
        message: `Кафизма ${+this.navParams.data.kafisma} убрана из закладок.`,
        duration: 3000
      });
      toast.present();
    }
  }

  isMarked(): boolean {
    return this.settings.bookmarks.indexOf(this.navParams.data.kafisma) !== -1;
  }

  public getTranslateX(): string {
    const vh: number = 100 * this.page;
    const correct = 20 * this.page;
    return `calc(-${vh}vw - ${correct}px)`;
  }

  public goPage(n): void {
    if (n > -1 && n <= this.pagesTotal -1) {
      this.page = n;
    }
    console.log('goPage', n, ' / ', this.pagesTotal);
  }

  public calculatePagesTotal(): void {
    const container: any = $(this.viewElement.nativeElement).find('#contentContainer');
    const correction = this.displayOrientation === 'landscape-primary' ? -8 : 18;
    this.pagesTotal = Math.round(container[0].scrollWidth / (window.screen.availWidth + correction) );
    console.log('calculatePagesTotal', this.pagesTotal);
  }
}
