import UserGreeting from "./UserGreeting/UserGreeting.jsx";

function Header(props){

    return(
        <header className="header">
            <div class="logo">
            Stable.<span>AI</span>
            </div>
            <UserGreeting isLoggedIn={true} name={props.user}/>
        </header>
    );
}

export default Header;