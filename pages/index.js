import React from 'react';
import Posts from '../components/Posts';
import Footer from '../components/Footer';
import TopNavbar from '../components/Navbar';
import { WindowWidthProvider } from '../context/WindowWidthContext';

export default function HomePage() {
  return (
    <WindowWidthProvider>
       <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <TopNavbar />
      <div
        style={{
          margin: '60px 0px 20px',
        }}
      >
        <Posts />
      </div>
      <Footer />
    </div>

    </WindowWidthProvider>
   
  );
}
