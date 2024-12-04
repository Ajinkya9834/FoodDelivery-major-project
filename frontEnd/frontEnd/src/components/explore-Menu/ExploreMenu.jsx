import React, { useState } from "react";
import "./explore-menu.css";
import { menuList } from "./explore-menu.js";
import FoodList from "../food-list/FoodList.jsx";


function ExploreMenu(props){
    
const {isLoggedIn, addToCart, addIncrementDecrementIcon, itemInCart} =props;
    const [menuCategory, setMenuCategory] = useState("") ;
    console.log("menuCategory", menuCategory);
    

    function handlClick(menuName){       
        setMenuCategory(menuName);        
    }

    return(
        <div className="explore-menu">
            <h1>Explore Menu</h1>
            <div className="explore-menu-list scroll-bar-x ">
                {menuList.map((item, index) => (
                    <div key={index} onClick={() => handlClick(item.menuName)} className="explore-menu-list-item btn-cursor">
                        <img id="image"  src={item.menuImage} alt="menu-image" />
                        <label className="btn-cursor" htmlFor="image">{item.menuName}</label>
                     </div>
                ))}
            </div>
            <FoodList 
                isLoggedIn={isLoggedIn}
                menuCategory = {menuCategory} 
                addToCart={addToCart} 
                addIncrementDecrementIcon={addIncrementDecrementIcon}
                itemInCart={itemInCart}

            />
        </div>
    );
}



export default ExploreMenu;