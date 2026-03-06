import { Routes, Route} from 'react-router-dom';
import { useState } from 'react';

// Pages
import Dashboard from "./pages/Dashboard.jsx";

// Components
import Header from "./components/Header.jsx"
import Navbar from "./components/Navbar/Navbar.jsx"
import Chatbot from "./components/Chatbot/Chatbot.jsx";
import Footer from "./components/Footer.jsx"


function App() {

    const activeUser = "Lauren"
    const [showNav, setShowNav] = useState(false);

    function ToggleNav() {
        setShowNav(prev => !prev);
    }

    function CloseNav() {
        setShowNav(false);
    }

    return (
        <div className="page">
            <Header user={activeUser} toggleNav={ToggleNav} />

            <div className="appLayout">
                <Navbar isOpen={showNav} closeNav={CloseNav} />

                <main className={`mainContent ${showNav ? "navOpen" : ""}`}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                    </Routes>
                </main>
            </div>

            <Chatbot />
            <Footer />
        </div>
    );
}

export default App
