import React from 'react';
import Header from './Header';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Layout = () => {
  return (
    <main className='border'>
      <Header/> 
      <div className="container min-h-[80vh]">
        <Outlet/>
      </div>
      <Footer/> 
    </main>
  );
}

export default Layout;
