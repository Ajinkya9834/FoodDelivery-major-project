import React from "react";
import "./login-form.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FillAllFieldsAlert from "../alertMessage/FillAllFieldsAlert.jsx";
import NotRegiteredAlert from "../alertMessage/InfoAlert.jsx";

function LoginForm(props){
    const {setIsLoggedIn, setIsAdminLoggedIn} = props;

    //console.log(props.role);admin or customer
    const role = props.role;
    const [userLogin, setUserLogin] = useState({
        email:"",
        password:"",
        role: role,     
    });


    // check if all fields are filled
    const [isEmpty, setIsEmpty] = useState(false);
    // const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    // send info alert not registered
    const [isNotUserRegistered, setIsNotUserRegistered] = useState(false);
    const navigate = useNavigate();
    //alert message
    const alertMessageFillAllFields = "Mandatory to fill all fields.";
    const alertMessageUserNotFound = "Invalid email or password";


    async function handleSubmit(event){
        event.preventDefault();
        //check fields empty
        if (userLogin.email === "" || userLogin.password === "") {
            setIsEmpty(true);   
            setTimeout(()=>{
                setIsEmpty(false);
                return;      
            },2000);
            return;

        }else{
            setIsEmpty(false);

        }

        try {
            //post form data to backend
            const response = await axios.post("http://localhost:3000/login",{
                email: userLogin.email,
                password: userLogin.password,
                role: userLogin.role,
            });

            const backEndResponse = response.data;
            console.log(backEndResponse);
            
            // check for response success 
            if(backEndResponse.success){
                
                let userId = null;
                
                // check who logs in and gets id of it and set login state
                if (backEndResponse.adminId) {
                    console.log("adminid");
                    setIsAdminLoggedIn(true);
                    userId = backEndResponse.adminId;
                    console.log("admin" + userId);
                    localStorage.setItem("adminId", userId);
                } else if(backEndResponse.custId) {
                    console.log("custid");
                    setIsLoggedIn(true);
                    userId = backEndResponse.custId;
                    // console.log(userId);
                    localStorage.setItem("custId", userId);
                    const getItem = localStorage.getItem("custId", userId);
                    console.log(getItem); 
                }
                
                // if id available navigate to respected url
                if (userId) {
                    if(role === "customer"){
                        navigate("/");
                    }
                    if (role === "admin") {
                        navigate("/admin-dashboard");
                    }
                }else {
                    console.log("User ID not found");
                }
            }else{
                console.log("user not found");  
                setIsNotUserRegistered(true);
                setTimeout(()=>{setIsNotUserRegistered(false)},2000);
            }
        } catch (error) {
            console.error("An error occurred", error);  
            if (error.response) {
                console.error("BackError response", error.response.data);
                setIsNotUserRegistered(true);
                setTimeout(()=>{setIsNotUserRegistered(false)},2000);
            }
        }
        // console.log(userLogin);
    }

    function handleChange(event){
        const {name, value} = event.target;
        setUserLogin((prevUserLogin)=>({
            ...prevUserLogin,
            [name]: value,
        }));
        console.log(userLogin);
    }    

    function RegisteredClicked() {
        navigate("/register", { state: { role } }); // Passing role as state   
    }

    return(
        <div>
            <div className="login-form-alert-message">
                {isEmpty && <FillAllFieldsAlert alertMessage = {alertMessageFillAllFields}/> }
                  
                {isNotUserRegistered && <NotRegiteredAlert alertMessage={alertMessageUserNotFound} />} 
            </div>
           
        <form id="login-form"onSubmit={handleSubmit}  >
             
            <div>
               <label htmlFor="email">Email</label>
               <input id="email" type="text" onChange={handleChange} name="email" value={userLogin.email} placeholder="enter your email"  />
            </div>
            <div>
               <label htmlFor="password">Password</label>
               <input id="password"  type="text" onChange={handleChange} name="password" value={userLogin.password} placeholder="enter your password"  />
            </div>
            <div>
               <button className="btn-cursor btn" id="login-btn" type="submit">submit</button>
            </div>
            <div className="btn-cursor" id="register-btn">Have you Registered? <p onClick={RegisteredClicked}>Register</p></div>
         </form>
         </div>
         
    )
}

export default LoginForm;