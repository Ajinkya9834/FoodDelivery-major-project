import React, { useEffect, useState } from "react";
import "./order-history.css";
import Navbar from "../navbar/Navbar";
import axios from "axios";
import InfoAlert from "../alertMessage/InfoAlert.jsx";
import noOrderHistory from "../../../public/assets/images/order-history/order-history.png";


function OrderHistory(props) {

    const { isLoggedIn, setIsLoggedIn } = props;

    const custId = localStorage.getItem("custId");
    console.log(custId);
    //holds order history details
    const [history, setHistory] = useState([]);
    //set state for info 
    const [isNotHistoryAvailable, setIsNotHistoryAvailable] = useState(false);
    const alertMessageHistoryNotAvailable = "No order history available.";
    const alertMessageSessionTimeOut = "Your session has expired or you have logged out. Please log in again to continue.";
    function customStyle(status) {
        console.log("status", status);

        return {
            color:
                status === "Pending" ? "red"
                    : status === "Delivered" ? "green"
                        : "orange",
        };
    }

    //get order history details
    useEffect(() => {
        async function getOrderHistory() {
            try {

                const response = await axios.get(`http://localhost:3000/get-order-history?custId=${custId}`);
                const backEndResponse = response.data;

                if (backEndResponse.success) {
                    console.log(backEndResponse.history);
                    setHistory(backEndResponse.history);
                } else {
                    console.log("No order history.");
                    setIsNotHistoryAvailable(true);
                    setTimeout(() => {
                        setIsNotHistoryAvailable(false);
                    }, 2000);
                }

            } catch (error) {
                console.error(`An error occured in fetching order history for cust Id: ${custId}.`, error);
            }
        }
        getOrderHistory();
    }, []);



    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            {isNotHistoryAvailable && <InfoAlert alertMessage={alertMessageHistoryNotAvailable} />}

            <p id="history-title" >Order History <hr /></p>

            {!isLoggedIn ?
                <InfoAlert alertMessage={alertMessageSessionTimeOut} />
                :(
                <div className="container">

                    {history.length > 0 ? history.map((order, index) => {

                        return (
                            <div key={index} className="history-container">
                                <p>Order Id: <strong>#{order.order_id}</strong></p>
                                <p id="order-date" >{order.payment_at.split("T")[0]}</p>
                                <p>Total Price: <span id="order-tot-price" >₹{order.total_order_price}</span></p>
                                <p
                                    style={customStyle(order.delivery_status)}
                                ><span id="order-status">Status: </span><span id="order-status-value" >{order.delivery_status}</span></p>

                                <div className="history-order-scrollbar">
                                    {order.items.map((item, index) => {
                                        const imageUrl = item.item_image.startsWith('/assets/images')
                                            ? `http://localhost:5173${item.item_image}`
                                            : `http://localhost:3000${item.item_image}`;

                                        return (

                                            <div key={index} className="history-details">
                                                <img id="history-img" src={imageUrl} alt={item.item_name} />
                                                <div>
                                                    <p>{item.item_name}</p>
                                                    <p >Qty:{item.item_quantity}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                        :
                        <div className="no-order-history">
                            <p>No orders are currently available.</p>
                            <img id="no-order-icon" src={noOrderHistory} alt="" />
                        </div>
                    }

                </div>
                )
            }

            

        </>
    );
}


export default OrderHistory;