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
              private settingsService: SettingsService) {
    this.loadBookmarks();
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

  goSettings(): void {
    this.navCtrl.push(SettingsPage);
  }

  ionViewWillEnter() {
    console.log('enter');
    this.settings = this.settingsService.getSettings();
  }
}
