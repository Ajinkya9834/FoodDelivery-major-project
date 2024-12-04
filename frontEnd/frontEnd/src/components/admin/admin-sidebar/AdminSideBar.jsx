import React, { useEffect, useState } from "react";
import "./admin-sidebar.css";
import addItemsIcon from "../../../../public/assets/images/admin-panel/add.png";
import ordersIcon from "../../../../public/assets/images/admin-panel/delivery-man.png";
import listitemsIcon from "../../../../public/assets/images/admin-panel/list.png";
import selectOptionIcon from  "../../../../public/assets/images/admin-panel/selective.png";
import AddItems from "../option-add-items/AddItems.jsx";
import ListItems from "../option-list-items/ListItems.jsx";
import Orders from "../option-orders/Orders.jsx";


function AdminSideBar() {
     
    // select add Items, list Items or orders option
    const [selectedOption, setSelectedOption] = useState(null);

    function handleOptionIconClick(option) {
      console.log();
      
        if(option === ""){
            console.log("option not selected");
        }else{
            console.log(option);      

            setSelectedOption(option);
        }
    }



    return(
        <div className="side-bar-admin-page-content">
            <div className="side-bar">
                <div className="side-bar-options ">
                    <div className="side-bar-option btn-cursor " onClick={() => handleOptionIconClick("addItems")} >
                        <img id="siderbar-addItem" src={addItemsIcon} alt="" />
                        <p>Add items</p>
                    </div>
                    <div className="side-bar-option btn-cursor" onClick={() => handleOptionIconClick("listItems")} >
                        <img id="siderbar-listItem" src={listitemsIcon} alt="" />
                        <p>List items</p>
                    </div>
                    <div className="side-bar-option btn-cursor" onClick={() => handleOptionIconClick("orders")} >
                        <img id="siderbar-order" src={ordersIcon} alt="" />
                        <p>Orders</p>
                    </div>
                </div>
            
            </div>

            <div className="admin-page-content">
                {selectedOption === null && 
                    <div id="select-option"><img src={selectOptionIcon} alt="" /><h2>select an option</h2></div> 
                }
                {selectedOption === "addItems" && <AddItems/> }
                {selectedOption === "listItems" && <ListItems/> }
                {selectedOption === "orders" && <Orders/> }
            </div>

        </div>
    )
}


export default AdminSideBar;