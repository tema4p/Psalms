import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { ToastController } from 'ionic-angular';
import { SettingsService } from '../../app/services/settingsService';
import { PopoverController } from 'ionic-angular';
import { PsalmPopover } from '../../app/components/psalmPopOver';

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
  public container: any;
  public psalmsTreeRu: any;
  public psalmsTreeCs: any;

  public forceTitleRu: boolean = false;

  public data: any = {
    psalm: {
      cs: (<any> window).psalmCs,
      ru: (<any> window).psalmRu,
    },
    adds: {
      cs: (<any> window).addsCs,
      ru: (<any> window).addsRu,
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
    this.settings = this.settingsService.getSettings();

  }

  ngOnInit() {
    setTimeout(() => {
      this.container = $(this.viewElement.nativeElement).find('#contentContainer')[0];
    });
    this.rotationHandler = (() => {
      //console.log('view orientationchange');
      const progress: number  = this.page / this.pagesTotal;
      //console.log('this.page', this.page);
      //console.log('this.pagesTotal', this.pagesTotal);
      //console.log('progress', progress);
      this.displayOrientation = (<any> window).screen.orientation.type;
      setTimeout(() => {
        this.calculatePagesTotal();
        this.goPage(Math.round(this.pagesTotal * progress));
        this.chRef.detectChanges();
      }, 300);
    });

    window.addEventListener("orientationchange", this.rotationHandler, false);
    //console.log('ngOnInit');
  }

  ngAfterViewInit() {
    console.log($(this.viewElement.nativeElement));
    $(this.viewElement.nativeElement).on('click touch', '[psalm]', (e: any) => {
      let popover = this.popoverCtrl.create(PsalmPopover, {
        event: e,
        toastCtrl: this.toastCtrl,
        settingsService: this.settingsService,
      });
      popover.present({
        ev: e
      });
    });
  }

  ngOnDestroy() {
    //console.log('ngOnDestroy');
    window.removeEventListener("orientationchange", this.rotationHandler);
    if (this.hideInfoTimeOut) {
      clearTimeout(this.hideInfoTimeOut);
    }
  }

  loadContent() {
    if (this.navParams.data.kafisma) {
      console.log('this.data.psalm', this.data.psalm);
      console.log('this.settings.textSource', this.settings.textSource  );
      this.content = this.data.psalm[this.settings.textSource][this.navParams.data.kafisma].data;
    } else if (this.navParams.data.add) {
      this.content = this.data.adds[this.settings.textSource][this.navParams.data.add].data;
    } else if (this.navParams.data.psalm) {
      this.content = this.getPsalm(this.navParams.data.psalm);
    }

    if (this.settings.textSource === 'ru') {
      this.title = this.navParams.data.ru;
    } else {
      this.title = this.navParams.data.cs;
    }

    this.checkExtends();
  }

  checkExtends() {
    if (this.settings.textSource !== 'ru') {
      return;
    }
    let el = $('<div></div>').html(this.content);
    if (this.settings.adds) {
      el.find('.trisv').html(this.data.adds['ru']['trisv'].data);
      el.find('.slava').html(this.data.adds['ru']['slava'].data).removeClass('red').removeClass('center');
      el.find('.slavaPre').html(this.data.adds['ru']['slavaPre'].data).removeClass('red').removeClass('center');
    }
    if (this.settings.repose) {
      el.find('.slava').html(this.data.adds['ru']['repose'].data).removeClass('red').removeClass('center');
      el.find('.trop-normal').html(this.data.adds['ru']['reposeM'].data);
    }
    this.content = el.html();
    setTimeout(() => {
      this.calculatePagesTotal();
    })
  }

  ionViewWillEnter() {
    //console.log('ionViewWillEnter');
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

  setBookMark(): void {
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
    //console.log('goPage', n, ' / ', this.pagesTotal);
    this.calculatePagesTotal();
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

  public calculatePagesTotal(): number {
    if (!this.container) return 1;
    // console.log('this.displayOrientation', this.displayOrientation);
    // console.log('this.container[0].scrollWidth', this.container.scrollWidth);
    // console.log('window.screen.availWidth', window.screen.availWidth);
    this.pagesTotal = Math.round(this.container.scrollWidth / (window.screen.availWidth + 18) );
    // console.log('calculatePagesTotal', this.pagesTotal);
    return this.pagesTotal;
  }

  public getPsalm(id: string): string {
    if (this.settings.textSource === 'ru') {
      if (!this.psalmsTreeRu) {
        let cont: string = '';
        for (let i = 1; i < 21; i++ ) {
          let key = i < 10 ? '0' + i : '' + i;
          cont += this.data.psalm.ru[key].data;
        }
        this.psalmsTreeRu = $('<div></div>').html(cont);
      }

      let $name = this.psalmsTreeRu.find('.namepsal:eq(' + (+id - 1) + ')');
      let $title = $name.next();
      let $psalm = this.psalmsTreeRu.find('.psal:eq(' + (+id - 1) + ')');

      return `
        <p class="namepsal">${$title.html()}</p>
        <p></p>
        <p class="psal">${$psalm.html()}</p>
      `;

    } if (this.settings.textSource === 'cs') {
      this.forceTitleRu = true;

      if (!this.psalmsTreeCs) {
        let cont: string = '';
        for (let i = 1; i < 21; i++ ) {
          let key = i < 10 ? '0' + i : '' + i;
          cont += this.data.psalm.cs[key].data;
        }
        this.psalmsTreeCs = $('<div></div>').html(cont);
      }

      let $title = this.psalmsTreeCs.find('#psalom' + id);
      let $psalm = $title.next();
      return `
        <p class="namepsal">${$title.html()}</p>
        <p></p>
        <p class="psal">${$psalm.html()}</p>
      `;
    }

  }
}
