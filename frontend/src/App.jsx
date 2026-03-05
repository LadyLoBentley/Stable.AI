import { Routes, Route} from 'react-router-dom';
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import Dashboard from "./pages/Dashboard.jsx";
import Chatbot from "./components/Chatbot/Chatbot.jsx";


function App() {
    const activeUser = "Lauren"

    return (
        <>
            <Header user={activeUser}/>
            <Routes>
                <Route path="/" element={<Dashboard />} />
            </Routes>
            <Chatbot />
            <Footer />
        </>
    );
}

export default App
