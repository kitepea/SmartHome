import {memo} from 'react'

const Header = () =>{
    const username = localStorage.getItem('username');
    return (
        <h1>Header: Welcome {username} !</h1>
    )
}
export default memo(Header);