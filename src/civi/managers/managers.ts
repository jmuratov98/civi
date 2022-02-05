import { SaveDataInfo } from "../game";

export abstract class Manager<Type> {
    protected readonly meta: Record<string, Record<string, Type>>;

    protected constructor() {
        this.meta = {};
        this.meta.meta = {};
    }

    protected abstract initMetaData(): void;
    public abstract getEffect(data: Type, effectName: string): number;

    public abstract save(): SaveDataInfo[];
    public abstract load(data: SaveDataInfo[]): void;
}
