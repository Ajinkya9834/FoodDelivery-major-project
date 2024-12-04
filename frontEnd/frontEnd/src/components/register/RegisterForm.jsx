import React from "react";
import "./register.css";
import AdminForm from "./forms/adminForm/AdminForm";
import CustForm from "./forms/userForm/CustForm";


function RegisterForm(props){

    const role = props.role;
    console.log(role);

    return(
       <div>
     
         {role === "customer"? <CustForm role= {role} />: null}
         {role === "admin"? <AdminForm role= {role} /> : null} 
       
       </div>
    )
}

export default RegisterForm;