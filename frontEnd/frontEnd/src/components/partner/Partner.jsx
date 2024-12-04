import React from "react";
import "./partner.css";
import partner_1 from "/assets/images/home-images/partner_1.jpg";
import partner_2 from "/assets/images/home-images/partner_2.png";
import partner_3 from "/assets/images/home-images/partner_3.jpg";
import partner_4 from "/assets/images/home-images/partner_4.png";
import partner_icon from  "/assets/images/home-images/partner.png";
// import partner_icon from  "/assets/images/home-images/partner_4.png";



    function Partner() {



        return (
            <div className="partner">
                <h2>
                    <img className="partner-icon" src={partner_icon} alt="" />
                        Our partners 
                    <img className="partner-icon" src={partner_icon} alt="" />
                </h2>
                <div className="partner-images">
                    <img src={partner_1} alt="" />
                    <img src={partner_2} alt="" />
                    <img src={partner_3} alt="" />
                    <img src={partner_4} alt="" />
                </div>

            </div>
        );
    }

export default Partner;