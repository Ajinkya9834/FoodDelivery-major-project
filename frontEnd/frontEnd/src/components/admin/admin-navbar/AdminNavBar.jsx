import React, { useEffect, useState } from "react";
import "./admin-navbar.css";
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InfoAlert from "../../alertMessage/InfoAlert";

function AdminNavBar(props) {
    const { isAdminLoggedIn, setIsAdminLoggedIn } = props;

    const adminId = localStorage.getItem("adminId");

    //holds admin profile name
    const [adminProfileName, setAdminProfileName] = useState("");
    //alert message for session or logged out
    const alertMessageIsAdminLoggedIn = "Your session has expired or you have logged out. Please log in again to continue."
    const navigate = useNavigate();

    //handle admin logout 
    function handleAdminLogoutClick() {
        setIsAdminLoggedIn(false);
        navigate("/logout", { state: { adminRole: "admin" } });
    }

    useEffect(() => {
        async function getAdminProfileName(adminId) {
            try {
                const response = await axios.get(`http://localhost:3000/get-admin-profile-name?adminId=${adminId}`);
                const backEndResponse = response.data;

                if (backEndResponse.success) {
                    setAdminProfileName(backEndResponse.adminProfileName);
                } else {
                    console.log("No admin is registered for the given admin id.");
                }
            } catch (error) {
                console.error("An errro occured in fetching admin name", error);
            }
        }
        getAdminProfileName(adminId);
    }, [adminId])


    return (
        <>
            <nav className="admin-navbar">
                <div className="admin-navbar-logo">
                    <p className="logo">Food Delivery
                        <DeliveryDiningOutlinedIcon />
                    </p>
                    <p>Admin panel</p>
                </div>

                <div className="admin-profile" >
                    {isAdminLoggedIn ? (
                        <>
                            <div className="admin-navbar-logout btn-cursor"
                                onClick={handleAdminLogoutClick}  >
                                <LogoutIcon
                                    sx={{ width: 32, height: 32, marginBottom: 1 }}
                                />
                                <p>Logout</p>
                            </div>
                            <p id="admin-profile-name" >{adminProfileName}</p>
                        </>
                    ) : 
                    ( <InfoAlert alertMessage={alertMessageIsAdminLoggedIn} /> )
                    }

                </div>
            </nav>
            <hr />
        </>

    )
}


export default AdminNavBar;