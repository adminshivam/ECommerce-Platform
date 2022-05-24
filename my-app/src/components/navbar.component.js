import React, { useContext, useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import './navbar.component.css';
import { useCookies } from "react-cookie";
import UserContext from '../services/ContextService';
// import of service for authentication.
const AuthService = require('../services/AuthService.js')

export default function Navbar() {
    var constants =  require('../constants/constants');
    const [userName ,setUserName ] = useContext(UserContext);
    const [cookies, , deleteCookie] = useCookies();
    const [authenticated, setAuthenticated] = useState(false);
    const [customer, setCustomer] = useState({});
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();

    function handleLogout(params) {
        deleteCookie("accessToken",{path:'/'});
        deleteCookie("role",{path: '/'});
        setAuthenticated(false);
        navigate('/');
        
    }

    useEffect(() => {
        const token = cookies.accessToken;
        if(token !== undefined) {
            if(cookies.role==='staff') {
                (AuthService.AuthTokenStaff(cookies.accessToken))
                    .then((res) => {
                        if(res!=="TokenFailed") {
                            setAuthenticated(true);
                            setCustomer(res[0])
                            // setUserName(res[0].customer_id)
                        }
                        else {
                            setAuthenticated(false);
                        }
                    })
                }
                else if(cookies.role==='student') {
                    (AuthService.AuthTokenStudent(cookies.accessToken))
                    .then((res) => {
                        if(res!=="TokenFailed") {
                            setAuthenticated(true);
                            setCustomer(res[0])
                            setUserName(res[0].customer_name)
                        }
                        else {
                            setAuthenticated(false);
                        }
                    })   
            }
        }
    },[cookies])

    useEffect(() => {
        if(searchKeyword != '') {
            navigate(`/search/${searchKeyword}`);
        }

    },[searchKeyword])

    const logout = async() => {
        deleteCookie("accessToken",{path:'/'});
        setAuthenticated(false);
        navigate('/');
    }


    return (
        <nav className="navbar">
            <Link to="/" className="navbar-link float-left">
                <img style={{width: "5vw", margin: "0vw 2vw"}} src={constants.websiteImages+'/brand-logo.jpeg'}></img>
                {/* E-Commerece<div className="nav-app-head" >Portal</div>&nbsp;|&nbsp; */}
            </Link>
            <Link to="/" className="navbar-link justify-right">
                Home
            </Link>
            <a style={{animationDelay: "1s"}} className="navbar-link justify-right" href="/#homepage-product-grid">Categories</a>
            <Link to="/products/dashboard" className="navbar-link justify-right">
                Mobile Phones
            </Link>
            <a className="navbar-link justify-right" href={"/product/categories/tv#tv-main"} >
                Television
            </a>
            <Link to="/products/dashboard" className="navbar-link justify-right">
                Earphones
            </Link>
            <Link to="/student/dashboard" className="navbar-link justify-right">
                About
            </Link>
            <input onChange={(e) => setSearchKeyword(e.target.value)} className="searchBar" type={"text"} placeholder="search"></input>
            <div className="nav-account">
                {authenticated ? (
                    <>
                        {/* <button style={{border:"none",fontSize: "2vw",backgroundColor: "#f34653", color: "white", borderRadius: "5px"}} onClick={handleLogout} className="navbar-link ">
                            <u>Hello, {name}</u>
                        </button> */}
                            {/* <option hidden style={{backgroundColor:"whitesmoke",color:"black"}}>Hello, {name}</option>
                            <option style={{backgroundColor:"whitesmoke",color:"black"}}>
                                <Link to='/'></Link>
                            </option>
                            <option style={{backgroundColor:"whitesmoke",color:"black"}}>View Cart</option>
                            <option style={{backgroundColor:"whitesmoke",color:"black"}}>Logout</option>
                        </select> */}
                        <select onChange={(e) => { (e.target.value=='/logout') ? logout() : navigate(e.target.value) }} className="navbar-account-select" style={{border:"none",fontSize: "1.5vw",backgroundColor: "#f34653", color: "white", borderRadius: "5px", padding:"1vw",textAlign:"center"}}>
                            <option hidden value="/">Hello, {customer.customer_name}</option>
                            <option value={`/customer/viewCart/${customer.customer_id}`}>Your Cart</option>
                            <option value={`/customer/viewOrders/${customer.customer_id}`}>Your Orders</option>
                            <option value="/account">Your Account</option>
                            <option value="/logout">Logout</option>
                        </select>
                    </>
                ) : (
                    <Link style={{fontSize: "2vw", padding: "0vw 2vw",backgroundColor: "#f34653", color: "white", borderRadius: "5px", paddingBlock: "0.5vw"}} to="login/" className="navbar-link float-right">
                        Login
                    </Link>
                )}
            </div>

        </nav>
    );
}