import React, { useEffect, useState } from "react";
import axios from "axios";
import "./cart-item-list.css";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import emptyCartList from "../../../public/assets/images/cart-item-page/empty-cart-list.png";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../alertMessage/SuccessAlert";




function ListOfCartItem(props) {

    const { idToAddCart, removeIncrementDecrementIcon, removeItemFromCart, isLoggedIn } = props;

    //holds item details that have added to the cart page
    const [itemAddedToCart, setItemAddedToCart] = useState([]);
    //look for the cart update
    const [cartUpdated, setCartUpdated] = useState(false);
    //alert message for deleting item fromcart
    const alertMessageSuccessfullyDelete = "Item deleted successfully."
    //set state for to show successfull alert
    const [itemDeletedFromCart, setItemDeletedFromCart] = useState(false);
    // gets the cust id of logged in user
    const custId = localStorage.getItem("custId");
    const navigate = useNavigate();

    console.log("itemAddedToCart");
    console.log(itemAddedToCart);

    // handle delete forever icon click
    function handleDeleteForeverIconClick(itemId) {
        //delete item from cart
        deleteItemFromCart(itemId);
        //remove icrement decrement btn
        removeIncrementDecrementIcon(itemId);
        //remove id of the item that has deleted from cart
        removeItemFromCart(itemId);
    }

    function calTotalPriceOfItem(price, quantity) {
        return price * quantity;
    }

    // navigate to the orders page
    function handlePlaceOrderClick() {
        navigate("/place-order");
    }

    // delete item from cart page on the given custId
    async function deleteItemFromCart(itemId) {
        try {
            const response = await axios.delete("http://localhost:3000/delete-item-from-cart", {
                params: {
                    custId: custId,
                    item_id: itemId,
                },
            });
            console.log(response.data);
            const backEndResponse = response.data;

            if (backEndResponse.success) {
                // gets the id of the deleted item from cart
                const deletedItemId = backEndResponse.deletedItemId;
                // filter the item details that has deleted from cart
                setItemAddedToCart(itemAddedToCart.filter((item) => item.item_id != deletedItemId));
                setItemDeletedFromCart(true);

                setTimeout(() => {
                    setItemDeletedFromCart(false);
                }, 2000);
            } else {
                console.log("item not found");
            }
        } catch (error) {
            console.error("Error in deleting item from cart.");
        }

    }

   

    //fetch details of the cart items to display on the cart page for the given custId
    useEffect(() => {
        if (isLoggedIn) {
            gettingItemToCart();
        } else {
            console.log("Please log in to view cart items.");
        }
        setCartUpdated(false);
    }, [custId, cartUpdated, isLoggedIn]);
    async function gettingItemToCart() {
        try {
            const response = await axios.get(`http://localhost:3000/get-cart-items/?custId=${custId}`);
            const backEndResponse = response.data;

            if (backEndResponse.success) {
                //set item details into cart page for the given custId
                setItemAddedToCart(backEndResponse.cartItems);
            } else {
                console.log("No items in the cart.");
            }
        } catch (error) {
            console.error("An error occured.", error);
        }
    }



    return (
        <div className="add-cart">
            {itemDeletedFromCart && <SuccessAlert alertMessage={alertMessageSuccessfullyDelete} />}
            
            <div className="add-cart-items">
                <h2>Cart Items <hr /></h2>
                {itemAddedToCart.length > 0 && 
                    <button 
                        className="btn-cursor btn add-cart-placeOrder-btn" 
                        onClick={handlePlaceOrderClick} ><p style={{fontFamily:"Charm"}}>Place Order</p>
                    </button>
                }
                
                <div className="add-cart-items-title">
                    <p>Items</p>
                    <p>Name</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br /> <hr />
                <div className={itemAddedToCart.length > 0 ? "add-cart-items-list-container" : null} >
                    {itemAddedToCart.length > 0 ? itemAddedToCart.map((item, index) => {

                    const imageUrl = item.image.startsWith('/assets/images') ?
                    item.image : 
                    `http://localhost:3000${item.image}`;

                        return (
                            <div key={index}>
                                <div className="add-cart-items-list add-cart-items-title">
                                    <img id="add-cart-image" src={imageUrl} alt="" />
                                    <p>{item.name}</p>
                                    <p>{item.price}</p>
                                    <p>{item.quantity}</p>
                                    <p>{calTotalPriceOfItem(item.price, item.quantity)}</p>
                                    <p>
                                        <DeleteForeverIcon className="btn-cursor add-cart-delete"
                                            onClick={() => { handleDeleteForeverIconClick(item.item_id) }}
                                        />
                                    </p>
                                </div>
                                <hr />
                            </div>
                          )
                        }) 
                        :
                        <div className="empty-cart">
                            <p>Your cart is empty. Start adding items now!</p>
                            <img src={emptyCartList} alt="Empty Cart" />
                        </div>
                    }
                </div>

            </div>


        </div>
    )
}


export default ListOfCartItem;