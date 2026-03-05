import { Routes, Route} from 'react-router-dom';
import Header from "./component/Header.jsx"
import Footer from "./component/Footer.jsx"
import Dashboard from "./pages/Dashboard.jsx";


function App() {
    const activeUser = "Lauren"

    return (
        <>
            <Header user={activeUser}/>
            <Routes>
                <Route path="/" element={<Dashboard />} />
            </Routes>
            <Footer />
        </>
    );
}

export default App
