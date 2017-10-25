import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Pipe, PipeTransform } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NeedsPage } from '../pages/needs/needs';
import { SlovarPage } from '../pages/slovar/slovar';
import { PageView } from '../pages/page-view/page-view';
import { SettingsPage } from '../pages/settings/settings';
import { SinodPage } from '../pages/sinod/sinod';

import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PsalmPopover } from './components/psalmPopOver'
import { Psalm } from './components/psalm/psalm.component'
import { Adds } from './components/adds/adds.component'
import { Kafisma } from './components/kafisma/kafisma.component';
import { Ends } from './components/ends/ends.component';

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
    NeedsPage,
    SettingsPage,
    SinodPage,
    PageView,
    SlovarPage,
    SafeHtmlPipe,
    PsalmPopover,
    Kafisma,
    Adds,
    Ends,
    Psalm
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    NeedsPage,
    SettingsPage,
    SinodPage,
    PageView,
    SlovarPage,
    PsalmPopover,
    Kafisma,
    Adds,
    Ends,
    Psalm
  ],
  providers: [
    AndroidFullScreen,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
