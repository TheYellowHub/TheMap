/* eslint-disable @typescript-eslint/no-explicit-any */
export function objectsDiff<T>(previousObject: T, currentObject: T): T {
    let diff = {};
    for (const property in currentObject) {
        if ((previousObject as any)[property] !== (currentObject as any)[property]) {
            diff = { ...diff, [property]: (currentObject as any)[property] };
        }
    }
    return diff as T;
}

export function capitalizeFirstLetter(text: string): string {
    return text[0].toUpperCase() + text.slice(1);
}

export function getCurrentUrl(withOrigin = true): string {
    return (withOrigin ? window.location.origin : "") + window.location.pathname + window.location.hash; //  + window.location.search ?
}

export function range(start: number, end: number) {
    const array = [];
    for (let i = start; i <= end; i++) {
        array.push(i);
    }
    return array;
}