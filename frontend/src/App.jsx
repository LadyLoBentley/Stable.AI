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
import DocumentDetailPage from "./pages/DocumentDetailPage.jsx";
import InventoryDetailPage from "./pages/InventoryDetailPage.jsx";
import HorseProfile from "./pages/HorseProfilePages/HorseProfile.jsx";
import HorseDetailTab from "./pages/HorseProfilePages/HorseDetailTab.jsx";
import MedicalRecordTab from "./pages/HorseProfilePages/MedicalRecordTab.jsx";
import MedicationsSupplementsTab from "./pages/HorseProfilePages/MedicationsSupplementsTab.jsx";
import FeedingRegimeTab from "./pages/HorseProfilePages/FeedingRegimeTab.jsx";
import OwnerInformationTab from "./pages/HorseProfilePages/OwnerInformationTab.jsx";


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

                        <Route path="/horses/:horse_id" element={<HorseProfile />}>
                            <Route index element={<HorseDetailTab />} />
                            <Route path="medical" element={<MedicalRecordTab />} />
                            <Route path="meds-supplements" element={<MedicationsSupplementsTab />} />
                            <Route path="feed" element={<FeedingRegimeTab />} />
                            <Route path="owner" element={<OwnerInformationTab />} />
                        </Route>

                        <Route path="/add-horse" element={<FormManager />}>
                            <Route index element={<HorseForm />} />
                            <Route path="medical/food" element={<FoodForm />} />
                            <Route path="medical" element={<MedicalForm />} />
                            <Route path="medical/food/owner" element={<OwnerForm />} />
                        </Route>

                        <Route path={"/inventory"} element={<Inventory />} />
                        <Route path={"/inventory/:item_id"} element={<InventoryDetailPage />} />
                        <Route path="/add-item" element={<AddInventoryForm />} />

                        <Route path="/documents" element={<Documents />} />
                        <Route path="/documents/:document_id" element={<DocumentDetailPage />} />
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
