import React, { useState } from "react";
import "./add-items.css";
import imageUploadIcon from "../../../../public/assets/images/admin-panel/image-upload.png";
import addItemsIcon from "../../../../public/assets/images/admin-panel/add.png";
import FillAllFieldsAlert from "../../../components/alertMessage/FillAllFieldsAlert.jsx";
import SuccessAlert from "../../alertMessage/SuccessAlert.jsx";
import {nanoid} from "nanoid";
import axios from "axios";


function AddItems() {

    const alertMessageFillAllFields = "Mandatory to fill all fields.";
    const alertmessageFormSubmitedSuccess = "your item have been submitted successfully.";

    //generate unique id
    const itemId = nanoid(2);
    console.log(itemId);
    
    //set state according to field empty
    const [isFiledsEmpty, setIsFiledsEmpty] = useState(false);
    //holds all the details of the item 
    const [addItemForm, setAddItemForm] = useState({
        itemImage:"",
        itemName: "",
        itemDescription:"",
        itemCategory:"",
        itemPrice:"",

    });

    //holds the temporary url of the image
    const [imagePreview, setImagePreview] = useState(null);
    console.log("addItemForm", addItemForm);
    //set the state when the form is submitted
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);


    // function to handle input change
    function handleInputValueChange(event){
        const {name, value, files} = event.target;
        console.log("change");
        
        if (name === "itemImage") {
            const file = files[0];
            console.log("file", file);


            setAddItemForm((prev) => ({              
                ...prev,
                [name] : file,
            }));    

            // generate temparory image preview URL
            const TemporaryImageUrl = URL.createObjectURL(file); 
            setImagePreview(TemporaryImageUrl);
        
        } else {
            setAddItemForm((prev)=>({
                ...prev,
                [name]: value,
            }));
        }
    }

    // Function to handle form submission
    async function handleAdminAddItemsFormSubmit(event){
        event.preventDefault();
        if(Object.values(addItemForm).some((value)=> value === "")){
            setIsFiledsEmpty(true);

            setTimeout(()=>{
                setIsFiledsEmpty(false); 
                return;
            },2000);
           
        }

        try {
            const formData = new FormData();
            formData.append("itemImage", addItemForm.itemImage);
            formData.append("itemName", addItemForm.itemName);
            formData.append("itemDescription", addItemForm.itemDescription );
            formData.append("itemCategory", addItemForm.itemCategory);
            formData.append("itemPrice", addItemForm.itemPrice);
            // console.log("form");
            // const itemImage = event.target.itemImage.files[0];
            // console.log(addItemForm.itemImage);
            // for (let [key, value] of formData.entries()) {
            //     console.log(`${key}: ${value}`);
            //   }
              
            
            const response = await axios.post("http://localhost:3000/add-items", formData
                // { 
                // headers: {
                //     "Content-Type": "multipart/form-data",
                // },
            // }
        );

            if (response.data.success) {
                //to reset form
                console.log("sucess in adminform ");
                
                //empting the input fields
                setAddItemForm({
                    itemImage: "",
                    itemName: "",
                    itemDescription: "",
                    itemCategory: "",
                    itemPrice: "",
                });
                
                setImagePreview(null);
                setIsFormSubmitted(true);

                setTimeout(()=>{
                    setIsFormSubmitted(false);
                }, 1500);

            }else{
                console.log("Failed to post data", response.data.message);
            }
        } catch (error) {
            console.error("An error occured while submitting", error);
        }
    }

    return(
        <div className="admin-page-add-items">
            <div className="admin-items-alert-message">
                {isFiledsEmpty && <FillAllFieldsAlert alertMessage={alertMessageFillAllFields} />}
                {isFormSubmitted && <SuccessAlert alertMessage={alertmessageFormSubmitedSuccess} /> }
            </div>

            <div className="admin-content-icon"><img id="contentIcon" src={addItemsIcon} alt="" />
            </div>
        
            <form className="add-item-form" onSubmit={handleAdminAddItemsFormSubmit}  >
                <div className="add-item-image-upload ">
                     <p>Upload image</p>
                     <label  htmlFor="image">
                         {imagePreview ? <img src={imagePreview} alt="" /> : <img className="btn-cursor upload-image" src={imageUploadIcon} alt=""  />}
                     </label>
                     <input type="file" name="itemImage" id="image" hidden onChange={handleInputValueChange} />
                </div>
                <div className="add-item-name" >
                    <p htmlFor="item-name">Item Name</p>
                    <input type="text" name="itemName" id="item-name" value={addItemForm.itemName} placeholder="enter item name" onChange={handleInputValueChange} />
                </div>
                <div className="add-item-description">
                    <p htmlFor="item-description">Item description</p>
                    <textarea type="text" name="itemDescription" rows={6} id="item-description" value={addItemForm.itemDescription} onChange={handleInputValueChange} placeholder="enter item description" />
                </div>
                <div className="add-item-category">
                    <p>Select  category</p>
                    <select className="btn-cursor" name="itemCategory" id="item-category" 
                        value={addItemForm.itemCategory} onChange={handleInputValueChange} 
                    >
                        <option value="" disabled  >select category</option>
                        <option value="Salad">Salad</option>
                        <option value="Rolls">Rolls</option>
                        <option value="Deserts">Deserts</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Cake">Cake</option>
                        <option value="Pure Veg">Pure veg</option>
                        <option value="Pasta">Pasta</option>
                        <option value="Noodles">Noodles</option>
                    </select>
                </div>

                <div className="add-item-item-price">
                    <p>Food price</p>
                    <input type="text" name="itemPrice" id="item-price" 
                        value={addItemForm.itemPrice} onChange={handleInputValueChange} placeholder="ex- 20" 
                    />
                </div>

                <button className="btn-cursor btn"  type="submit" name="addItem" >Add Item</button>

            </form>
        </div>

    )
}


export default AddItems;