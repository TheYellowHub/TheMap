import { HashRouter as Router, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import ReactGA from "react-ga4";

import AppRouter from "./AppRouter";
import Header from "./components/utils/Header";
import Footer from "./components/utils/Footer";
import GoogleMapsLoader from "./utils/googleMaps/GoogleMapsLoader";

if (process.env.REACT_APP_GA_TRACKING_ID) {
    ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID!);
}

function App() {
    const queryClient = new QueryClient();

    return (
        <Router>
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
