import React, {useState} from "react";
import Button from "../component/Button/Button.jsx"

function HorseForm () {

    const handleClick = (e) => console.log(e)
    const [name, setName] = useState("");
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState("");
    const [breed, setBreed] = useState("");
    const [description, setDescription] = useState("");

    function handleAddName (event) {
        setName(event.target.value);
    }

    function handleAddAge (event) {
        setAge(event.target.value);
    }

    function handleAddGender (event) {
        setGender(event.target.value);
    }

    function handleAddBreed (event) {
        setBreed(event.target.value);
    }

    function handleAddDescription (event) {
        setDescription(event.target.value);
    }

    return (
        <div>
            <input value={name} onChange={handleAddName}/>
            <p>Name: {name}</p>

            <input value={age} onChange={handleAddAge} type="number"/>
            <p>Age: {age}</p>

            <label>
                <input
                    type="radio"
                    value="Male"
                    checked={gender === "Male"}
                    onChange={handleAddGender}
                />
                Male
            </label>
            <br />
            <label>
                <input
                    type="radio"
                    value="Female"
                    checked={gender === "Female"}
                    onChange={handleAddGender}
                />
                Female
            </label>
            <p>Gender: {gender}</p>

            <select value={breed} onChange={handleAddBreed}>
                <option value="">Select an option</option>
                <option value="Akhal-Teke">Akhal-Teke</option>
                <option value="Andalusian">Andalusian</option>
                <option value="Appaloosa">Appaloosa</option>
                <option value="Arabian">Arabian</option>
                <option value="Ardennais">Ardennais</option>
                <option value="Bashkir Curly">Bashkir Curly</option>
                <option value="Belgian Draught">Belgian Draught</option>
                <option value="Black Forest">Black Forest</option>
                <option value="Breton">Breton</option>
                <option value="Brumby">Brumby</option>
                <option value="Clydesdale">Clydesdale</option>
                <option value="Cob">Cob</option>
                <option value="Criollo">Criollo</option>
                <option value="Dutch Warmblood">Dutch Warmblood</option>
                <option value="Falabella">Falabella</option>
                <option value="Fjord">Fjord</option>
                <option value="Friesian">Friesian</option>
                <option value="Gypsy Vanner">Gyspy Vanner</option>
                <option value="Haflinger">Haflinger</option>
                <option value="Hanoverian">Hanoverian</option>
                <option value="Holsteiner">Holsteiner</option>
                <option value="Icelandic">Icelandic</option>
                <option value="Irish Sport">Irish Sport</option>
                <option value="Konik">Konik</option>
                <option value="Kurdish">Kurdish</option>
                <option value="Lipizzan">Lipizzan</option>
                <option value="lusitano">Lusitano</option>
                <option value="Mangalarga Marchador">Mangalarga Marchador</option>
                <option value="Marwari">Marwari</option>
                <option value="Missouri Fox Trotter">Missouri Fox Trotter</option>
                <option value="Mongolian">Mongolian</option>
                <option value="Morgan">Morgan</option>
                <option value="Mustang">Mustang</option>
                <option value="Noriker">Noriker</option>
                <option value="Other">Other</option>
                <option value="Paint">Paint</option>
                <option value="percheron">Percheron</option>
                <option value="Peruvian paso">Peruvian paso</option>
                <option value="Pure Spanish Breed">Pure Spanish Breed</option>
                <option value="Quarter">Quarter Horse</option>
                <option value="Saddlebred">Saddlebred</option>
                <option value="Selle Francais">Selle Francais</option>
                <option value="Shetland Pony">Shetland Pony</option>
                <option value="Shire">Shire</option>
                <option value="Standardbred">Standardbred</option>
                <option value="Tennessee Walking">Tennessee Walking Horse</option>
                <option value="Thoroughbred">Thoroughbred</option>
                <option value="Trakehner">Trakehner</option>
                <option value="Turkoman">Turkoman</option>
                <option value="Waler">Waler</option>
                <option value="Welsh Cob">Welsh Cob</option>
                <option value="Zangersheide">Zangersheide</option>
            </select>
            <p>Breed: {breed}</p>

            <textarea
                value={description}
                onChange={handleAddDescription}
                placeholder="Give details about horse, including coat color, temperament, allergies, any special needs, and concerns."
            />
            <p>Description: {description}</p>

            <Button
                onClick={handleClick}
                label="Submit"
            />
        </div>
    );
}

export default HorseForm;