import React, { useState } from "react";
import "./cust-form.css";
import FillAllFieldsAlert from "../../../alertMessage/FillAllFieldsAlert";
import { useNavigate } from "react-router-dom";
import {nanoid} from "nanoid";
import axios from "axios";

function CustForm(props) {

    const navigate = useNavigate();
    const role = props.role;
    //generate the unique id for the form
    const uniqueCustID = nanoid(8);
    //alert message 
    const alertMessage = "Mandatory to fill all fields";

    const [userForm, setUserForm] = useState({
        custId: uniqueCustID,
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        address: "",
        securityQuestion:"",
        securityAnswer:"",
        role: role,
    });

    const securityquestions = [
        'What was your childhood nickname?',
        'What is the name of your first pet?',
        'What was the make of your first car?',
        'In what city were you born?'
    ];

    const [isEmpty, setIsEmpty] = useState(false);

    //update the values of the userForm property
    function handleChange(event) {
        const { name, value } = event.target;
        setUserForm((prevUserForm) => ({
            ...prevUserForm,
            [name]: value,
        }));
        console.log(userForm);
    }

    //register the customer details
    async function handleSubmit(event) {
        event.preventDefault();
        //checks for the values of the userForm object property
        if (Object.values(userForm).some((values) => (values === ""))) {
            setIsEmpty(true);
            
            setTimeout(() => {
                setIsEmpty(false);
            }, 2000);
            return;
            
        }else{
            try {
                const response = await axios.post("http://localhost:3000/register", {
                    custId: userForm.custId, 
                    name: userForm.name,
                    email: userForm.email,
                    password: userForm.password,
                    confirmPassword: userForm.confirmPassword,
                    phoneNumber: userForm.phoneNumber,
                    address: userForm.address,
                    securityQuestion: userForm.securityQuestion,
                    securityAnswer : userForm.securityAnswer,    
                    role: userForm.role,
                });
                
                const backEndResponse = response.data;
                console.log(backEndResponse);
                
                if(backEndResponse.success){
                        navigate("/login");
                        console.log("registered");
                }else{
                    console.log("Registration failed");
                }
    
            } catch (error) {
                console.error("An error occurred", error); 
            }
        }

      
    }


    return (
        <div id="registration-cust-page">
            <h1>Registering</h1>
            <p>as a <span>{role}</span></p>
            <form id="user-form" onSubmit={handleSubmit}  >
                {isEmpty ? <FillAllFieldsAlert alertMessage = {alertMessage} /> : null}

                <div className="registration-page-fields">
                    <div>
                        <label htmlFor="custId">Customer Id</label><br />
                        <input id="custId" type="text" onChange={handleChange} name="custId" value={userForm.custId} readOnly />
                        <br />
                        <label htmlFor="user-name">Name</label><br />
                        <input id="user-name" type="name" onChange={handleChange} name="name" value={userForm.name} placeholder="enter your name" />
                        <br />
                        <label htmlFor="user-email">Email</label><br />
                        <input id="user-email" type="email" onChange={handleChange} name="email" value={userForm.email} placeholder="enter your email" />
                        <br />
                        <label htmlFor="user-password">Password</label><br />
                        <input id="user-password" type="password" onChange={handleChange} name="password" value={userForm.password} placeholder="enter your password" />
                        <br />
                        <label htmlFor="user-confirm-password">Confirm Password</label><br />
                        <input id="user-confirm-password" type="password" onChange={handleChange} name="confirmPassword" value={userForm.confirmPassword} placeholder="confirm password" />
                        <br />
                    </div>
                    <div>
                        <label htmlFor="user-phoneNumber">Phone Number</label><br />
                        <input id="user-phoneNumber" type="text" onChange={handleChange} name="phoneNumber" value={userForm.phoneNumber} placeholder="enter your phone number" />
                        <br />
                        <label htmlFor="user-address">Address</label><br />
                        <textarea id="user-address" onChange={handleChange} name="address" value={userForm.address} placeholder="enter your address" rows="3" cols="30"></textarea>
                        <br />
                        <label htmlFor="securityQuestion">Security Question</label><br />
                        <select  id="securityQuestion" name="securityQuestion" value={userForm.securityQuestion} onChange={handleChange} >Secuirty Questions
                            <option value="" disabled>Select a Question</option>
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
               
                <div id="register-btn" >
                        <button className="btn-cursor  btn" type="submit">submit</button>
                </div>

            </form>
        </div>
    )
}

export default CustForm;