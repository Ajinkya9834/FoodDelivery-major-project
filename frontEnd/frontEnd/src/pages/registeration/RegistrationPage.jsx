import React from "react";
import { useLocation } from "react-router-dom";
import RegisterForm from "../../components/register/RegisterForm";
import "./registration-page.css";


function RegistrationPage(){

    const location = useLocation();

    const {role} = location.state || {};


    return(
        <div className="register">
         <RegisterForm  role = {role}/>

        </div>
    )

}

export default RegistrationPage;