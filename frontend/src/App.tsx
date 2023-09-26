import { HashRouter as Router } from "react-router-dom";
import { Container } from "react-bootstrap";
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
                    <Container className="app" fluid>
                        <Header />
                        <main>
                            <AppRouter />
                        </main>
                        <Footer />
                    </Container>
                </GoogleMapsLoader>
            </QueryClientProvider>
        </Router>
    );
}

export default App;
