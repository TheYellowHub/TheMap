import { HashRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import AppRouter from "./AppRouter";
import Header from "./components/utils/Header";
import Footer from "./components/utils/Footer";
import GoogleMapsLoader from "./utils/googleMaps/GoogleMapsLoader";

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
