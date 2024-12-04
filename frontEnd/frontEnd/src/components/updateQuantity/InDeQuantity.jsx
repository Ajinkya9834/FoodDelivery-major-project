import React, { useEffect, useState } from "react";
import "./inDeQuantity.css";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';



function InDeQuantity(props){
   
    const {setUpdateQuantity, currentQuantity, idOfCartItem, handleQuantityUpdate} = props;
    // const [idOfAddedItem, setIdOfAddedItem] = useState([]);
    // console.log("indeqty");
    // console.log(idOfCartItem);
    // console.log("idOfCartItem");
    // console.log(idOfCartItem);
    // console.log("idOfAddedItem");
    // console.log(idOfAddedItem);
    // console.log("currentQuantity", + currentQuantity);
    

    useEffect(()=> {
        setUpdateQuantity((prevQty) => ({
            ...prevQty,
            [idOfCartItem]: currentQuantity || 1,
        }))
    },[])


    //increment item qty
    function incrementItemQuantity(){

        // console.log("incrementItemQuantity ====> idOfAddedItem" + idOfCartItem);
        const newQuantity = currentQuantity + 1;
        setUpdateQuantity((prevQty) => ({
            ...prevQty,
            [idOfCartItem]: newQuantity,
        }));
    }

    //decrement item qty
    function decrementItemQuantity(){
        // console.log("decrementItemQuantity ====> idOfAddedItem" + idOfCartItem);
       if (currentQuantity > 1) {
         const newQuantity = currentQuantity - 1;
         setUpdateQuantity((prevQty) => ({
            ...prevQty,
            [idOfCartItem]: newQuantity,
         }));
       }

    }


    return(
        <>
            <p id="increment-btn" onClick={incrementItemQuantity}> 
                <AddCircleIcon
                    sx={{
                        color: "rgb(52, 121, 40)",
                    }}
                /> 
            </p>
            <p id="quantity-of-item" >{currentQuantity}</p>
            <p id="decrement-btn" onClick={decrementItemQuantity} > 
                <RemoveCircleIcon
                        sx={{
                            color: "rgb(205, 24, 24)"
                        }}
                    />  
            </p>
        </>
    )
}



export default InDeQuantity;