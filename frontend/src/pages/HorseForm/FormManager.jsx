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
        image: null,

        // Medical information
        vetClinic: "",
        vetName: "",
        vetPhone: "",

        rabiesExpire: "",
        tetanusExpire: "",
        westNileExpire: "",
        eeeWeeExpire: "",
        fluRhinoExpire: "",

        cogginsExpire: "",
        farrierDue: "",
        dentalDue: "",
        dewormDue: "",

        medicalConditions: [],
        allergies: [],
        medications: [],
        supplements: [],
        medicalNotes: "",

        // Food Information
        feedHay: true,
        hayType: "",
        hayReplacement: "",

        grainType: "",
        grainAmount: "",
        addFoodAdditive: false,
        foodAdditive: "",

        isFoodAggressive: false,
        feedingInstructions: "",

        // Owner Information
        ownerName: "",
        ownerPhone: "",
        ownerEmail: "",

        emergencyContactName: "",
        emergencyContactRelations: "",
        emergencyContactPhone: "",

        streetAddress: "",
        aptNo: "",
        city: "",
        state: "",
        zip: "",

        signedWaiver: false
    });

    return (
        <Outlet context={{formData, setFormData}} />
    );
}

export default FormManager;