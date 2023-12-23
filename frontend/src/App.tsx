import { Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserHistory } from "history";
import ReactGA from "react-ga4";

import AppRouter from "./AppRouter";
import Header from "./components/utils/Header";
import Footer from "./components/utils/Footer";
import GoogleMapsLoader from "./utils/googleMaps/GoogleMapsLoader";
import { useLayoutEffect, useState } from "react";

if (process.env.REACT_APP_GA_TRACKING_ID) {
    ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID!);
}

function App() {
    const queryClient = new QueryClient();
    const history = createBrowserHistory();
    const [state, setState] = useState({
        action: history.action,
        location: history.location,
    });

    useLayoutEffect(() => {
        history.listen(setState);
    }, [history]);

    return (
        <Router
            location={state.location}
            navigator={history}
            navigationType={state.action}
        >
            <QueryClientProvider client={queryClient}>
                <GoogleMapsLoader>
                    <>
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
            </QueryClientProvider>
        </Router>
    );
}

export default App;
