import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage"
import Register from './pages/register';
import Login from './pages/login';
import Profile from './pages/homepage/body/profile';
import Home from './pages/homepage/body/home';
import History from './pages/homepage/body/history';
import Menu from './pages/menu';

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage><Home/></HomePage>} />
        <Route path='register' element = {<Register/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='profile' element={<HomePage><Profile/></HomePage>}/>
        <Route path='history' element={<HomePage><History/></HomePage>}/>
        <Route path='menu' element={<Menu/>}/>
      </Routes>
    </BrowserRouter>
  );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
