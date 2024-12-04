import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./food-list.css";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
// import { food_list } from './food-list.js';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import InDeQuantity from '../updateQuantity/InDeQuantity.jsx';
import InfoAlert from '../alertMessage/InfoAlert.jsx';



function FoodList(props) {

  const { isLoggedIn, addIncrementDecrementIcon, menuCategory, addToCart, itemInCart } = props;
  const itemGap = 20;
  //set login info alert is shown
  const [isLoginInfoShown, setIsLoginInfoShown] = useState();
  const loginMessage = "Kindly first login or register";
  //filters the items according to the category
  const [filterItem, setFilterItem] = useState([]);
  //sets food items fetched from db
  const [food_list, setFood_list] = useState([]);
  console.log(food_list);
  //sets of if container to fit food_items
  const [itemListHeight, setItemListHeight] = useState(false);
  //sets columns according to screen size (2 | 4) 
  const [itemsColumns, setItemsColumns] = useState(4);
  // updates the quantity of the items with its id
  // when clicked on increment or decrement button
  const [selecteItemId, setSelecteItemId] = useState();
// holds the item quantity added in the cart to order
const [updateQuantity, setUpdateQuantity] = useState({});

  
  console.log("updateQuantity: ", updateQuantity);

  //sets the items column
  window.addEventListener('resize', checkWindowSize);
  function checkWindowSize() {
    setItemsColumns(window.innerWidth < 376 ? 2 : 4);
  }


  // filter items according to category of food
  useEffect(() => {
    if (menuCategory) {
      if (menuCategory === "All") {//console.log("indise");
        setFilterItem(food_list);
        setItemListHeight(false);
        return;
      }
      setFilterItem(food_list.filter((item) => item.category === menuCategory));
      setItemListHeight(true);
    } else {
      setFilterItem(food_list);
    }
  }, [menuCategory, food_list]);


  // Combined Event Handler
  function handleCartIconBtnClick(item) {

    if (isLoggedIn) {      
      //add the item_id of the item that has stored in the cart
      addToCart(item.item_id);
      //add icrement decrement icon
      addIncrementDecrementIcon(item.item_id);
      setSelecteItemId(item.item_id);
    } else {
      console.log("login");
      setIsLoginInfoShown(true);

      setTimeout(()=>{
        setIsLoginInfoShown(false);
      }, 2000);

    }
  }

  
  // send the item details to the db 
  useEffect(() => {   
    const custId = localStorage.getItem("custId"); 
    addingItemToCart(selecteItemId, custId, updateQuantity);
  }, [updateQuantity, selecteItemId]);

  async function addingItemToCart(itemid, custId, updateQuantity) {
    try {
      // console.log("save-item-to-cart", updateQuantity[itemid]);

      const response = await axios.post("http://localhost:3000/save-item-to-cart", {
        item_id: itemid,
        custId: custId,
        quantity: updateQuantity[itemid],
      });
      console.log("Item successfully sent to the database:", response.data);

    } catch (error) {
      console.error("An error occured in selecting item ", error);
    }
  }


 
  // updates the quantity on the home after component mount
  useEffect(()=>{
    const custId = localStorage.getItem("custId");
    
    async function getQuantityOnHomePage(custId) {
      try {
        //fetch quantity corresponding to the custId
        const response = await axios.get(`http://localhost:3000/get-quantity-of-item?custId=${custId}`);
        console.log("Quantity of items:",response.data);
        const backEndResponse = response.data;
        if (backEndResponse.success) {
          // update quantity and item id in the state
           setUpdateQuantity(backEndResponse.quantity);          
        }else{
          console.log("customer(user) has not registered");
        }
      } catch (error) {
        console.error("Error in fetching quantity if the item", error);
      }
    }

    getQuantityOnHomePage(custId);
  },[]);


 // fetched food_list from database 
  useEffect(() => {
    async function getFoodList() {
      try {
        const response = await axios.get("http://localhost:3000/get-food-list");
        const backEndResponse = response.data;
        console.log(backEndResponse);

        //check data has fetched
        if (backEndResponse.success) {
          setFood_list(backEndResponse.food_list);
          console.log("successfully fetched food_list", backEndResponse.food_list);

        } else {
          console.log("failed to fetch food list ");
        }

      } catch (error) {
        console.error("Error fetching food list", error);
      }
    }

    getFoodList();
  }, [])


  return (
    <>
      <div className="food-list-alert-message">
        {isLoginInfoShown && <InfoAlert alertMessage={loginMessage} />}
      </div>

      <ImageList sx={{ width: "auto", height: itemListHeight ? 'auto' : '90vh', marginTop: 10, }}
        gap={itemGap} cols={itemsColumns} className='food-list-scroll-bar'
      >

        {filterItem.map((item) => {
        const imageUrl = item.image.startsWith('/assets/images') ?  item.image : `http://localhost:3000${item.image}`;
        return (



          <ImageListItem key={imageUrl} id="image-list-item">
            <img
              srcSet={`${imageUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
              src={`${imageUrl}?w=248&fit=crop&auto=format`}
              alt={item.name}
              loading="lazy"
            />
            <ImageListItemBar
              title={item.name}
              subtitle={`Rs: ${item.price}`}
              sx={{
                background: "rgb(234, 188, 197)", opacity: 1,
                "& .MuiImageListItemBar-title": { color: 'rgb(168, 16, 46)' },
                "& .MuiImageListItemBar-subtitle": { color: 'rgb(168, 16, 46)'}
              }}

              actionIcon={
                <IconButton
                  aria-label={`info about ${item.name}`}
                  onClick={() => { handleCartIconBtnClick(item) }}
                >
                  {itemInCart.includes(item.item_id) || updateQuantity[item.item_id]  ?
                  
                    <InDeQuantity

                      currentQuantity={updateQuantity[item.item_id]}
                      setUpdateQuantity={setUpdateQuantity}
                      idOfCartItem={item.item_id}
                    /> :
                    <AddShoppingCartIcon sx={{ color: 'rgb(168, 16, 46)' }} />
                  }
                </IconButton>
              }
            />
          </ImageListItem>
        );
        
 } )}
      </ImageList>
    </>
  );

}

export default FoodList;