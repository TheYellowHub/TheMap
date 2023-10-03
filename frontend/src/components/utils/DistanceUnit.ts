export type DistanceUnit = "KM" | "Mile";

export function kmToMile(km: number) {
    return km / 0.621371;
}
