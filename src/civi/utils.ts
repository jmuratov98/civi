export function getPosition(el: HTMLElement): DOMRect {
    return el.getBoundingClientRect();
}

export function getCssVariable(el: HTMLElement, prop: string): number {
    return parseFloat(getComputedStyle(el).getPropertyValue(prop));
}

export function setCssVariable(el: HTMLElement, prop: string, value: string): void {
    el.style.setProperty(prop, value)
}

export function incrementCssVariable(el: HTMLElement, prop: string, inc: number): void {
    setCssVariable(el, prop, (getCssVariable(el, prop) + inc).toString())
}

export function fixFloatingPoint(num: number): number {
    let numAdjusted = Math.floor(num * 10000000) / 10000000;
    if(Math.round(num - numAdjusted) * 10000000) {
        numAdjusted = Math.floor((num + 0.000000000000010) * 10000000) / 10000000;
    }
    return numAdjusted;
}