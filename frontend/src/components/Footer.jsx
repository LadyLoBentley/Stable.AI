
function Footer() {
    return(
        <footer className="footer">
             <div className="footer-logo">
                <p>
                    &copy; {new Date().getFullYear()} <span className="footerLogoIcon">
                         <img src="/stableai-icon.png" />
                    </span> Stable.AI
                </p>
            </div>
        </footer>
    );
}

export default Footer;