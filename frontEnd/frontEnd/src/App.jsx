import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
//components
import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import RegistrationPage from './pages/registeration/RegistrationPage.jsx';
import AddCart from './pages/add-cart/AddCart.jsx';
import PlaceOrder from './components/place Order/PlaceOrder.jsx';
import AdminDashboard from './pages/admin/admin-dashboard/AdminDashboard.jsx';
import Logout from './components/logout/Logout.jsx';
import OrderHistory from './components/order-history/OrderHistory.jsx';



// Enable sending cookies with each request
axios.defaults.withCredentials = true;


function App() {

  //holds item id that is in the cart
  const [idToAddCart, setIdToAddCart] = useState([]);
  //holds the item id that has added Incre decre icon
  const [itemInCart, setItemInCart] = useState([]);
  //holds customer login true or false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log("isLoggedIn > ", isLoggedIn);

  // holds admin login true or false
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  console.log("isAdminLoggedIn", isAdminLoggedIn);
  console.log("adminId" + localStorage.getItem("adminId"));

  //check session is available, even when page is reload
  useEffect(() => {
    async function checkSession() {
      console.log("inside session");

      try {
        const response = await axios.get("http://localhost:3000/session");
        console.log("res session: ", response.data);
        const backEndResponse = response.data;
        
        // check if both customer and admin logged in
        if (backEndResponse.isLoggedIn && backEndResponse.isAdminLoggedIn) {
          console.log("Both Customer and Admin sessions are available");
          setIsLoggedIn(true);
          setIsAdminLoggedIn(true);
        } 

        //check if only customer logged in
        else if (backEndResponse.isLoggedIn ) {
          console.log("Customer session is available and Admin session is not available");
          setIsLoggedIn(true);
          setIsAdminLoggedIn(false);
        } 

          //check if only admin logged in
        else if (backEndResponse.isAdminLoggedIn) {
          console.log("Admin session is available and Customer session is not available");
          setIsLoggedIn(false);
          setIsAdminLoggedIn(true);
        } 

        //neither customer nor admin logged in
        else {
          console.log("No user (neither Customer nor Admin) is logged in");
          setIsLoggedIn(false);
          setIsAdminLoggedIn(false);
        }
      }
      catch (error) {
        console.error("Error checking session:", error);        
      }
    }

    checkSession();
  }, []);


  //change the cart icon into increment decrement icon
  function addIncrementDecrementIcon(itemId) {
    if (!itemInCart.includes(itemId)) {
      setItemInCart((prev) => [...prev, itemId]);
    }
  }

  //remove increment decrement icon
  function removeIncrementDecrementIcon(itemId) {
    setItemInCart(itemInCart.filter((item) => item !== itemId));
  }

  //add item id of the item that has stored in cart page
  function addToCart(itemId) {
    if (!idToAddCart.includes(itemId)) {
      setIdToAddCart((prevItemID) => [...prevItemID, itemId]);
    }

  }

  //remove item id of the item that has stored in cart page
  function removeItemFromCart(itemId) {
    if (idToAddCart.includes(itemId)) {
      setIdToAddCart(idToAddCart.filter((item) => item !== itemId));
    }
    console.log("idtoaddcart removeitemfromcart");
    console.log(idToAddCart);
  }


  console.log("idtoaddcart  outside");
  console.log(idToAddCart);

  return (
    <div className='app'>
      <Routes>
        <Route path="/"
          element={
            <Home

              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              addToCart={addToCart}
              addIncrementDecrementIcon={addIncrementDecrementIcon}
              itemInCart={itemInCart}
            />
          }
        />

        <Route path="/login"
          element={
            <div className='app-login'>
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setIsAdminLoggedIn={setIsAdminLoggedIn}
              />
            </div>
          }
        />

        <Route path="/register"
          element={
            <div className="app-login">
              <RegistrationPage />
            </div>
          }
        />

        <Route path='/add-cart'
          element={
            <AddCart
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              idToAddCart={idToAddCart}
              removeIncrementDecrementIcon={removeIncrementDecrementIcon}
              removeItemFromCart={removeItemFromCart}
            />
          }
        />

        <Route path="/admin-dashboard"
          element={
            <AdminDashboard isAdminLoggedIn={isAdminLoggedIn} setIsAdminLoggedIn={setIsAdminLoggedIn} />
          }
        />

        <Route path='/logout'
          element={
            <Logout />
          }
        />

        <Route path="/place-order"
          element={
            <PlaceOrder
              custLoggedIn={isLoggedIn}
            />
          }
        />

          <Route path='/order-history'
            element={
              <OrderHistory
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />

      </Routes>
    </div>
  )
}

export default App;
