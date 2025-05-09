import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar bg-gradient-to-r from-slate-900 to-slate-700">
      <div className="navbar-container">
        <Link href="/" className="navbar-brand">
          XFile Cat
        </Link>
        <div className="navbar-links">
          <Link href="#home" className="navbar-link">Home</Link>
          <Link href="#dashboard" className="navbar-link">Dashboard</Link>
          <Link href="#about" className="navbar-link">About</Link>
          <Link href="#contact" className="navbar-link">Contact</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;