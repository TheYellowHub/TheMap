import { Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga4";
import { Helmet } from "react-helmet";

import AppRouter from "./AppRouter";
import Header from "./components/utils/Header";
import Footer from "./components/utils/Footer";
import GoogleMapsLoader from "./utils/googleMaps/GoogleMapsLoader";
import { useLayoutEffect, useState } from "react";

if (process.env.REACT_APP_GA_TRACKING_ID) {
    ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID!);
}

const queryClient = new QueryClient();

function App() {
    const history = createBrowserHistory();
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    });

    useLayoutEffect(() => {
        history.listen(setState);
    }, [history]);

    return (
        <QueryClientProvider client={queryClient}>
            <Router
                location={state.location}
                navigator={history}
                navigationType={state.action}
            >
                <GoogleMapsLoader>
                    <>
                        <Helmet>
                            <meta property="og:title" content="Endometriosis Providers Map | TheYellowHub" />
                            <meta name="og:description" content="Community-sourced user friendly database. Find excision specialist and other endometriosis providers near you." />
                            <meta property="og:image" content="/images/logo.png" />
                        </Helmet>
                        <header>
                            <Header />
                        </header>
                        <main>
                            <AppRouter />
                        </main>
                        <footer>
                            <Footer />
                        </footer>
                    </>
                </GoogleMapsLoader>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
