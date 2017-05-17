import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { SettingsPage } from '../settings/settings';
import { Contents } from '../../content/contents';
import { PageView } from '../../pages/page-view/page-view';
import { SettingsService } from '../../app/services/settingsService';
import { ToastController } from 'ionic-angular';

declare var _:any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public settings;
  public bookmarks: Array<{item: any, component: any, note: string}> = [];
  public history: Array<{item: any, component: any, note: string}> = [];
  public psalms: Array<{item: any, component: any, note: string}> = [];

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public settingsService: SettingsService) {
    this.loadBookmarks();
    this.loadPsalms();
  }

  loadBookmarks(): void {
    let kafizma = Contents.getKafizmaList();
    this.bookmarks = [];
    this.settings = this.settingsService.getSettings();
    _.each(this.settings.bookmarks, (item) => {
      this.bookmarks.push({
        item: kafizma['kafisma' + item],
        component: PageView,
        note: this.settingsService.getPsalmsRange(item)
      });
    });
    console.log('loadBookmarks', this.bookmarks);
  }

  loadPsalms(): void {
    this.psalms = [];
    this.settings = this.settingsService.getSettings();
    _.each(this.settings.psalms, (item) => {
      this.psalms.push({
        item: {
          'psalm': item,
          'ru': 'Псалом ' + (+item),
          'cs': 'Псалом ' + (+item)
        },
        component: PageView,
        note: ''
      });
      this.psalms = _.sortBy(this.psalms, (item) => +item.item.psalm);
    });
    console.log('loadPsalms', this.psalms);
  }

  openPage(page: any, params: any): void {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.navCtrl.setRoot(page.component, params);
  }

  removeBookmark(page): void {
    this.settings.bookmarks = _.without(this.settings.bookmarks, page.item.kafisma);
    this.settingsService.saveSettings(this.settings);
    let toast = this.toastCtrl.create({
      message: `Кафизма ${+page.item.kafisma} убрана из закладок.`,
      duration: 3000
    });
    toast.present();
    this.loadBookmarks();
  }

  removePsalm(page): void {
    console.log('page', page);
    this.settings.psalms = _.without(this.settings.psalms, page.item.psalm);
    this.settingsService.saveSettings(this.settings);
    let toast = this.toastCtrl.create({
      message: `Псалом ${+page.item.psalm} убран из избранного.`,
      duration: 3000
    });
    toast.present();
    this.loadPsalms();
  }

  goSettings(): void {
    this.navCtrl.push(SettingsPage);
  }

  ionViewWillEnter() {
    console.log('enter');
    this.settings = this.settingsService.getSettings();
  }
}
