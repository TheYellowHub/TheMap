import ReactGA from "react-ga4";

import { getCurrentUrl } from "./utils";


const isProductionEnv = process.env.NODE_ENV === "production";

export function logPageView() {
    const currentUrl = getCurrentUrl(false);
    if (isProductionEnv) {
        ReactGA.send({ hitType: "pageview", title: currentUrl, screen: currentUrl});
    } else {
        console.log("Page view", currentUrl);
    }
}

export function logError(error: Error | string) {
    logEvent(String(error), "Errors");
}

export function logEvent(event: string, category?: LogEventsCategory) {
    category = category || "Events";
    if (isProductionEnv) {
        ReactGA.event({
            category: category,
            action: event,
        });
    } else {
        console.log(`${category}: ${event}`);
    }
}

export type LogEventsCategory = "LocationSharing" | "UserSession" | "Errors" | "Reviews" | "ReportAnIssue" | "Bookmarks" | "Events";
