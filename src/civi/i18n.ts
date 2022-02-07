import i18next from 'i18next';

import en from '../assets/locales/en.json';

type i18Callback = (err: any) => void

class I18n {
    readonly defaultLang: string;
    readonly langs: string[];
    private _currentLanguage: string
    
    constructor() {
        this.defaultLang = 'en';
        this.langs = [
            'en',
            
            // TODO: Add support for other languages
        ]

        this.getCurrentLanguage();
    }

    public init(callback: i18Callback) {
        i18next.init({
            fallbackLng: this.defaultLang,
            lng: this._currentLanguage,
            supportedLngs: this.langs,
            debug: true,
            resources: {
                en
            }
        }, callback);
    }

    public t(str: string): string {
        return i18next.t(str);
    }

    private getCurrentLanguage(): void {
        const lang = window.localStorage.getItem('civi.language');
        this._currentLanguage = lang ? lang : this.defaultLang;
    }

    // Getters
    public get language(): string { return this._currentLanguage; }
}

export const i18n: I18n = new I18n();

export function $I(str: string): string {
    return i18n.t(str);
}