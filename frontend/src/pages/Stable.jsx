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

function Stable() {

    const horses = [
        {
            id: 1,
            image: spirit,
            title: "Spirit",
            imageAlt: "Spirit the horse",
            details: [
                { label: "Sex", value: "Stallion" },
                { label: "Breed", value: "Mustang" },
                { label: "Location", value: "Stallion Paddock" }
            ]
        },
        {
            id: 2,
            image: rain,
            title: "Rain",
            imageAlt: "Rain the horse",
            details: [
                { label: "Sex", value: "Mare" },
                { label: "Breed", value: "American Paint Horse" },
                { label: "Location", value: "Mare's Meadow" }
            ]
        },
        {
            id: 3,
            image: rooster,
            title: "Rooster",
            imageAlt: "Rooster the horse",
            details: [
                { label: "Sex", value: "Gelding" },
                { label: "Breed", value: "Appaloosa" },
                { label: "Location", value: "Gelding's Field" }
            ]
        },
        {
            id: 4,
            image: sweetPotato,
            title: "Sweet Potato",
            imageAlt: "Sweet Potato the horse",
            details: [
                { label: "Sex", value: "Gelding" },
                { label: "Breed", value: "American Warmblood" },
                { label: "Location", value: "Main Barn - Stall 01" },
            ]
        },
        {
            id: 5,
            image: taterTot,
            title: "Tater Tot",
            imageAlt: "Tater Tot the horse",
            details: [
                { label: "Sex", value: "Gelding" },
                { label: "Breed", value: "Shetland Pony" },
                { label: "Location", value: "Pony Paddock" }
            ]
        },
        {
            id: 6,
            image: clyde,
            title: "Clyde",
            imageAlt: "Clyde the horse",
            details: [
                { label: "Sex", value: "Gelding" },
                { label: "Breed", value: "Quarter Horse" },
                { label: "Location", value: "Main Barn - Stall 10" },
            ]
        },
        {
            id: 7,
            image: alladin,
            title: "Alladin",
            imageAlt: "Alladin the horse",
            details: [
                { label: "Sex", value: "Stallion" },
                { label: "Breed", value: "Arabian" },
                { label: "Location", value: "Main Barn - Stall 02" },
            ]
        },
        {
            id: 8,
            image: frank,
            title: "Frank",
            imageAlt: "Frank the horse",
            details: [
                { label: "Sex", value: "Gelding" },
                { label: "Breed", value: "Quarter Horse" },
                { label: "Location", value: "Main Barn - Stall 03" },
            ]
        },
        {
            id: 9,
            image: daisy,
            title: "Daisy",
            imageAlt: "Daisy the horse",
            details: [
                { label: "Sex", value: "Mare" },
                { label: "Breed", value: "Shetland Pony" },
                { label: "Location", value: "Pony Paddock" },
            ]
        },
        {
            id: 10,
            image: gingerbread,
            title: "Gingerbread",
            imageAlt: "Gingerbread the horse",
            details: [
                { label: "Sex", value: "Mare" },
                { label: "Breed", value: "American Paint Horse" },
                { label: "Location", value: "Main Barn - Stall 05" },
            ]
        },
        {
            id: 11,
            image: dusty,
            title: "Dusty",
            imageAlt: "Dusty the horse",
            details: [
                { label: "Sex", value: "Gelding" },
                { label: "Breed", value: "Unknown" },
                { label: "Location", value: "Main Barn - Stall 08" },
            ]
        },
        {
            id: 12,
            image: lady,
            title: "Lady",
            imageAlt: "Lady the horse",
            details: [
                { label: "Sex", value: "Mare" },
                { label: "Breed", value: "Cross-Breed" },
                { label: "Location", value: "Mare's Meadow" },
            ]
        }
    ];

    return (
        <>
            <h2 className="mainTitle">Horses</h2>
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
        </>
    );
}

export default Stable;