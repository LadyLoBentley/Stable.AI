import { Outlet } from "react-router-dom";
import { useState } from "react";

const initialFormData = {
    // Horse Information
    horseName: "",
    breed: "",
    sex: "",
    birthdate: "",
    height: "",
    weight: "",

    locationType: "stall",
    turnoutType: "",
    pastureName: "",
    barn: "",
    stallId: "",

    escapeRisk: false,
    mayBite: false,
    mayKick: false,
    difficultToCatch: false,
    herdDominant: false,
    sedationRequired: false,
    foodAggressive: false,
    requiresExperiencedHandler: false,

    temperament: "",
    notes: "",
    image: null,

    // Medical information
    vetClinic: "",
    vetName: "",
    vetPhone: "",

    isSameVet: true,
    emergencyClinic: "",
    emergencyVetName: "",
    emergencyVetPhone: "",
    emergencyAuthorization: false,
    emergencyInstructions: "",

    rabiesExpiration: "",
    tetanusExpiration: "",
    westNileExpiration: "",
    eeeWeeExpiration: "",
    fluRhinoExpiration: "",
    cogginsExpiration: "",

    hasShoes: false,
    farrierName: "",
    farrierPhone: "",
    farrierDate: "",
    dentistName: "",
    dentistPhone: "",
    dentalDate: "",
    chiropractorName: "",
    chiropractorPhone: "",
    chiropractorDate: "",
    massageTherapist: "",
    therapistPhone: "",
    massageDate: "",
    lastDewormer: "",
    dewormProvider: "",
    dewormDate: "",

    medicalConditions: [],
    allergies: [],
    medications: [],
    supplements: [],

    medicalNotes: "",

    // Food Information
    feedHay: true,
    hayType: "",
    hayAmount: "",
    hayReplacement: "",
    replacementAmount: "",
    replacementUnit: "",

    grainType: "",
    grainAmount: "",
    grainUnit: "",
    addFoodAdditive: false,
    foodAdditive: "",
    additiveAmount: "",
    additiveUnit: "",

    mustSeparate: false,
    soakFeed: false,
    hayNet: false,
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
};

function FormManager() {
    const [formData, setFormData] = useState(initialFormData);

    function resetFormData() {
        setFormData(initialFormData);
    }

    return (
        <Outlet context={{ formData, setFormData, resetFormData }} />
    );
}

export default FormManager;