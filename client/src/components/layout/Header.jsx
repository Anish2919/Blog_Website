import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
        <a href="" className='logo'>MyBlog</a>
        <nav>
        <Link to='/login' href="">Login</Link>
        <Link to={'/register'} href="">Register</Link>
        </nav>
    </header>
  );
}

export default Header;
