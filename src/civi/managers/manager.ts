import { Game } from '../game';

type GetEffectFn = (item: unknown, effect: unknown) => number;

type ProviderObject = {
    getEffect: GetEffectFn,
}

type MetaObject = { 
    meta: any[],
    provider: ProviderObject
}
export abstract class Manager {
    protected _game: Game;
    protected _meta: MetaObject;
    protected _effectsCached: Record<string, number>;

    private _effectsBase: Record<string, number> = {
        'foodMax': 5000,
        'woodMax': 5000,
        'stoneMax': 5000,
        'oreMax': 100,
        'scienceMax': 250,
        'orePercentageBase': 0.1
    }
    
    protected constructor(game: Game) {
        this._game = game;
        this._effectsCached = {}
    }

    protected initializeMeta(meta: any[], provider: ProviderObject): void {
        this._meta = {
            meta: meta,
            provider: provider
        }
    }

    protected initEffectCached(): void {

        for(let i = 0; i < this._meta.meta.length; i++) {
            for(const effectName in this._meta.meta[i].effects) {
                this._effectsCached[effectName] = 0;
            }
        }

        for(const effectName in this._effectsBase) {
            this._effectsCached[effectName] = this._effectsBase[effectName]
        }

    }

    public updateEffectsCached(): void { 
        for (const effectName in this._effectsCached) {
            let effect = 0;
            for(let i = 0; i < this._meta.meta.length; i++) {
                for(const en in this._meta.meta[i].effects) {
                    if(en == effectName) {
                        effect += this._meta.provider.getEffect(this._meta.meta[i], effectName);
                    }
                }
            }

            if(effectName in this._effectsBase) {
                effect += this._effectsBase[effectName];
            }
        
            this._effectsCached[effectName] = effect;
            this._game.effects[effectName] = effect
        }
    }

}