import UserGreeting from "./UserGreeting.jsx";

function Header(){

    return(
        <header className="header">
            <h1>Stable.AI Dashboard</h1>
            <UserGreeting isLoggedIn={true} name="Lauren"/>
        </header>
    );
}

export default Header;