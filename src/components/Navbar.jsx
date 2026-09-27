import { NavLink } from "react-router-dom";

const links = [
  ["Home", "/"],
  ["Upload Resume", "/upload"],
  ["Analysis Report", "/analysis"],
  ["Resume Tips", "/tips"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          Resume<span>Analyzer</span>
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {links.map(([label, to]) => (
              <li className="nav-item" key={to}>
                <NavLink end={to === "/"} className={({isActive}) => `nav-link${isActive ? " active" : ""}`} to={to}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
