import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { PageView } from '../pages/page-view/page-view';
// import { ListPage } from '../pages/list/list';
import { Contents } from '../contents';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{item: any, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [];

    let other = Contents.getOtherList();
    let kafizma = Contents.getKafizmaList();

    this.pages.push({ item: other['ustav'], component: PageView });
    this.pages.push({ item: other['start'], component: PageView });
    this.pages.push({ item: other['end'], component: PageView });

    for (let item in kafizma) {
      this.pages.push({
        item: kafizma[item],
        component: PageView
      })
    }

    this.pages.push({ item: other['posled'], component: PageView });
    this.pages.push({ item: other['pomannik'], component: PageView });
    this.pages.push({ item: other['info'], component: PageView });
    this.pages.push({ item: other['slovar'], component: PageView });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page: any, params: any) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, params);
  }
}
