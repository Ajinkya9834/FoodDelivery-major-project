import React, { useState } from "react";
import "./admin-form.css";
import FillAllFieldsAlert from "../../../alertMessage/FillAllFieldsAlert";
import { useNavigate } from "react-router-dom";
import {nanoid} from "nanoid";
import axios from 'axios';


function AdminForm(props) {

    const navigate = useNavigate();
    const role = props.role;
    const uniqueAdminID = nanoid(8);
    console.log(uniqueAdminID);
    
    const alertMessage = "Mandatory to fill all fields";

    const [userForm, setUserForm] = useState({
        adminId: uniqueAdminID,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        address: "",
        securityQuestion: "",
        securityAnswer: "",
        restaurantName:"",
        restaurantAddress:"",
        restaurantContactNumber:"",
        role:role
    });

    const securityquestions = [
        'What was your childhood nickname?',
        'What is the name of your first pet?',
        'What was the make of your first car?',
        'In what city were you born?'
    ];

    const [isEmpty, setIsEmpty] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        setUserForm((prevUserForm) => ({
            ...prevUserForm,
            [name]: value,
        }));
        console.log(userForm);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (Object.values(userForm).some((values) => (values === ""))) {
            // set for send alert message on screen
            setIsEmpty(true);
            
            setTimeout(()=>{
                setIsEmpty(false);
                return;      
            },2000);
            return;
        }

        try {
            const response = await axios.post("http://localhost:3000/register", {
                adminId: userForm.adminId,
                name: userForm.name,
                email: userForm.email,
                password: userForm.password,
                confirmPassword: userForm.confirmPassword,
                phoneNumber: userForm.phoneNumber,
                address: userForm.address,
                securityQuestion: userForm.securityQuestion,
                securityAnswer : userForm.securityAnswer,
                restaurantName: userForm.restaurantName,
                restaurantAddress: userForm.restaurantAddress,
                restaurantContactNumber: userForm.restaurantContactNumber, 
                role: userForm.role,
            })

            const backEndResponse = response.data;

            if(backEndResponse.success){            
                    navigate("/login");
                    console.log("registered");    
        
            }else{
                console.log("not registered");
            }
        } catch (error) {
            console.error("An error occurred", error); 
        }
    }


    return (
        <div  id="registration-admin-page">
            <h1>Registering</h1>
            <p>as a <span>{role}</span></p>
            <form id="user-form" onSubmit={handleSubmit}  >
                {isEmpty ? <FillAllFieldsAlert alertMessage = {alertMessage} /> : null}

                <div  className="registration-admin-fields">
                    <div>
                        <label htmlFor="adminId">Admin Id</label><br />
                        <input id="adminId" type="text" onChange={handleChange} name="adminId" value={userForm.adminId} readOnly />
                        <br />
                        <label htmlFor="user-name">Name</label><br />
                        <input id="user-name" type="name" onChange={handleChange} name="name" value={userForm.name} placeholder="enter your name" />
                        <br />
                        <label htmlFor="user-email">Email</label><br />
                        <input id="user-email" type="email" onChange={handleChange} name="email" value={userForm.email} placeholder="enter your email" />
                        <br />
                    </div>
                    <div>
                        <label htmlFor="user-password">Password</label><br />
                        <input id="user-password" type="password" onChange={handleChange} name="password" value={userForm.password} placeholder="enter your password" />
                        <br />
                        <label htmlFor="user-confirm-password">Confirm Password</label><br />
                        <input id="user-confirm-password" type="password" onChange={handleChange} name="confirmPassword" value={userForm.confirmPassword} placeholder="confirm password" />
                        <br />
                        <label htmlFor="user-phoneNumber">Phone Number</label><br />
                        <input id="user-phoneNumber" type="text" onChange={handleChange} name="phoneNumber" value={userForm.phoneNumber} placeholder="enter your email" />
                        <br />
                    </div>
                    <div>
                        <label htmlFor="user-address">Address</label><br />
                        <textarea id="user-address" onChange={handleChange} name="address" value={userForm.address} placeholder="enter your address" rows="3" cols="30" ></textarea>
                        <br />
                       
                        <label htmlFor="securityQuestion">Security Question</label><br />
                        <select id="securityQuestion" name="securityQuestion" onChange={handleChange} value={userForm.securityQuestion} >
                            <option value="" disabled>Select a question</option>
                            {securityquestions.map((question, index) => (
                                <option key={index} value={question}>{question}</option>    
                            ))}
                        </select>
                        <br />
                       
                        <label htmlFor="securityAnswer">Security Answer</label><br />
                        <input id="securityAnswer" type="text" onChange={handleChange} name="securityAnswer" value={userForm.securityAnswer} placeholder="answer above Question" />
                        <br />
                    </div>
                </div>
                <p id="restarunt-info-title"><span>---------------</span>-------- Restaurant info --------<span>---------------</span></p>

                <div id="restarunt-details">
                    <label htmlFor="restaurantName">Name</label><br />
                    <input type="text" name="restaurantName" id="restaurantName" onChange={handleChange} value={userForm.restaurantName} placeholder="enter restaurant name" />
                    <br />
                    <label htmlFor="restaurantAddress">Address</label><br />
                    <input type="text" name="restaurantAddress" id="restaurantAddress" onChange={handleChange} value={userForm.restaurantAddress} placeholder="enter restaurant address" />
                    <br />
                    <label htmlFor="restaurantContactNumber">Contact number</label><br />
                    <input type="text" name="restaurantContactNumber" id="restaurantContactNumber" onChange={handleChange} value={userForm.restaurantContactNumber} placeholder="enter restaurant contact" />
                </div>
                <div id="register-btn" >
                        <button className="btn-cursor  btn" type="submit">submit</button>
                </div>

            </form>
        </div>
    )
}

export default AdminForm;