import styles from './Navbar.module.css';
import { useState } from "react";

const Navbar = ({ isOpen, closeNav }) => {
    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <aside className={`${styles.sidenav} ${isOpen ? styles.open : ""}`}>
            <button
                className={styles.closeBtn}
                onClick={closeNav}
                aria-label="Close navigation"
            >
                <span className="material-symbols-rounded">close</span>
            </button>

            <ul className={styles.navList}>
                <li>
                    <div className={styles.sectionHeader}>
                        <a href="/">Horses</a>
                        <button
                            type="button"
                            className={styles.arrowBtn}
                            onClick={() => toggleSection("stable")}
                            aria-label="Toggle HorseDashboard submenu"
                        >
                            <span className="material-symbols-rounded">
                                {openSection === "stable" ? "expand_less" : "expand_more"}
                            </span>
                        </button>
                    </div>

                    {openSection === "stable" && (
                        <ul className={styles.subList}>
                            <li><a href="/add-horse">+ Horse</a></li>
                        </ul>
                    )}
                </li>

                <li>
                    <div className={styles.sectionHeader}>
                        <a href="/inventory">Inventory</a>
                        <button
                            type="button"
                            className={styles.arrowBtn}
                            onClick={() => toggleSection("inventory")}
                            aria-label="Toggle Inventory submenu"
                        >
                            <span className="material-symbols-rounded">
                                {openSection === "inventory" ? "expand_less" : "expand_more"}
                            </span>
                        </button>
                    </div>

                    {openSection === "inventory" && (
                        <ul className={styles.subList}>
                            <li><a href="/add-item">+ Item</a></li>
                        </ul>
                    )}
                </li>

                <li>
                    <div className={styles.sectionHeader}>
                        <a href="/documents">Documents</a>
                        <button
                            type="button"
                            className={styles.arrowBtn}
                            onClick={() => toggleSection("documents")}
                            aria-label="Toggle Documents submenu"
                        >
                            <span className="material-symbols-rounded">
                                {openSection === "documents" ? "expand_less" : "expand_more"}
                            </span>
                        </button>
                    </div>

                    {openSection === "documents" && (
                        <ul className={styles.subList}>
                            <li><a href="/add-document">+ Document</a></li>
                        </ul>
                    )}
                </li>
            </ul>
        </aside>
    );
};

export default Navbar;