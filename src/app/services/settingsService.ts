import { Injectable } from '@angular/core';

declare var _:any;

@Injectable()
export class SettingsService {
    private settings: any = {
        fontSize: '16',
        fontFamily: "Times New Roman",
        textSource: 'hh',
        theme: 'normal',
        perenos: false,
        hyphens: true,
        justify: true,
        repose: false,
        adds: true
    };

    constructor() {
        this.loadSettings();
        console.log('SettingsService init');
    }

    saveSettings(settings: any): any {
        this.settings = settings;
        localStorage['settings'] = JSON.stringify(this.settings);
        console.log('SaveSettings', this.settings);
    }

    loadSettings(): any {
        if (localStorage['settings']) {
            _.extend(this.settings, JSON.parse(localStorage['settings']));
            console.log('LoadSettings', this.settings);
        } else {
            console.log('Default Settings', this.settings);
        }
    }

    getSettings(): any {
        return this.settings;
    }
}
