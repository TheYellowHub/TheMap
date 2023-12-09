export default function logError(error: Error) {
    if (process.env.NODE_ENV === "development") {
        console.log(error);
    }
}
