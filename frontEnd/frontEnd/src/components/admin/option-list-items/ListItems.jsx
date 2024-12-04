import React, { useEffect, useState } from "react";
import "./list-items.css";
import listitemsIcon from "../../../../public/assets/images/admin-panel/list.png";
import SuccessAlert from "../../alertMessage/SuccessAlert.jsx";
import axios from "axios";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { food_list } from "../../food-list/food-list.js";




//admin component  
function ListItems(){

    //const alertMessageFillAllFields = "Mandatory to fill all fields.";
    const alertMessageFormSubmitedSuccess = "Your item is deleted successfully.";
    // const [isFiledsEmpty, setIsFiledsEmpty] = useState(false);
    const [isItemDeleted, setIsItemDeleted] = useState(false);
    //holds the list of items 
    const [itemsList, setItemsList]  = useState([]); 
    

    //Fetch items list 
    useEffect(()=> {
        async function getItemList() {
            try{
                console.log("fetch getlist items");
                const response = await axios.get("http://localhost:3000/admin-items-list");
                const backEndResponse = response.data;
                
                if (backEndResponse.success) {
                  console.log("items fetched");
                  console.log(backEndResponse.items);
                  
                  setItemsList(backEndResponse.items);
                  
                }else {
                    console.error("Failed to fetch items: ", backEndResponse.message);
                }

            }catch(error){
                console.error("An error occured in fetching", error);
            }
       }

       getItemList();
    },[isItemDeleted]);

    

    // Function to delete an item
   async function handleDeleteitemClick(itemId){
        
        try {
            console.log("itemId listitem.jsx", itemId);
            
            // delete item for the given id from db
            const response = await axios.delete(`http://localhost:3000/delete-admin-item-from-menu?itemId=${itemId}`);

            if (response.data.success) {
                setIsItemDeleted(true);
                // delete item from the local state
                console.log("filter item for given id");
                setItemsList(itemsList.filter((item)=> itemId !== item.id));

                setTimeout(()=>{
                    setIsItemDeleted(false);
                },1500);
            }else{
                console.log("Failed to delete item", response.data.message);
            }

        } catch (error) {
            console.error("An Error occured to delete item", error);            
        }
        
    }


    return(
       <div className="admin-page-list-items">
           <div className="admin-items-alert-message">
                {isItemDeleted && <SuccessAlert alertMessage={alertMessageFormSubmitedSuccess} />}
            </div>
            <div className="admin-content-icon"><img id="contentIcon" src={listitemsIcon} alt="" />
            </div>
            
            <div className="list-item-table">
                <div className="list-item-table">
                    <table>
                     <thead>
                        <tr className="list-item-table-title">
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th id="action-title" >Action</th>
                        </tr>
                    </thead>
                        <tbody className="list-items-table-body">
                        {itemsList.map((item, index) => {
                            
                            const imageUrl = item.image.startsWith('/assets/images') ?
                            item.image : 
                            `http://localhost:3000${item.image}`;

                            return (
                            <tr key={index} className="list-item-table-content">
                                <td className="list-item-table-content-image">
                                    <img src={imageUrl} alt="" />
                                </td>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.price}</td>
                                <td id="action-icon" ><DeleteForeverIcon className="btn-cursor list-items-table-btn" onClick={() => handleDeleteitemClick(item.item_id)} /></td>
                            </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default ListItems;
