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

    function toggleNav() {
        setShowNav(prev => !prev);
    }

    function closeNav() {
        setShowNav(false);
    }

    return (
        <div className="page">
            <Header user={activeUser} toggleNav={toggleNav} />

            {showNav && <div className="overlay" onClick={closeNav}></div>}

            <navBar isOpen={showNav} closeNav={closeNav} />

            <Routes>
                <Route path="/" element={<Dashboard />} />
            </Routes>

            <Chatbot />
            <Footer />
        </div>
    );
}

export default App
