import styles from './Navbar.module.css';

const Navbar = ({ isOpen, closeNav }) => {
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
                <li><a href="/">Home</a></li>
                <li><a href="/add-horse">+ Horse</a></li>
                <li><a href="/inventory">Inventory</a></li>
                <li><a href="/add-item">+ Inventory Item</a></li>
                <li><a href="/account">Account</a></li>
            </ul>
        </aside>
    );
};

export default Navbar;