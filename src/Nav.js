import React from "react";
import { Link } from "react-router-dom";
import MLLogo from "./logo.svg";
import "./Custom.css";

function Nav() {
  return (
    <nav className="navbar nav-bg">
      <div className="container-fluid">
        <Link className="navbar-brand col-2" to="/" tabIndex="-1">
          <img
            src={MLLogo}
            alt="MLAutonomer"
            height="35"
            className="d-inline-block align-text-top"
          ></img>
        </Link>
        <ul className="nav row px-5 justify-content-end">
          <li className="nav-item col">
            <Link to="/about" tabIndex="-1" className="nav-link">
              About
            </Link>
          </li>
          <li className="nav-item col">
            <a
              tabIndex="-1"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.maixhub.com/mtrain.html"
              className="nav-link"
            >
              Links
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
