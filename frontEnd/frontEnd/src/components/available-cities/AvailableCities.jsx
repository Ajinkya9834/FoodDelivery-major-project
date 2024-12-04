import React from "react";
import "./available-cities.css";
import location from "/assets/images/home-images/location-pin.png";



function AvailableCities() {

    return (
        <div className="city-location" >
            <h2><img className="location-icon" src={location} alt="" />
                    We are available in cities
                <img className="location-icon" src={location} alt="" />
            </h2>

            <div className="cities">
                <div id="col-1" className="cities-col" >
                    <p>Mumbai</p>
                    <p>Delhi</p>
                    <p>Bangalore</p>
                </div>
                <div id="col-2" className="cities-col">
                    <p>Hyderabad</p>
                    <p>Chennai</p>
                    <p>Kolkata</p>
                </div>

                <div id="col-3" className="cities-col">
                    <p>Ahmedabad</p>
                    <p>Pune</p>
                    <p>Jaipur</p>
                </div>
                <div id="col-4" className="cities-col">
                    <p>Lucknow</p>
                    <p>Surat</p>
                    <p>Bhopal</p>
                </div>
            </div>
        </div>
    );


}

export default AvailableCities;