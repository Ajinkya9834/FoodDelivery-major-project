import React, { useEffect, useState } from "react";
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import { useNavigate } from "react-router-dom";
import { Link } from "react-scroll";
import addShoppingCartIcon from "../../../public/assets/images/home-images/shopping-cart.png";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import "./navbar.css";
import axios from "axios";


function Navbar(props) {
    const { isLoggedIn, setIsLoggedIn, } = props;

    const custId = localStorage.getItem("custId");
    //holds profile name
    const [profileName, setProfileName] =  useState("");
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    //csutome style
    function customStyle(item) {
        return {
            textDecoration: selectedItem === item ? "underline" : "none",
            textDecorationColor: selectedItem === item ? "rgb(195, 123, 137)" : "transparent",
            textUnderlineOffset: "5px",
            transition: "text-Decoration-Color 0.3s ease, text-Underline-Offset 0.3s ease",
        };
    }

    // handle logout
    function handleLogoutClick() {
        setIsLoggedIn(false); // update the login status
        navigate("/logout", { state: { custRole: "customer" } }); // navigate to the Logout route
        console.log("logout (navbar)");
    }

    //scroll to the particular section on the page
    function handleClick(item) {
        setSelectedItem(item);

        if (item === "Home") {
            navigate("/");
            setTimeout(() => {
                document.getElementById("home-page-text-image-slider").scrollIntoView({ behavior: "smooth" });
            }, 300);
        }
        if (item === "Menu") {
            navigate("/");
            setTimeout(() => {
                document.getElementById("home-page-explore-menu").scrollIntoView({ behavior: "smooth", });
            }, 300);
        }
    }

    //navigates to the login page 
    function handleNavigateToLoginPage() {
        navigate("/login");
    }

    //navigates to the add-cart page
    function cartClick() {
        navigate("/add-cart");
    }

    function handleOrderHistoryClick() {
        navigate("/order-history");
    }

    //fetch  the profile name of the looged in customer by giving the custId 
    useEffect(()=>{
        async function getProfileName(custId){
            try {
                const response = await axios.get(`http://localhost:3000/get-profile-name?custId=${custId}`);
                const backEndResponse = response.data;

                if (backEndResponse.success) {
                    console.log("backEndResponse.profileName", backEndResponse.profileName);
                    
                    setProfileName(backEndResponse.profileName);
                }else{
                    console.log("No profile name avalilable.");
                }
            } catch (error) {
                console.error("An error occured in the fetching customer name", error);
            }
        }
        getProfileName(custId);
    },[custId]);


    return (
        <>
            <nav className="navbar">
                <p className="logo">Food Delivery
                    <DeliveryDiningOutlinedIcon />
                </p>
                <ul className="navbar-btn btn-cursor">
                    <Link className="navbar-btn-link" to="home-page-text-image-slider"
                        smooth={true} duration={500} onClick={() => handleClick("Home")}
                        style={customStyle("Home")}
                    >
                        Home</Link>
                    <Link className="navbar-btn-link" to="home-page-explore-menu"
                        smooth={true} duration={500} onClick={() => handleClick("Menu")}
                        style={customStyle("Menu")}
                    >
                        Menu</Link>
                    <Link className="navbar-btn-link" to="home-page-footer"
                        smooth={true} duration={500} onClick={() => handleClick("Contact")}
                        style={customStyle("Contact")}
                    >
                        Contact us</Link>
                </ul>
                <div className="shopping-cart-login">
                    <img id="shopping-cart-icon" className="btn-cursor" src={addShoppingCartIcon} alt="" onClick={cartClick} />
                    
                    {isLoggedIn ? (
                        <p className=" profile-btn btn-cursor">

                            <Box>
                                <Tooltip title="Account settings">
                                    <IconButton
                                        onClick={handleProfileClick}
                                        size="small"
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <Avatar sx={{ backgroundColor: "rgb(187, 18, 52);", width: 32, height: 32 }}>
                                            <AccountCircleIcon />
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                slotProps={{
                                    paper: {
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&::before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem 
                                sx={{
                                    "&:hover": { backgroundColor: "rgb(255, 234, 239)" },
                                    color: "black", opacity: 0.5,
                                }} 
                                >
                                    {profileName}
                                </MenuItem>

                                <MenuItem onClick={handleOrderHistoryClick} sx={{
                                    "&:hover": { backgroundColor: "rgb(255, 234, 239);" },
                                    color: "black",
                                }} >
                                    Order History
                                </MenuItem>

                                <MenuItem onClick={() => { handleClose(); handleLogoutClick(); }}
                                    sx={{
                                        "&:hover": { backgroundColor: "rgb(255, 234, 239)" },
                                        color: "black",
                                    }}
                                >
                                    <ListItemIcon  >
                                        <Logout fontSize="small" sx={{ color: "black" }} />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </p>
                    ) : (
                        <button onClick={handleNavigateToLoginPage} className="btn btn-cursor">Login</button>
                    )}
                </div>
            </nav>

        </>
    )
}

export default Navbar;
