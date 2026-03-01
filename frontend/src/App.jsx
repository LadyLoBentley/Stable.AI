import Header from "./component/Header.jsx"
import Footer from "./component/Footer.jsx"
//import Horses from "./pages/Horses.jsx";
import Form from "./pages/HorseForm.jsx"

function App() {
    const activeUser = "Lauren"

    return (
        <>
            <Header user={activeUser}/>
            <Form />
            <Footer />
        </>
    );
}

export default App
