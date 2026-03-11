import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-project">
          Smart Campus Navigation — St. Philomena's College, Mysuru
        </p>
        <p className="footer-credit">
          Developed by <span className="developer-name">Sheikh Jaan</span> | BCA Final Year Project © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
