export class Console {
    readonly messages: string[];

    constructor() {
        this.messages = [];
    }

    public addMessage(message: string): void {
        this.messages.unshift(message);
    }
}