import React, { useState } from "react";
import "./login.css";
import LoginForm from "../../components/login-form/LoginForm.jsx"


function Login(props){
   const {setIsLoggedIn, setIsAdminLoggedIn} = props;

   //set state: which category(customer or admin) is clicked by the user to login or register
   const [clicked, setClicked] = useState(false);
   // set state: role of the user(customer or admin)
   const [role, setRole] = useState("");

   
   function userAsA(role){
      setClicked(true);
      setRole(role);
      console.log(role);
      
   }


   return(
      <div className="login-page">
         <h1>Login</h1>
         <p>as a</p>
         <ul className="btn-cursor login-page-btn">
            <li onClick={()=>userAsA("customer")} >Customer</li>
            <li onClick={()=>userAsA("admin")} >Admin</li>
         </ul>
         {clicked ? 
            <LoginForm 
               role= {role} 
               setIsLoggedIn={setIsLoggedIn} 
               setIsAdminLoggedIn={setIsAdminLoggedIn}  
            /> : null}
         
      </div>
   )
}

export default Login;