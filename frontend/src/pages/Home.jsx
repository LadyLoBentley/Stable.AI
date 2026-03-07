import Card from "../components/Card/Card.jsx";

// Import mock images
import rain from "../assets/Rain.jpeg";
import rooster from "../assets/Rooster.jpeg";
import sweetPotato from "../assets/Sweet_Potato.jpeg";
import taterTot from "../assets/Tater_Tot.jpeg";
import clyde from "../assets/Clyde.jpeg";
import alladin from "../assets/Alladin.jpeg";
import frank from "../assets/Frank.jpeg";
import daisy from "../assets/Daisy.jpg";
import gingerbread from "../assets/Gingerbread.jpeg";
import dusty from "../assets/Dusty.jpeg";
import lady from "../assets/Lady.jpeg";
import spirit from "../assets/Spirit.jpg";

function Home() {
    const horses = [
        {
            id: 1,
            image: spirit,
            title: "Spirit",
            imageAlt: "Spirit the horse",
            details: [
                { label: "Status", value: "Normal" },
                { label: "Location", value: "Pasture A" },
                { label: "Next Task", value: "Feed PM" }
            ]
        },
        {
            id: 2,
            image: rain,
            title: "Rain",
            imageAlt: "Rain the horse",
            details: [
                { label: "Status", value: "Injury" },
                { label: "Location", value: "Pasture A" },
                { label: "Next Task", value: "Replace Bandage" }
            ]
        },
        {
            id: 3,
            image: rooster,
            title: "Rooster",
            imageAlt: "Rooster the horse",
            details: [
                { label: "Status", value: "Meds Due" },
                { label: "Location", value: "Pasture B" },
                { label: "Next Task", value: "Give Medication 6:00 PM" }
            ]
        },
        {
            id: 4,
            image: sweetPotato,
            title: "Sweet Potato",
            imageAlt: "Sweet Potato the horse",
            details: [
                { label: "Status", value: "Normal" },
                { label: "Location", value: "Stall 01" },
                { label: "Next Task", value: "Feed PM" }
            ]
        },
        {
            id: 5,
            image: taterTot,
            title: "Tater Tot",
            imageAlt: "Tater Tot the horse",
            details: [
                { label: "Status", value: "Normal" },
                { label: "Location", value: "Pasture C" },
                { label: "Next Task", value: "Feed PM" }
            ]
        },
        {
            id: 6,
            image: clyde,
            title: "Clyde",
            imageAlt: "Clyde the horse",
            details: [
                { label: "Status", value: "Quarantine" },
                { label: "Location", value: "Stall 10" },
                { label: "Next Task", value: "Observation" }
            ]
        },
        {
            id: 7,
            image: alladin,
            title: "Alladin",
            imageAlt: "Alladin the horse",
            details: [
                { label: "Status", value: "Normal" },
                { label: "Location", value: "Stall 02" },
                { label: "Next Task", value: "Feed PM" }
            ]
        },
        {
            id: 8,
            image: frank,
            title: "Frank",
            imageAlt: "Frank the horse",
            details: [
                { label: "Status", value: "Meds Due" },
                { label: "Location", value: "Stall 03" },
                { label: "Next Task", value: "Give Medication 6:00 PM" }
            ]
        },
        {
            id: 9,
            image: daisy,
            title: "Daisy",
            imageAlt: "Daisy the horse",
            details: [
                { label: "Status", value: "Normal" },
                { label: "Location", value: "Pasture C" },
                { label: "Next Task", value: "Feed PM" }
            ]
        },
        {
            id: 10,
            image: gingerbread,
            title: "Gingerbread",
            imageAlt: "Gingerbread the horse",
            details: [
                { label: "Status", value: "Normal" },
                { label: "Location", value: "Stall 05" },
                { label: "Next Task", value: "Feed PM" }
            ]
        },
        {
            id: 11,
            image: dusty,
            title: "Dusty",
            imageAlt: "Dusty the horse",
            details: [
                { label: "Status", value: "Injury" },
                { label: "Location", value: "Stall 08" },
                { label: "Next Task", value: "Stretch Legs" }
            ]
        },
        {
            id: 12,
            image: lady,
            title: "Lady",
            imageAlt: "Lady the horse",
            details: [
                { label: "Status", value: "Normal" },
                { label: "Location", value: "Pasture B" },
                { label: "Next Task", value: "Feed PM" }
            ]
        }
    ];

    return (
        <div className="cardContainer">
            {horses.map((horse) => (
                <Card
                    key={horse.id}
                    image={horse.image}
                    imageAlt={horse.imageAlt}
                    title={horse.title}
                    details={horse.details}
                    onClick={() => console.log(`Open profile for ${horse.title}`)}
                />
            ))}
        </div>
    );
}

export default Home;