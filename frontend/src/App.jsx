import Header from "./component/Header.jsx"
import Footer from "./component/Footer.jsx"
import Horses from "./pages/Horses.jsx";

function App() {
    const activeUser = "Lauren"

    return (
        <>
            <Header user={activeUser}/>
            <Horses />
            <Footer />
        </>
    );
}

export default App
