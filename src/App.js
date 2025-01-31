import React from 'react';
import Hero from './components/Hero.js';
import About from './components/About.js';
import Experience from './components/Experience.js';
import Skills from './components/Skills.js';
import Projects from './components/Projects.js';
import Navbar from "./components/NavBar.js";

function App() {
    return (
        <div className="App">
            <Navbar />
            <main>
                <Hero />
                <About />
                <Experience />
                <Skills />
                <Projects />
            </main>
        </div>
    );
}

export default App;