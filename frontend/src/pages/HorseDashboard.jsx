import GroupedCardList from "../components/GroupedCardList/GroupedCardList.jsx";

// images
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

function HorseDashboard() {

const horses = [

{
 id:1,
 image: spirit,
 imageAlt:"Spirit",
 name:"Spirit",
 barn:"Stallion Paddock",
 stall:"",
 sex:"Stallion",
 breed:"Mustang"
},

{
 id:2,
 image: rain,
 imageAlt:"Rain",
 name:"Rain",
 barn:"Mare's Meadow",
 stall:"",
 sex:"Mare",
 breed:"American Paint Horse"
},

{
 id:3,
 image: rooster,
 imageAlt:"Rooster",
 name:"Rooster",
 barn:"Gelding Field",
 stall:"",
 sex:"Gelding",
 breed:"Appaloosa"
},

{
 id:4,
 image:sweetPotato,
 imageAlt:"Sweet Potato",
 name:"Sweet Potato",
 barn:"Main Barn",
 stall:"01",
 sex:"Gelding",
 breed:"American Warmblood"
},

{
 id:5,
 image:taterTot,
 imageAlt:"Tater Tot",
 name:"Tater Tot",
 barn:"Pony Paddock",
 stall:"",
 sex:"Gelding",
 breed:"Shetland Pony"
},

{
 id:6,
 image:clyde,
 imageAlt:"Clyde",
 name:"Clyde",
 barn:"Main Barn",
 stall:"10",
 sex:"Gelding",
 breed:"Quarter Horse"
},

{
 id:7,
 image:alladin,
 imageAlt:"Alladin",
 name:"Alladin",
 barn:"Small Barn",
 stall:"02",
 sex:"Stallion",
 breed:"Arabian"
},

{
 id:8,
 image:frank,
 imageAlt:"Frank",
 name:"Frank",
 barn:"Small Barn",
 stall:"03",
 sex:"Gelding",
 breed:"Quarter Horse"
},

{
 id:9,
 image:daisy,
 imageAlt:"Daisy",
 name:"Daisy",
 barn:"Pony Paddock",
 stall:"",
 sex:"Mare",
 breed:"Shetland Pony"
},

{
 id:10,
 image:gingerbread,
 imageAlt:"Gingerbread",
 name:"Gingerbread",
 barn:"Small Barn",
 stall:"05",
 sex:"Mare",
 breed:"American Paint Horse"
},

{
 id:11,
 image:dusty,
 imageAlt:"Dusty",
 name:"Dusty",
 barn:"Main Barn",
 stall:"08",
 sex:"Gelding",
 breed:"Unknown"
},

{
 id:12,
 image:lady,
 imageAlt:"Lady",
 name:"Lady",
 barn:"Mare's Meadow",
 stall:"",
 sex:"Mare",
 breed:"Cross-Breed"
}

];

const barnOrder = [
"Main Barn",
"Small Barn",
"Mare's Meadow",
"Gelding Field",
"Pony Paddock",
"Stallion Paddock"
];

return (

<GroupedCardList
 title="Horse Dashboard"
 categoryOrder={barnOrder}
 items={horses}

groupBy={(horse)=>horse.barn}

getKey={(horse)=>horse.id}

getImage={(horse)=>horse.image}

getImageAlt={(horse)=>horse.imageAlt}

getTitle={(horse)=>horse.name}

getDetails={(horse)=>[
 {label:"Sex", value:horse.sex},
 {label:"Breed", value:horse.breed},
 ...(horse.stall ? [{label:"Stall", value:horse.stall}] : [])
]}

getOnClick={(horse)=>
 ()=>console.log(`Open horse ${horse.name}`)
}

/>

);

}

export default HorseDashboard;