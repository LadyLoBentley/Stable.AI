import { Routes, Route} from 'react-router-dom';

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import BoardingForm from "./pages/BoardingForm.jsx";

// Components
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import Chatbot from "./components/Chatbot/Chatbot.jsx";


function App() {
    const activeUser = "Lauren"

    return (
        <>
            <Header user={activeUser}/>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/boarding-form" element={<BoardingForm />} />
            </Routes>
            <Chatbot />
            <Footer />
        </>
    );
}

export default App
