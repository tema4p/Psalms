import { Injectable } from '@angular/core';

declare var _:any;
const psalmsRange = {
    '01': '1-8',
    '02': '9-16',
    '03': '17-23',
    '04': '24-31',
    '05': '32-36',
    '06': '37-45',
    '07': '46-54',
    '08': '55-63',
    '09': '64-69',
    '10': '70-76',
    '11': '77-84',
    '12': '85-90',
    '13': '91-100',
    '14': '101-104',
    '15': '105-108',
    '16': '109-117',
    '17': '118',
    '18': '119-133',
    '19': '134-142',
    '20': '143-150',
};

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
        adds: true,
        bookMode: true,
        bookmarks: [],
        history: [],
        psalms: [],
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
        return _.clone(this.settings);
    }

    getPsalmsRange(kafizma: string): any {
        return psalmsRange[kafizma];
    }
}
