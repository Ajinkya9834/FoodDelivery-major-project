import "./text-image-slider.css";

import image1 from "/assets/images/home-images/hero-slider-5.jpg";
import image2 from "/assets/images/home-images/hero-slider-4.jpg";
import image3 from "/assets/images/home-images/hero-slider-6.jpg";
import CountDown from "../count-down/CountDown.jsx";



const discountOffer = "20%";
const rupees = "999";
const min = 16;
const initialTimeToCount = 3600;



export const slides = [
    {
        text:(
          <>
            Don't Miss Out! <br/> <span id="swipe-style">Swipe</span> for more Offers <span id="swipe-arrow">------> </span>
          </>
        ),
        image: image3,
    },
    {
        text: (
          <> 
            Limited Time Offer: <br/> 
            <span id="discount-offer"> {discountOffer}  OFF </span> on All Orders! <br/> 
            Free Delivery on Rs {rupees}+ Orders. <br/> 
            Ends in <span id="countdown-style">
              <CountDown initialSeconds={initialTimeToCount} />
            </span>
          
          </>
        ),
        image: image1,
      },
    
    {
        text:(
          <>
             Hungry? <br/> <span id="minutes-style">{min}</span>-Minutes Delivery Right to Your Door!,      
          </>
        ),
        image: image2,
    },
    
    
]