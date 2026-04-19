
import { Link } from "react-router-dom";


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

                <Link to="/" className="logo logoLink" aria-label="Go to horse dashboard">
                    <span className="logoIcon">
                        <img src="/stableai-icon.png" alt="Stable.AI" />
                    </span>
                    Stable.<span>AI</span>
                </Link>
            </div>
        </header>
    );
}

export default Header;
