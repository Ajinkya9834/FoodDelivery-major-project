import React, { useEffect } from "react";
import "./place-order.css"
import { useState } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import InfoAlert from "../alertMessage/InfoAlert.jsx";
import FillAllFieldsAlert from "../alertMessage/FillAllFieldsAlert.jsx";
import SuccessAlert from "../alertMessage/SuccessAlert.jsx";
import { useNavigate } from "react-router-dom";




function PlaceOrder(props) {
    const { custLoggedIn } = props;
    console.log("custLoggedIn", custLoggedIn);
    const custId = localStorage.getItem("custId");
    console.log(custId);
    //to navigate
    const navigate = useNavigate();
    // generate uniqueId orderId
    const uniqueNanoId = nanoid(3);
    const randomNumber = Math.floor(Math.random() * 1000);
    const orderId = `${uniqueNanoId}${randomNumber}`;
    //gets current data
    const dayOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
    const currentDate = new Date().getDate();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const currentDay = dayOfWeek[new Date().getDay()];
    const orderDate = `${currentDay}  ${currentDate}/${currentMonth}/${currentYear}`;
    //alert message
    const loggedOutAlert = "Your session has expired or you have logged out. Please log in again to continue.";
    const fillAllFieldsAlert = "Mandatory to fill all fields.";
    const paymentSuccessfulAlert = "Your order has placed successfully";
    //holds the items details that are in the cart
    const [ItemsAddedInCart, setItemsAddedInCart] = useState([]);
    console.log("ItemsAddedInCart > ", ItemsAddedInCart);
    // set state all fields are filled
    const [isNotAllFieldFilled, setIsNotAllFieldFilled] = useState(false);
    // set state payment successfull
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
    //order detail form
    const [orderDetails, setOrderDetails] = useState({
        orderId: orderId,
        custName: "",
        email: "",
        phoneNumber: "",
        orderDate: orderDate,
        addressToDeliver: "",
        totalOrderPrice: 0,

    });
    console.log(orderDetails);

    //converted javascript object into stringify 
    const itemsDetailsJson = JSON.stringify(
        ItemsAddedInCart.map((item) => ({
            item_id: item.item_id,
            itemName: item.name,
            quantity: item.quantity,
        }))
    );


    //check to show info about login or all fields to be filled message or button to make payment
    let buttonOrMessage;
    if (!custLoggedIn) {
        buttonOrMessage = <InfoAlert alertMessage={loggedOutAlert} />
    } else if (isNotAllFieldFilled) {
        buttonOrMessage = <FillAllFieldsAlert alertMessage={fillAllFieldsAlert} />
        setTimeout(() => {
            setIsNotAllFieldFilled(false);
        }, 2000);
    } else if (isPaymentSuccessful) {
        buttonOrMessage = <SuccessAlert alertMessage={paymentSuccessfulAlert} />
        setTimeout(() => {
            setIsPaymentSuccessful(false);
        }, 2000);
    } else {
        buttonOrMessage = (
            <button id="place-order-btn" className="btn btn-cursor" type="submit">
                Make Payment
            </button>
        );
    }

    //calculate the total price of the item
    function calTotalPriceOfItem(price, quantity) {
        const aItemTotalPrice = price * quantity;
        return aItemTotalPrice;
    }

    //calculate the total prce of the order
    function calTotalPriceOfOrder() {
        let totalOrderPrice = 0;

        ItemsAddedInCart.forEach((item) => {
            totalOrderPrice = totalOrderPrice + (item.price * item.quantity);
        })
        return totalOrderPrice;
    }

    // delete item from cart after successful payment
    async function makeCartEmpty() {
        //check if custid send
        if (!custId || custId === "") {
            console.log("Customer ID is missing. Cannot proceed to empty the cart");
            return;
        }

        try {
            //clear cart page for the given custId
            const response = await axios.delete(`http://localhost:3000/make-cart-empty/?custId=${custId}`);
            if (response.data.success) {
                console.log(`Cart successfully emptied for Customer ID: ${custId}`);
            } else {
                console.log(`Unable to empty the cart for Customer ID: ${custId}`);
            }

        } catch (error) {
            console.error(`Failed to empty the cart`, error.message);
        }

    }

    async function handleOrderPlaceSubmit(event) {
        event.preventDefault();
        //check if any order details is empty
        if (Object.values(orderDetails).some((value) => value === "")) {
            setIsNotAllFieldFilled(true);
            setTimeout(() => {
                setIsNotAllFieldFilled(false);
            }, 2000);

        } else {
            try {
                //post all order details after successfull payment
                const response = await axios.post(`http://localhost:3000/place-order`, {
                    orderId: orderDetails.orderId,
                    custId: custId,
                    custName: orderDetails.custName,
                    email: orderDetails.email,
                    phoneNumber: orderDetails.phoneNumber,
                    addressToDeliver: orderDetails.addressToDeliver,
                    totalOrderPrice: orderDetails.totalOrderPrice,
                    itemsDetailsJson: itemsDetailsJson,
                    // payment status
                });

                // response.data.success
                if (response.data.success) {
                    setIsPaymentSuccessful(true);
                    makeCartEmpty();
                    setTimeout(() => {
                        navigate("/");
                    }, 2500);
                } else {
                    console.log("error in placing and order.");
                }

            } catch (error) {
                console.error("Error in placing an order", error);
            }
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setOrderDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    }

    //update total price whenever itemsInCart changes
    useEffect(() => {
        const totalprice = calTotalPriceOfOrder();
        setOrderDetails((prevDetails) => ({
            ...prevDetails,
            totalOrderPrice: totalprice,
        }));
    }, [ItemsAddedInCart]);

    //fetch those items that are in the cart to display on the place order page
    useEffect(() => {
        async function getItemsAddedInCart() {
            try {
                const response = await axios.get(`http://localhost:3000/get-cart-items/?custId=${custId}`);
                const backEndResponse = response.data;
                if (backEndResponse.success) {
                    console.log(backEndResponse.cartItems);
                    //set cart items in the state
                    setItemsAddedInCart(backEndResponse.cartItems);
                } else {
                    console.log("No items in the cart.");
                }
            } catch (error) {
                console.error("Error occured in fetching cart items", error);
            }
        }
        getItemsAddedInCart();
    }, []);


    return (

        <><div className="place-order"><h1>Order Details</h1><hr />
            <div className="place-order-container">
                <div className="place-order-card" >
                    <p>Order Id:  <strong>#{orderDetails.orderId}</strong></p><br />
                    <div className="place-order-scrollbar" >
                        {ItemsAddedInCart.map((item, index) => {

                            const imageUrl = item.image.startsWith('/assets/images') ?
                            item.image :
                            `http://localhost:3000${item.image}`;

                            return (
                                <div className="place-order-item" key={index}>
                                    <img src={imageUrl} alt="" />
                                    <div className="place-order-item-details">
                                        <p>{item.name}</p>
                                        <div className="place-order-item-price">
                                            <p>Total Rs.{calTotalPriceOfItem(item.price, item.quantity)}</p><p>Qty: {item.quantity}</p>
                                        </div><br />
                                        <hr />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div><hr />

                <div className="place-order-form-container" >
                    <form onSubmit={handleOrderPlaceSubmit} >
                        <div className="place-order-form">
                            <div>
                                <p>Order Id</p>
                                <input type="text" name="orderId" id="orderId" value={`#${orderDetails.orderId}`} readOnly />
                                <p>Customer Name</p>
                                <input type="text" name="custName" id="custName" value={orderDetails.custName} onChange={handleChange} />
                                <p>Email</p>
                                <input type="text" name="email" id="email" value={orderDetails.email} onChange={handleChange} />
                            </div>
                            <div>
                                <p>Phone Number</p>
                                <input type="text" name="phoneNumber" id="phone" value={orderDetails.phone} onChange={handleChange} />
                                <p>Order Date</p>
                                <input type="text" name="orderDate" id="orderDate" value={orderDetails.orderDate} readOnly />
                                <p>Address to Deliver:</p>
                                <textarea name="addressToDeliver" id="addressToDeliver"
                                    cols={31} rows={5} value={orderDetails.addressToDeliver} onChange={handleChange} >

                                </textarea>
                                <br /><br />
                            </div>
                        </div>
                        <p id="total-price">Total Price: <span>Rs{calTotalPriceOfOrder()}</span></p>
                        {buttonOrMessage}
                    </form>

                </div>
            </div>
        </div>

        </>
    )
}


export default PlaceOrder;