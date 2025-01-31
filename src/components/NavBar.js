import React, { useState } from 'react';
import { Link } from 'react-scroll';
import '../styles/NavBar.css'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="navbar">
            <div className="nav-logo">
                <a href="/">Josh Melgar</a>
            </div>

            {/* Hamburger Menu Button */}
            <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            {/* Navigation Links */}
            <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                <Link
                    to="home"
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={-70}
                    onClick={() => setIsOpen(false)}
                >
                    Home
                </Link>
                <Link
                    to="about"
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={-70}
                    onClick={() => setIsOpen(false)}
                >
                    About
                </Link>
                <Link
                    to="experience"
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={-70}
                    onClick={() => setIsOpen(false)}
                >
                    Experience
                </Link>
                <Link
                    to="skills"
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={-70}
                    onClick={() => setIsOpen(false)}
                >
                    Skills
                </Link>
                <Link
                    to="projects"
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={-70}
                    onClick={() => setIsOpen(false)}
                >
                    Projects
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;