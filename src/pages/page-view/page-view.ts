import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { ToastController } from 'ionic-angular';
import { SettingsService } from '../../app/services/settingsService';
import { PopoverController } from 'ionic-angular';
import { PsalmPopover } from '../../app/components/psalmPopOver';
import { Contents } from '../../content/contents';

declare var $: any;
declare var _:any;
declare var moment:any;
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

  public forceTitleRu: boolean = false;

  public data: any = {
    psalm: {
      cs: (<any> window).psalmCs,
      ru: (<any> window).psalmRu,
    },
    adds: {
      cs: (<any> window).addsCs,
      ru: (<any> window).addsRu,
    },
    chin: {
      cs: (<any> window).chinCs,
      ru: (<any> window).chinRu,
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

  ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.initContent();
    this.kafisma = this.navParams.data.item.kafisma;

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
    if (this.hideInfoTimeOut) clearTimeout(this.hideInfoTimeOut);
  }

  initPopOver() {
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
  }

  loadContent() {
    if (this.kafisma) {
      console.log('this.data.psalm', this.data.psalm);
      console.log('this.settings.textSource', this.settings.textSource  );
      this.content = this.data.psalm[this.settings.textSource][this.kafisma].data;
    } else if (this.navParams.data.item.add) {
      this.content = this.data.adds[this.settings.textSource][this.navParams.data.item.add].data;
    } else if (this.navParams.data.item.psalm) {
      this.content = this.getPsalm(this.navParams.data.item.psalm);
    } else if (this.navParams.data.item.chin) {
      this.content = this.data.chin[this.settings.textSource][this.navParams.data.item.chin].data;
    }

    this.updateTitle();
    this.checkExtends();

    console.log('this.page');
    if (this.page > 0) this.goPage(this.page);
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
      this.chRef.detectChanges();
    })
  }

  goSettings(): void {
    this.navCtrl.push(SettingsPage);
  }

  setBookMark(): void {
    if (!this.isMarked()) {
      this.settings.bookmarks.push(this.kafisma);
      this.settings.bookmarks = _.sortBy(this.settings.bookmarks);
      this.settingsService.saveSettings(this.settings);
      let toast = this.toastCtrl.create({
        message: `Кафизма ${+this.kafisma} добавленна в закладки`,
        duration: 3000
      });
      toast.present();
    } else {
      this.settings.bookmarks = _.without(this.settings.bookmarks, this.kafisma);
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
    let last = this.settings.history[this.settings.history.length - 1];
    if (!last || (this.kafisma && last.kafisma !== this.kafisma)) {
      this.settings.history.push({
        kafisma: this.kafisma,
        date: moment().toISOString(),
        page: this.page,
        scroll: 0
      });
      if (this.settings.history.length > 20) {
        this.settings.history = this.settings.history.slice(-20, 0);
      }
      console.log('this.settings.history', this.settings.history);
      this.settingsService.saveSettings(this.settings);
    } else if (last.kafisma === this.kafisma) {
      last.date = moment().toISOString();
      last.page = this.page;
      last.scroll = 0;
      this.settingsService.saveSettings(this.settings);
    }
  }

  isMarked(): boolean {
    return this.settings.bookmarks.indexOf(this.kafisma) !== -1;
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
    this.page = 0;
    this.loadContent();
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

  public getPsalm(id: string): string {
    if (this.settings.textSource === 'ru') {
      if (!this.psalmsTreeRu) {
        let cont: string = '';
        for (let i = 1; i < 21; i++ ) {
          cont += this.data.psalm.ru[i].data;
        }
        this.psalmsTreeRu = $('<div></div>').html(cont);
      }

      let $name = this.psalmsTreeRu.find('.namepsal:eq(' + (+id - 1) + ')');
      let $title = $name.next();
      let $psalm = this.psalmsTreeRu.find('.psal:eq(' + (+id - 1) + ')');

      if (id === '118') {
        $psalm.append(this.psalmsTreeRu.find('.psal-118:eq(0)').html());
        $psalm.append('<br/><span class="red center sreda">&nbsp; [Среда&#769;:] &nbsp;</span><br/>');
        $psalm.append(this.psalmsTreeRu.find('.psal-118:eq(1)').html());
        $psalm.append(this.psalmsTreeRu.find('.psal-118:eq(2)').html());
      }

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
          cont += this.data.psalm.cs[i].data;
        }
        this.psalmsTreeCs = $('<div></div>').html(cont);
      }

      let $title = this.psalmsTreeCs.find('#psalom' + id);
      let $psalm = $title.next();

      if (id === '118') {
        $psalm.append(this.psalmsTreeCs.find('.psal-118:eq(0)').html());
        $psalm.append('<br/><span class="red center sreda">Среда&#769;:</span>');
        $psalm.append(this.psalmsTreeCs.find('.psal-118:eq(1)').html());
        $psalm.append(this.psalmsTreeCs.find('.psal-118:eq(2)').html());
      }

      return `
        <p class="namepsal">${$title.html()}</p>
        <p></p>
        <p class="psal">${$psalm.html()}</p>
      `;
    }

  }
}
