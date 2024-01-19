import ReactGA from "react-ga4";

import { getCurrentUrl } from "./utils";


const isProductionEnv = process.env.NODE_ENV === "production";

export default function logError(error: Error | string) {
    if (isProductionEnv) {
        ReactGA.event({
            category: "Errors",
            action: String(error),
        });
    } else {
        console.log(error);
    }
}

export function logPageView() {
    const currentUrl = getCurrentUrl(false);
    if (isProductionEnv) {
        ReactGA.send({ hitType: "pageview", title: currentUrl, screen: currentUrl});
    } else {
        console.log("Page view", currentUrl);
    }
}
