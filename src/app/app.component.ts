import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Config, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { PageView } from '../pages/page-view/page-view';
import { SlovarPage } from '../pages/slovar/slovar';

import { Contents } from '../content/contents';
import { SettingsService } from './services/settingsService';
import { RateService } from './services/rateService';

@Component({
  templateUrl: 'app.html',
  providers: [SettingsService, RateService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  backButtonPressedOnceToExit: boolean;
  rootPage: any = HomePage;

  pages: Array<{item: any, component: any, note?: string}>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public settingsService: SettingsService,
              private rateService: RateService,
              private config: Config,
              private toastCtrl: ToastController) {
    this.initializeApp();

    this.pages = [];

    let other = Contents.getOtherList();
    let kafizma = Contents.getKafizmaList();

    this.pages.push({ item: other['ustav'], component: PageView });
    this.pages.push({ item: other['start'], component: PageView });

    for (let item in kafizma) {
      this.pages.push({
        item: kafizma[item],
        component: PageView,
        note: this.settingsService.getPsalmsRange(kafizma[item].kafisma)
      })
    }

    this.pages.push({ item: other['end'], component: PageView });
    this.pages.push({ item: other['posled'], component: PageView });
    this.pages.push({ item: other['pomannik'], component: PageView });
    this.pages.push({ item: other['info'], component: PageView });
    this.pages.push({ item: other['6p'], component: PageView });
    this.pages.push({ item: other['12p'], component: PageView });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.config.set('backButtonText', 'Назад');

      this.platform.registerBackButtonAction(() => {

        if (this.backButtonPressedOnceToExit) {
          this.platform.exitApp();
        } else if (this.nav.canGoBack()) {
          this.nav.pop({});
        } else if (this.nav.getActive().name != 'HomePage') {
          this.openHome();
        } else {
          this.showToast();
          this.backButtonPressedOnceToExit = true;
          setTimeout(() => {
            this.backButtonPressedOnceToExit = false;
          },2000)
        }
      });
    });
  }

  showToast() {
    let toast = this.toastCtrl.create({
      message: 'Нажмите еще раз для выхода из приложения',
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
  }

  openPage(page: any): void {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, page);
  }

  openHome(): void {
    this.nav.setRoot(HomePage);
  }

  openSlovar(): void {
    this.nav.setRoot(SlovarPage);
  }
}
