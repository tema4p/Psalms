import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { ToastController } from 'ionic-angular';
import { SettingsService } from '../../app/services/settingsService';
import { PopoverController } from 'ionic-angular';
import { PsalmPopover } from '../../app/components/psalmPopOver';
import { Contents } from '../../content/contents';
import addsCs from "../../app/data/adds-cs";
import addsRu from "../../app/data/adds-ru";
import chinRu from "../../app/data/chin-ru";
import chinCs from "../../app/data/chin-cs";
import psalmRuJson from "../../app/data/psalm-ru-json";
import songsCs from "../../app/data/songs-cs";
import songsRu from "../../app/data/songs-ru";
import kafismaRuJson from "../../app/data/kafisma-ru-json";

declare let $: any;
declare let _:any;
declare let moment:any;
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
  public titleForceRu: boolean = false;
  public settings: any = {};
  public page: number = 0;
  public pagesTotal: number = 0;
  public isLandscape: boolean = (<any> window).screen.orientation.type.indexOf('landscape') > -1;
  public enableInfo: boolean = true;
  public hideInfoTimeOut: any;
  public container: any;
  public psalmsTreeRu: any;
  public psalmsTreeCs: any;
  public kafisma: string;
  public kafismaJson: any;

  public prevPsalm: string;
  public nextPsalm: string;

  public psalmJson: any;

  public forceTitleRu: boolean = false;

  public data: any = {
    adds: {
      cs: (new addsCs()).data,
      ru: (new addsRu()).data,
    },
    chin: {
      cs: (new chinCs()).data,
      ru: (new chinRu()).data,
    },
    songs: {
      cs: (new songsCs()).data,
      ru: (new songsRu()).data,
    }
  };

  public dataJson: any = {
    psalm: {
      ru: (new psalmRuJson()).data
    }
  };

  private rotationHandler: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private settingsService: SettingsService,
              private toastCtrl: ToastController,
              private viewElement: ElementRef,
              private chRef: ChangeDetectorRef,
              public popoverCtrl: PopoverController) {
    (<any>screen).orientation.unlock();
    this.settings = this.settingsService.getSettings();
    this.registerNativeButtons();
  }



  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.initContent();
    this.kafisma = this.navParams.data.item.kafisma;
    this.kafismaJson = (new kafismaRuJson()).data[this.kafisma];
    console.log('this.navParams.data', this.navParams.data);
    if (this.navParams.data.page) {
      this.page = this.navParams.data.page;
    }
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.calculatePagesTotal();
      this.chRef.detectChanges();
    }, 400);
  }

  registerNativeButtons() {
    let $el = $(this.viewElement.nativeElement).find('.scroll-content:first');

    document.addEventListener("volumeupbutton", () => {
      console.log('volumeupbutton');
      if (this.settings.bookMode) {
        this.goPage(this.page - 1);
      } else {
        let step: number = $el.height() - 40;
        let scroll: number = $el[0].scrollTop;
        $el.animate({ scrollTop: scroll - step }, 300);
      }
    }, false);
    document.addEventListener("volumedownbutton", () => {
      console.log('volumedownbutton');
      if (this.settings.bookMode) {
        this.goPage(this.page + 1);
      } else {
        let step: number = $el.height() - 40;
        let scroll: number = $el[0].scrollTop;
        $el.animate({ scrollTop: scroll + step }, 300);
      }
    }, false);
  }

  initContent() {
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

    if (!this.settings.bookMode) {
      this.page = 0;
      this.chRef.detectChanges();
      return;
    }
  }

  ngOnInit() {
    setTimeout(() => {
      this.container = $(this.viewElement.nativeElement).find('#contentContainer')[0];
    });

    this.initRotationHandler();
    //console.log('ngOnInit');
    this.goKafisma(this.navParams.data.item.kafisma);
  }

  ngAfterViewInit() {
    this.initPopOver();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    window.removeEventListener("orientationchange", this.rotationHandler);
    (<any>screen).orientation.removeEventListener("change", this.rotationHandler);
    if (this.hideInfoTimeOut) clearTimeout(this.hideInfoTimeOut);
  }

  initPopOver() {
    console.log($(this.viewElement.nativeElement));
    $(this.viewElement.nativeElement).on('click touch', '[psalm]', (e: any) => {
      let popover = this.popoverCtrl.create(PsalmPopover, {
        elem: this.viewElement.nativeElement,
        event: e,
        toastCtrl: this.toastCtrl,
        settingsService: this.settingsService,
      });
      popover.present({
        ev: e
      });
    });
  }

  initRotationHandler() {
    this.rotationHandler = (() => {
      //console.log('view orientationchange');
      const progress: number  = this.page / this.pagesTotal;
      //console.log('this.page', this.page);
      //console.log('this.pagesTotal', this.pagesTotal);
      //console.log('progress', progress);
      this.isLandscape = (<any> window).screen.orientation.type.indexOf('landscape') > -1;
      setTimeout(() => {
        this.calculatePagesTotal();
        this.goPage(Math.round(this.pagesTotal * progress));
        this.chRef.detectChanges();
      }, 400);
    });
    window.addEventListener("orientationchange", this.rotationHandler, false);
    (<any>screen).orientation.addEventListener('change', this.rotationHandler);
  }

  loadContent() {
    if (this.navParams.data.item.add) {
      this.content = this.data.adds[this.settings.textSource][this.navParams.data.item.add].data;
    } else if (this.navParams.data.item.psalm) {
      // this.content = this.getPsalm(this.navParams.data.item.psalm);
      this.psalmJson = this.dataJson.psalm.ru[this.navParams.data.item.psalm];
      console.log('this.navParams.data', this.navParams.data);
      console.log('this.psalmJson', this.psalmJson);
      if (this.navParams.data.isFavorite) {
        this.settings.psalms = _.sortBy(this.settings.psalms, (item) => +item);
        let index: number = this.settings.psalms.indexOf(this.navParams.data.item.psalm);
        console.log('this.settings.psalms', this.settings.psalms);
        console.log('index', index);
        this.prevPsalm = (index > 0) ? this.settings.psalms[index - 1] : undefined;
        this.nextPsalm = this.settings.psalms[index + 1] || undefined;
      } else {
        let prev: number = +this.navParams.data.item.psalm - 1;
        let next: number = +this.navParams.data.item.psalm + 1;
        this.prevPsalm = `${prev > 0 ? prev : null}`;
        this.nextPsalm = `${next < 151 ? next : null}`;
      }
    } else if (this.navParams.data.item.chin) {
      this.content = this.data.chin[this.settings.textSource][this.navParams.data.item.chin].data;
    } else if (this.navParams.data.item.songs) {
      this.content = this.data.songs[this.settings.textSource];
    }

    this.updateTitle();
    this.checkExtends();

    if (this.page > 0) this.goPage(this.page);
  }

  goPsalm(psalm: string) {
    this.navCtrl.popToRoot();
    this.navCtrl.push(PageView, {
      item: {
        'psalm': psalm,
        'ru': 'Псалом ' + (+psalm),
        'cs': 'Псалом ' + (+psalm)
      },
      isFavorite: this.navParams.data.isFavorite,
      component: PageView,
      note: ''
    });
  }

  checkExtends() {
    if (this.settings.textSource !== 'ru') {
      return;
    }
    let el = $('<div></div>').html(this.content);
    this.content = el.html();
    setTimeout(() => {
      if (this && this.chRef) {
        this.calculatePagesTotal();
        this.chRef.detectChanges();
      }
    })
  }

  goSettings(): void {
    this.navCtrl.push(SettingsPage);
  }

  setBookMark(): void {
    if (!this.isMarked()) {
      this.settings.bookmarks.push(+this.kafisma);
      this.settings.bookmarks = _.sortBy(this.settings.bookmarks);
      this.settingsService.saveSettings(this.settings);
      let toast = this.toastCtrl.create({
        message: `Кафизма ${+this.kafisma} добавленна в закладки`,
        duration: 3000
      });
      toast.present();
    } else {
      this.settings.bookmarks = _.without(this.settings.bookmarks, +this.kafisma);
      this.settingsService.saveSettings(this.settings);
      let toast = this.toastCtrl.create({
        message: `Кафизма ${+this.kafisma} убрана из закладок.`,
        duration: 3000
      });
      toast.present();
    }
  }

  addHistory(): void {
    console.log('addHistory');
    if (!this.kafisma) return;

    let last = this.settings.history[this.settings.history.length - 1];
    if (!last || (+this.kafisma && +last.kafisma !== +this.kafisma)) {
      this.settings.history.push({
        kafisma: +this.kafisma,
        date: moment().toISOString(),
        page: this.page,
        scroll: 0
      });
      if (this.settings.history.length > 20) {
        this.settings.history = this.settings.history.slice(-20, 0);
      }
      console.log('this.settings.history', this.settings.history);
      this.settingsService.saveSettings(this.settings);
    } else if (+last.kafisma === +this.kafisma) {
      last.date = moment().toISOString();
      last.page = this.page;
      last.scroll = 0;
      this.settingsService.saveSettings(this.settings);
    }
  }

  isMarked(): boolean {
    return this.settings.bookmarks.indexOf(+this.kafisma) !== -1;
  }

  public getTranslateX(): string {
    const vw: number = 100 * this.page;
    return `-${vw}vw`;
  }

  public goPage(n): void {
    console.log('goPage', n);
    if (!this.settings.bookMode) {
      this.page = 0;
      this.chRef.detectChanges();
      return;
    }

    if (n > -1 && n <= this.pagesTotal -1) {
      this.page = n;
    }
    //console.log('goPage', n, ' / ', this.pagesTotal);
    this.calculatePagesTotal();
    setTimeout(() => {
      this.calculatePagesTotal();
      this.chRef.detectChanges();
    }, 1000);

    this.showInfo();
    this.addHistory();
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

  public calculatePagesTotal(): number {
    if (!this.container) return 1;

    if (!this.settings.bookMode) {
      this.page = 0;
      return;
    }
    // let pages = this.container.scrollWidth / window.screen.availWidth;
    let pages: number;

    if (this.isLandscape) {
      pages =($('.after_page')[0].offsetLeft - 10) / ($('.after_page')[0].offsetWidth + 10) / 2;
    } else {
      pages =($('.after_page')[0].offsetLeft - 10) / ($('.after_page')[0].offsetWidth + 10)
    }

    console.log('pages', pages);
    this.pagesTotal = Math.ceil(pages);

    console.log('this.page', this.page);
    if (this.page > (this.pagesTotal - 1)) {
      this.page = this.pagesTotal - 1;
    }
    return this.pagesTotal;
  }

  public goKafisma(id: string): void {
    console.log('goKafisma', id);
    this.kafisma = id;
    this.kafismaJson = (new kafismaRuJson()).data[this.kafisma];
    this.page = 0;
    this.loadContent();
    setTimeout(() => {
      let $el = $(this.viewElement.nativeElement).find('.scroll-content:first');
      $el.animate({ scrollTop: 0 }, 200);
    });
  }

  updateTitle() {
    if (this.kafisma) {
      let item = Contents.getItem(this.kafisma);
      this.title = item[this.settings.textSource];
    } else if (this.navParams.data.item.psalm) {
      this.title = this.navParams.data.item[this.settings.textSource];
      this.forceTitleRu = true;
    } else {
      this.title = this.navParams.data.item[this.settings.textSource];
      this.forceTitleRu = this.navParams.data.item.forceRu;
    }
  }


  goToPsalm(psalm): void {
    let $target: any = $(`[psalmid="${psalm}"]`)[0];

    if (!this.settings.bookMode) {
      let $el: any = $('.scroll-content');
      $el.animate({ scrollTop: $target.offsetTop - 15 }, 300);
    } else {
      let page = Math.floor($target.offsetLeft / ($target.offsetWidth + 10));
      this.goPage(page);
    }
  }
}
