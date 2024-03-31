import {memo} from 'react';
import React from 'react'
import Header from './header';
import Footer from './footer';

const HomePage = ({children, ...props}) =>{
    const username = localStorage.getItem('username');
    console.log(username);
    return (
        <div {...props}>
            <Header/>
            {children}
            <Footer/>
        </div>
    )
}
export default (HomePage);