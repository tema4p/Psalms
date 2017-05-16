import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Pipe, PipeTransform } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SlovarPage } from '../pages/slovar/slovar';
import { PageView } from '../pages/page-view/page-view';
import { SettingsPage } from '../pages/settings/settings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PsalmPopover } from './components/psalmPopOver'

@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SettingsPage,
    PageView,
    SlovarPage,
    SafeHtmlPipe,
    PsalmPopover
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SettingsPage,
    PageView,
    SlovarPage,
    PsalmPopover
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
