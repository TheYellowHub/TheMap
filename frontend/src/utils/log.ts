import ReactGA from "react-ga4";

export default function logError(error: Error) {
    if (process.env.NODE_ENV === "development") {
        console.log();
    } else if (process.env.NODE_ENV === "production") {
        ReactGA.event({
            category: "Errors",
            action: String(error),
        });
    }
}
