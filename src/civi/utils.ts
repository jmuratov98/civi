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