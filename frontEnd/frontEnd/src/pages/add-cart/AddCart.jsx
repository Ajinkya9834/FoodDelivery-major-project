import React from "react";
import Navbar from "../../components/navbar/Navbar.jsx";
import Footer from "../../components/footer/Footer.jsx";
import ListOfCartItem from "../../components/cart-item-list/ListOfCartItem.jsx";


function AddCart(props){
    
    
    return(
        <>
            <section><Navbar isLoggedIn={props.isLoggedIn} setIsLoggedIn={props.setIsLoggedIn} /></section>
            <section id="add-cart-list">
                <ListOfCartItem 
                    isLoggedIn={props.isLoggedIn}
                    idToAddCart={props.idToAddCart} 
                    removeIncrementDecrementIcon={props.removeIncrementDecrementIcon} 
                    removeItemFromCart={props.removeItemFromCart}
                />
            </section>
            <section id="home-page-footer" ><Footer/></section>
        </>
    )

}

export default AddCart;