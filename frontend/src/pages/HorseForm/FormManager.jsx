import { Outlet } from "react-router-dom";
import {useState} from "react";


function FormManager() {

    const [formData, setFormData] = useState({
        // Horse Information
        horseName: "",
        breed: "",
        sex: "",
        birthdate: "",
        pastureName: "",
        hasStall: false,
        barn: "",
        stallId: "",
        temperament: "",
        notes: "",
        image: null
    });

    return (
        <Outlet context={{formData, setFormData}} />
    );
}

export default FormManager;