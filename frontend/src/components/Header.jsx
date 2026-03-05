import UserGreeting from "./UserGreeting/UserGreeting.jsx";

function Header(props){

    return(
        <header className="header">
            <h1>Stable.AI</h1>
            <UserGreeting isLoggedIn={true} name={props.user}/>
        </header>
    );
}

export default Header;