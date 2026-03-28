import { Routes, Route} from 'react-router-dom';
import { useState } from 'react';

// Pages
import HorseDashboard from "./pages/HorseDashboard.jsx";
import FormManager from "./pages/HorseForm/FormManager.jsx";
import HorseForm from "./pages/HorseForm/HorseForm.jsx";
import FoodForm from "./pages/HorseForm/FoodForm.jsx";
import MedicalForm from "./pages/HorseForm/MedicalForm.jsx";
import OwnerForm from "./pages/HorseForm/OwnerForm.jsx";
import Inventory from "./pages/Inventory.jsx";
import AddInventoryForm from "./pages/AddInventoryForm.jsx";
import Documents from "./pages/Documents.jsx";
import AddDocument from "./pages/AddDocument.jsx";

// Components
import Header from "./components/Header.jsx"
import Navbar from "./components/Navbar/Navbar.jsx"
import Chatbot from "./components/Chatbot/Chatbot.jsx";
import Footer from "./components/Footer.jsx"



function App() {

    const [showNav, setShowNav] = useState(false);

    function ToggleNav() {
        setShowNav(prev => !prev);
    }

    function CloseNav() {
        setShowNav(false);
    }

    return (
        <div className="page">
            <Header toggleNav={ToggleNav} />

            <div className={`appLayout`}>
                <Navbar isOpen={showNav} closeNav={CloseNav} />

                <main className={`mainContent ${showNav ? "navOpen" : ""}`}>
                    <Routes>
                        <Route path="/" element={<HorseDashboard />} />

                        <Route path="/add-horse" element={<FormManager />}>
                            <Route index element={<HorseForm />} />
                            <Route path="medical/food" element={<FoodForm />} />
                            <Route path="medical" element={<MedicalForm />} />
                            <Route path="medical/food/owner" element={<OwnerForm />} />
                        </Route>

                        <Route path={"/inventory"} element={<Inventory />} />
                        <Route path="/add-item" element={<AddInventoryForm />} />


                        <Route path="/documents" element={<Documents />} />
                        <Route path="/add-document" element={<AddDocument />} />
                    </Routes>
                </main>
            </div>
            <Chatbot />
            <Footer />
        </div>
    );
}

export default App
