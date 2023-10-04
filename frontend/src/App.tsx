import { HashRouter as Router } from "react-router-dom";
import { Container } from "react-bootstrap";
import { QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";

import AppRouter from "./AppRouter";
import Header from "./components/utils/Header";
import Footer from "./components/utils/Footer";
import GoogleMapsLoader from "./utils/googleMaps/GoogleMapsLoader";
import Message from "./components/utils/Message";
import Icon from "./components/utils/Icon";

function App() {
    const queryClient = new QueryClient();

    const [googleMapsIsLoaded, setGoogleMapsIsLoaded] = useState(false);

    return (
        <Router>
            <QueryClientProvider client={queryClient}>
                <GoogleMapsLoader setGoogleMapsIsLoaded={setGoogleMapsIsLoaded}>
                    <>
                        <header>
                            <Header />
                        </header>
                        <main>
                            {/* TODO: change the error message?  */}
                            {!googleMapsIsLoaded && (
                                <Message variant="danger">
                                    {googleMapsIsLoaded} Something went wrong - The map is down
                                    <Icon icon="fa-face-sad-tear fa-2xl" />
                                </Message>
                            )}

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
