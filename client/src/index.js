import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import HomePage from "./pages/homepage"
import Register from './pages/register';
import Login from './pages/login';
import Profile from './pages/homepage/body/profile';
import Home from './pages/homepage/body/home';
import History from './pages/homepage/body/history';
import Menu from './pages/menu';

export default function App() {

  const isAuthenticated = () => {
    const username = localStorage.getItem('username');
    return username !== null;
  }
  
  return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isAuthenticated()? <HomePage><Home/></HomePage>:<Login/>} />
          <Route path='home' element={<HomePage><Home /></HomePage>} />
          <Route path='login' element={<Login/>} />
          <Route path='register' element={<Register />} />
          <Route path='profile' element={isAuthenticated()?<HomePage><Profile /></HomePage>:<Navigate to="/login" />} />
          <Route path='history' element={isAuthenticated()?<HomePage><History /></HomePage>:<Navigate to="/login" />} />
          <Route path='menu' element={isAuthenticated()?<Menu />:<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
