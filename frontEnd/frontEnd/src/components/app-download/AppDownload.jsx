import React from "react";
import "./app-download.css";
import playstore from "/assets/images/home-images/playstore.png";
import playstore_qr_code from "../../../public/assets/images/home-images/playstore-qr-code.png";
import applestore from "/assets/images/home-images/applestore.png";
import applestore_qr_code from "/assets/images/home-images/applestore-qr-code.png";

function AppDownload(){


    return(
        <div className="app-download">
            <h2>For better experience <span id="download" >download</span> the app now</h2>
            <div className="qr-logo">
                <div>
                    <img id="apple-logo" src={applestore} alt="" />
                    <img src={applestore_qr_code} alt="" />
                </div>
                <div>
                    <img id="playstore-logo" src={playstore} alt="app" />
                    <img id="qr-code" src={playstore_qr_code} alt="qr" />
                </div>
                
            </div>
        </div>
    );
}


export default AppDownload;