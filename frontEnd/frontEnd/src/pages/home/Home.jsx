import React from "react";
import Navbar from "../../components/navbar/Navbar.jsx";
import TextImageSlider from "../../components/image-slider/TextImageSlider.jsx";
import ExploreMenu from "../../components/explore-Menu/ExploreMenu.jsx";
import Footer from "../../components/footer/Footer.jsx";
import "./home.css"
import Partner from "../../components/partner/Partner.jsx";
import AppDownload from "../../components/app-download/AppDownload.jsx";
import AvailableCities from "../../components/available-cities/AvailableCities.jsx";

function Home(props){
    const {isLoggedIn, setIsLoggedIn, } = props;
  
  
    return(
        <div id="home-page">
            
            <section id="home-page-navbar" >
                <Navbar 
                   
                    isLoggedIn={isLoggedIn} 
                    setIsLoggedIn={setIsLoggedIn}
                />
                </section>
            <section id="home-page-text-image-slider" ><TextImageSlider/></section>
            <section id="home-page-explore-menu" >
                <ExploreMenu 
                    isLoggedIn={isLoggedIn}
                    addToCart={props.addToCart} 
                    addIncrementDecrementIcon={props.addIncrementDecrementIcon}
                    itemInCart={props.itemInCart}
                    
                />
            </section>
            <section id="home-page-partner" ><Partner/></section>
            <section id="home-page-app-download"><AppDownload/></section>
            <section id="home-page-cites"><AvailableCities/></section>
            <section id="home-page-footer" ><Footer/></section>
        </div>
    )
}

export default Home;

