import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
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
  public enableInfo: boolean = true;
  public hideInfoTimeOut: any;

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

  private rotationHandler: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private settingsService: SettingsService,
              private toastCtrl: ToastController,
              private viewElement: ElementRef,
              private chRef: ChangeDetectorRef) {
    this.settings = this.settingsService.getSettings();

  }

  ngOnInit() {
    this.rotationHandler = (() => {
      console.log('view orientationchange');
      const progress: number  = this.page / this.pagesTotal;
      console.log('this.page', this.page);
      console.log('this.pagesTotal', this.pagesTotal);
      console.log('progress', progress);
      this.displayOrientation = (<any> window).screen.orientation.type;
      setTimeout(() => {
        this.calculatePagesTotal();
        this.goPage(Math.round(this.pagesTotal * progress));
        this.chRef.detectChanges();
      }, 300);
    });

    window.addEventListener("orientationchange", this.rotationHandler, false);
    console.log('ngOnInit');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    window.removeEventListener("orientationchange", this.rotationHandler);
    if (this.hideInfoTimeOut) {
      clearTimeout(this.hideInfoTimeOut);
    }
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
    this.showInfo();
  }

  public showInfo(): void {
    this.enableInfo = true;
    if (this.hideInfoTimeOut) {
      clearTimeout(this.hideInfoTimeOut);
    }
    this.hideInfoTimeOut = setTimeout(() => {
      this.enableInfo = false;
      this.chRef.detectChanges();
    }, 3000);
  }

  public calculatePagesTotal(): void {
    const container: any = $(this.viewElement.nativeElement).find('#contentContainer');
    // const correction = this.displayOrientation === 'landscape-primary' ? -8 : 18;
    console.log('this.displayOrientation', this.displayOrientation);
    console.log('this.container[0].scrollWidth', container[0].scrollWidth);
    console.log('window.screen.availWidth', window.screen.availWidth);
    this.pagesTotal = Math.round(container[0].scrollWidth / (window.screen.availWidth + 18) );
    console.log('calculatePagesTotal', this.pagesTotal);
  }
}
