import React from "react";
import "./footer.css";
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import BusinessIcon from '@mui/icons-material/Business';


function Footer(){
    return(
        <div>
            <footer className="footer">
                <p className="logo">Food Delivery
                   <DeliveryDiningOutlinedIcon/>
                </p>

                <ul className="btn-cursor footer-contact">
                    <li><EmailIcon/> fooddelivery@gmail.com</li>
                    <li><LocalPhoneIcon/> +91 999-888-2222</li>
                    <li><BusinessIcon/> 7th lane xyz road</li>
                </ul>
                <ul className="btn-cursor footer-contact">
                    <li><XIcon/> Twitter</li>
                    <li><YouTubeIcon/> YouTube</li>
                    <li><InstagramIcon/> Instagram</li>
                </ul>



            </footer>
        </div>
    )

}

export default Footer;