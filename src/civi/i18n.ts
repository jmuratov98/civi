import i18next from 'i18next';

import en from '../assets/locales/en.json';

type i18Callback = (err: any) => void

class I18n {
    readonly defaultLang: string;
    readonly langs: string[];
    readonly langLabels: Record<string, string>;
    private _currentLanguage: string
    
    constructor() {
        this.defaultLang = 'en';
        this.langs = [
            'en',
            
            // TODO: Add support for other languages
        ]

        this.langLabels = {
            'en': 'English',
        }

        this.getCurrentLanguage();
    }

    public init() {
        return i18next.init({
            fallbackLng: this.defaultLang,
            lng: this._currentLanguage,
            supportedLngs: this.langs,
            debug: true,
            resources: {
                en: { translation: en }
            }
        });
    }

    public t(str: string): string {
        return i18next.t(str);
    }

    public setLanguage(language: string) {
        window.localStorage.setItem('civi.language', language);
        window.location.reload();
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