import React, { useEffect, useState } from "react";
import "./orders.css";
import ordersIcon from "../../../../public/assets/images/admin-panel/delivery-man.png";
import orderArrived from "../../../../public/assets/images/admin-panel/order.png";
import SuccessAlert from "../../alertMessage/SuccessAlert.jsx"; 
import axios from "axios";



function Orders() {


    //set the order delivery status as per the orderId
    const [orderStatus, setOrderStatus] = useState({});
    console.log(orderStatus);
    
    //holds all the details of the placed order
    const [placedOrderDetails, setPlaceOrderDetails] = useState([]);
    console.log(placedOrderDetails);

    //update order deliver status
    const alertMessageSuccessfullyUpdateStatus = "Delivery status updated."
    const [updateDeliveryStatus, setUpdateDeliveryStatus] = useState(false);


    //handle change of the order delivery status
    function handleOrderStatusChange(event, detail) {
        const orderId = detail.order_id;
        const {value} = event.target;
        
        // set the order status for the specific order ID
        setOrderStatus(()=>({
            [orderId]: value,
        }));
        
        updateOrderDeliveryStatus(orderId, value);

        setTimeout(()=>{            
            getOrderDetails();
        },100);

        
    }

    

    // update the order delivery status for the given order Id
    async function updateOrderDeliveryStatus(orderId, orderDeliveryStatus) {
        try {            
            const response  = await axios.post("http://localhost:3000/update-order-delivery-status", {
                order_id: orderId,
                orderDeliveryStatus: orderDeliveryStatus, 
            });
            const backEndResponse = response.data;

            if (backEndResponse.success) {
                setUpdateDeliveryStatus(true);

                setTimeout(()=>{
                    setUpdateDeliveryStatus(false);
                },2000);
            }

        } catch (error) {
            console.error("Error occured in updating the status of the delivery", error);
        }
    }


    //get all the order details that are placed by the customer
    useEffect(() => {
        getOrderDetails();
    }, []);
    async function getOrderDetails() {
        try {
            console.log("change^^^^^");
            
            const response = await axios.get("http://localhost:3000/get-admin-order-details");
            const backEndResponse = response.data;
            console.log(backEndResponse.orderDetails);

            if (backEndResponse.success) {
                // set the order details 
                console.log("success^^ getOrderDetails", backEndResponse.orderDetails);
                
                setPlaceOrderDetails(backEndResponse.orderDetails);
            } else {
                console.log("Failed to fetched order details.");

            }

        } catch (error) {
            console.error("An error occurd in fetching order detiails.", error);
        }
    }
   


    return (
        <div className="admin-page-orders">
            <div className="admin-content-icon"><img id="contentIcon" src={ordersIcon} alt="" />
            </div>
            {updateDeliveryStatus && <div><SuccessAlert alertMessage={alertMessageSuccessfullyUpdateStatus}/></div>}
            
            {placedOrderDetails.map((detail, index) => (
            <div key={index} className="admin-page-orders-content">
                <div className="admin-order-page-image"><img src={orderArrived} alt="" /></div>
                    <div className="admin-page-orders-details">
                        <div>

                            <p>{detail.items.map((item, index)=>(
                                <span key={index} id="item-quantity" >{item.itemName} <strong >{item.quantity}x</strong> | </span>    
                            ))} </p>
                            <p><strong>Tot</strong>: {detail.total_order_price}</p>
                            
                            <select name="orderDeliveryStatus" id="order-Status" value={detail.order_status || ""}
                                onChange={(event)=>handleOrderStatusChange(event, detail)} >  
                                <option value="" disabled >select delivery status</option>
                                <option value="Pending">Pending</option>
                                <option value="Out to delivery">Out to delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                        <div>
                            <p><strong>{detail.customer_name} | cust Id:</strong> {detail.cust_id}</p>
                            <p><strong>order Id: #</strong>{detail.order_id}</p><br />
                            <p>{detail.delivery_address} </p>
                            <p>{detail.contact_number}</p>
                        </div>
                    </div>
            


            </div>
            ))}
        </div>
    )
}


export default Orders;
