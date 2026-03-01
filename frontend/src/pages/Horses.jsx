import Card from "../component/Card/Card.jsx";

// Import mock images
import rain from "../assets/Rain.jpeg"
import rooster from "../assets/Rooster.jpeg"
import sweetPotato from "../assets/Sweet_Potato.jpeg"
import taterTot from "../assets/Tater_Tot.jpeg"
import clyde from "../assets/Clyde.jpeg"
import alladin from "../assets/Alladin.jpeg"
import frank from "../assets/Frank.jpeg"
import daisy from "../assets/Daisy.jpg"
import gingerbread from "../assets/Gingerbread.jpeg"
import dusty from "../assets/Dusty.jpeg"
import lady from "../assets/Lady.jpeg"
import spirit from "../assets/Spirit.jpg"

function Horses() {
    return (
        <div className="cardContainer">
            <Card image={spirit} name="Spirit" status="Normal" location="Pasture A" nextTask="Feed PM"/>
            <Card image={rain} name="Rain" status="Injury" location="Pasture A" nextTask="Replace Bandage"/>
            <Card image={rooster} name="Rooster" status="Meds Due" location="Pasture B" nextTask="Give Medication 6:00PM"/>
            <Card image={sweetPotato} name="Sweet Potato" status="Normal" location="Stall 01" nextTask="Feed PM"/>
            <Card image={taterTot} name="Tater Tot" status="Normal" location="pasture C" nextTask="Feed PM"/>
            <Card image={clyde} name="Clyde" status="Quarantine" location="Stall 10" nextTask={"Observation"}/>
            <Card image={alladin} name="Alladin" status="Normal" location="Stall 02" nextTask="Feed PM"/>
            <Card image={frank} name="Frank" status="Meds Due" location="stall 03" nextTask="Give Medication 6:00PM"/>
            <Card image={daisy} name="Daisy" status="Normal" location="Pasture C" nextTask="Feed PM"/>
            <Card image={gingerbread} name="Gingerbread" status="Normal" location="Stall 05" nextTask="Feed PM"/>
            <Card image={dusty} name="Dusty" status="Injury" location="Stall 08" nextTask="Stretch Legs"/>
            <Card image={lady} name="Lady" status="Normal" location="Pasture B" nextTask="Feed PM"/>
        </div>
    );
}

export default Horses;