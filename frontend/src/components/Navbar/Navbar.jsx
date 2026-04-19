import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

const browseLinks = [
    { to: "/", label: "Horse Dashboard" },
    { to: "/inventory", label: "Inventory" },
    { to: "/documents", label: "Documents" }
];

const createLinks = [
    { to: "/add-horse", label: "Add Horse" },
    { to: "/add-item", label: "Add Inventory Item" },
    { to: "/add-document", label: "Upload Document" }
];

function Navbar({ isOpen, closeNav }) {
    return (
        <aside className={`${styles.sidenav} ${isOpen ? styles.open : ""}`}>
            <button
                className={styles.closeBtn}
                onClick={closeNav}
                aria-label="Close navigation"
            >
                <span className="material-symbols-rounded">close</span>
            </button>

            <nav aria-label="Primary navigation" className={styles.navLayout}>
                <div className={styles.navBlock}>
                    <p className={styles.navTitle}>Browse</p>
                    <ul className={styles.navList}>
                        {browseLinks.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    onClick={closeNav}
                                    className={({ isActive }) =>
                                        `${styles.navLink} ${isActive ? styles.activeLink : ""}`
                                    }
                                    end={link.to === "/"}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.navBlock}>
                    <p className={styles.navTitle}>Create</p>
                    <ul className={styles.navList}>
                        {createLinks.map((link) => (
                            <li key={link.to}>
                                <NavLink
                                    to={link.to}
                                    onClick={closeNav}
                                    className={({ isActive }) =>
                                        `${styles.navLink} ${styles.navAction} ${isActive ? styles.activeLink : ""}`
                                    }
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </aside>
    );
}

export default Navbar;
