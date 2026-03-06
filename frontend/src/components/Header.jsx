import UserGreeting from "./UserGreeting/UserGreeting.jsx";

function Header(props){

    return(
        <header className="header">
            <div className="headerLeft">
                <button
                    className='menuToggle'
                    onClick={props.toggleNav}
                    aria-label="Toggle navigation"
                >
                    <span className="material-symbols-rounded">menu</span>
                </button>

                <div className="logo">
                    <span className="logoIcon">
                        <img src="/stableai-icon.png" />
                    </span>
                    Stable.<span>AI</span>
                </div>
            </div>
            <UserGreeting isLoggedIn={true} name={props.user}/>
        </header>
    );
}

export default Header;