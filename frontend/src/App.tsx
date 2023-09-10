import { HashRouter as Router } from "react-router-dom";
import { Container } from "react-bootstrap";
import { QueryClient, QueryClientProvider } from "react-query";

import AppRouter from "./AppRouter";
import Header from "./components/utils/Header";
import Footer from "./components/utils/Footer";

function App() {
    const queryClient = new QueryClient();

    return (
        <Router>
            <QueryClientProvider client={queryClient}>
                <Container className="app">
                    <Header />
                    <main>
                        <AppRouter />
                    </main>
                    <Footer />
                </Container>
            </QueryClientProvider>
        </Router>
    );
}

export default App;
