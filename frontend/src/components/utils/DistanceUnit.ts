export type DistanceUnit = "km" | "mi";

export function kmToMile(km: number) {
    return km / 0.621371;
}
