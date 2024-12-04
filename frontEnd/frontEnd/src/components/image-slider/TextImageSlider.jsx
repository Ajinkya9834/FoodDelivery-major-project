

import {slides} from "./text-Image-Slider.jsx";
import Slider from "react-slick";

import "./text-image-slider.css"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function TextImageSlider(){

  
  let settings = {
    dots: true,
    infinite: true,
    autoplay: true,         
    autoplaySpeed: 2500, 
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };


  return(
    <>
    <div className="slider-container" >
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={index} className="slider-item">
            <h1 id="slider-text">
            {slide.text} 
              </h1>
            <img id="slider-image" src={slide.image} alt="slider-image" />
          </div>
        ))}      
      </Slider>
    </div>
    
    </>
  );
}

export default TextImageSlider;