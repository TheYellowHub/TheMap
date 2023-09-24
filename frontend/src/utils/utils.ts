export default function objectsDiff<T>(previousObject: T, currentObject: T): T {
    let diff = {};
    for (const property in currentObject) {
        if ((previousObject as any)[property] !== (currentObject as any)[property]) {
            diff = { ...diff, [property]: (currentObject as any)[property] };
        }
    }
    return diff as T;
}
