import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import cors from "cors";
import env from "dotenv";
import bcrypt, { hash } from "bcrypt";
import session from "express-session";
import sendPaymentSuccessEmail from "./email-service/emailService.js";
import multer from "multer";
import qrCodeGenerator from "./QRcode-generator/QrCode.js";



//===========================================================


// 400 for bad requests (e.g., missing fields).
// 401 for unauthorized access (e.g., invalid credentials).
// 404 not found
// 200 for successful logins.
// 201 indicates that an HTTP request was successful and a new resource was created
// 500 for server errors.


//===========================================================


const app = express();
//port number on which server will run
const PORT = 3000;
//numbers of salt round
const saltRound = 10;
//env configuration
env.config();
//used if FE and BE run on different port
app.use(cors({
    origin: 'http://localhost:5173', // allow the frontend origin
    credentials: true,// allow cookies and credentials to be sent with requests
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//session creation
app.use(session({
    secret: process.env.SESSION_SECRET, // a strong secret
    resave: false, // prevent unnecessary session resaving
    saveUninitialized: false, // don't save empty sessions
    cookie: {
        maxAge: 3600000, // 1-hour session lifespan
    }
}));

// database connectivity
const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

// qrcode generator
qrCodeGenerator();

// authenticates a user (admin or customer) based on email, password, and role
app.post("/login", async (req, res) => {
    console.log(req.body);
    const { email, password, role } = req.body;
    try {
        //check for role admin or customer
        if (role === "admin") {
            const checkEmailExist = await db.query("SELECT * FROM admins_registered WHERE email = $1", [email]);
            const user = checkEmailExist.rows[0];

            //check email existance
            if (checkEmailExist.rows.length > 0) {
                const hashedPassword = user.password;

                //compare password with hashedpassword
                const isPasswordValid = await bcrypt.compare(password, hashedPassword);
                console.log("ispassword", isPasswordValid);

                //check password vaildity
                if (isPasswordValid) {
                    // stored session data for an authenticated user

                    req.session.isAdminLoggedIn = true;
                    // req.session.username = email;

                    return res.status(200).json({ success: true, adminId: user.admin_id })
                } else {
                    return res.status(401).json({ success: false, message: "Invalid credentials" });
                }
            } else {
                return res.status(404).json({ success: false, message: "Email not found" });
            }

        } else if (role === "customer") {
            const checkEmailExist = await db.query("SELECT * FROM customer_registered WHERE email = $1", [email]);
            const user = checkEmailExist.rows[0];

            if (checkEmailExist.rows.length > 0) {
                const hashedPassword = user.password;
                const isPasswordValid = await bcrypt.compare(password, hashedPassword);
                console.log("ispassword", isPasswordValid);

                if (isPasswordValid) {
                    req.session.isLoggedIn = true;
                    // req.session.username = email;
                    return res.status(200).json({ success: true, custId: user.customer_id });

                } else {
                    return res.status(401).json({ success: false, message: "Invalid credentials" });
                }

            } else {
                return res.status(404).json({ success: false, message: "Email not found" });
            }
        }
    } catch (error) {
        console.error("Error in login", error);
        return res.status(404).json({ success: false, message: "Error in login" });
    }

});

// user registration based on role (admin or customer)
app.post("/register", async (req, res) => {

    const role = req.body.role;
    try {
        if (role === "admin") {
            const {
                adminId,
                name,
                email,
                password,
                confirmPassword,
                phoneNumber,
                address,
                securityQuestion,
                securityAnswer,
                restaurantName,
                restaurantAddress,
                restaurantContactNumber,
            } = req.body;

            // Basic validation
            if (!name || !email || !password || !confirmPassword || !phoneNumber || !address || !securityQuestion ||
                !securityAnswer || !restaurantName || !restaurantAddress || !restaurantContactNumber) {
                return res.status(400).json({ success: false, message: "All fields are required." });
            } else if (password !== confirmPassword) {
                return res.status(400).json({ success: false, message: "Password is wrong." });
            }

            console.log("req.body > ", req.body);
            // check registration of the admin 
            const checkResult = await db.query("SELECT * FROM admins_registered WHERE email = $1 ", [email]);
            if (checkResult.rows.length > 0) {
                return res.status(400).json({ success: false, message: "Admin already exists, Try logging in" });
            }

            // create encryption of the password
            const hash = await bcrypt.hash(password, saltRound);
            // insert into admins_registered
            const query = `
            INSERT INTO admins_registered (
            admin_id, name, email, password, phone_number, address,
            security_question, security_answer, restaurant_name, 
            restaurant_address, restaurant_contact_number
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING admin_id;
        `;
            //values to br inserted into admins_registered
            const values = [
                adminId, name, email, hash, phoneNumber, address,
                securityQuestion, securityAnswer, restaurantName,
                restaurantAddress, restaurantContactNumber,
            ];
            const result = await db.query(query, values);
            return res.status(201).json({ success: true, adminId: result.rows[0].admin_id });

        } else if (role === "customer") {
            console.log("result > ", req.body);

            const {
                custId,
                name,
                email,
                password,
                confirmPassword,
                phoneNumber,
                address,
                securityQuestion,
                securityAnswer,
            } = req.body;

            // Basic validation
            if (!name || !email || !password || !confirmPassword || !phoneNumber || !address || !securityQuestion ||
                !securityAnswer) {
                return res.status(400).json({ success: false, message: "All fields are required." });
            } else if (password !== confirmPassword) {
                return res.status(400).json({ success: false, message: "Password is wrong." });
            }

            const checkResult = await db.query("SELECT * FROM customer_registered WHERE email = $1", [email]);
            if (checkResult.rows.length > 0) {
                return res.status(400).json({ success: false, message: "Customer already exists, Try logging in" });
            }

            // create encryption of the password
            const hash = await bcrypt.hash(password, saltRound);

            //insert into customer_registered
            const query = `
                INSERT INTO customer_registered (
                  customer_id, name, email, password, phone_number, 
                  address, security_question, security_answer
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING customer_id;
            `;

            //values to be inserted into admins_registered
            const values = [custId, name, email,
                hash,
                phoneNumber, address, securityQuestion,
                securityAnswer,
            ];

            const result = await db.query(query, values);
            return res.status(201).json({ success: true, custId: result.rows[0].customer_id });
        }

    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({ success: false, message: "Registration failed" });
    }
});

//Logout.jsx
//user logout based on role (customer or admin)
app.post("/logout", (req, res) => {
    try {
        const { role } = req.body;
        console.log("/logout", role);

        //check if active session available
        if (!req.session) {
            return res.status(400).json({ success: true, message: "No active sesssion found" });
        }

        //clear the session flags according the role
        if (req.session.isLoggedIn && role === "customer") {
            // customer logout
            console.log("cust /logout");

            req.session.isLoggedIn = false;
            // return res.status(200).json({isLoggedIn: true, isAdminLoggedIn: false, message: "Customer has logged out successfully"});
        } else if (req.session.isAdminLoggedIn && role === "admin") {
            // admin logout
            console.log("admin /logout");

            req.session.isAdminLoggedIn = false;
            // return res.status(200).json({isAdminLoggedIn: true, isLoggedIn: false, message: "Admin has logges out"});
        }

        //check if both roles are logged out
        if (!req.session.isLoggedIn && !req.session.isAdminLoggedIn) {
            // it will destroy the session completely
            req.session.destroy((err) => {
                if (err) {
                    console.error("Error destroying session:", err);
                    return res.status(500).json({ success: false, message: "Error destroying session" });
                }
                return res.status(200).json({ success: true, message: "Session destroyed completely" });
            });
        } else {
            return res.status(200).json({ success: true, message: `${role} has successfully logged out.` });
        }

    } catch (error) {
        console.error("An error during logout:", error);
        return res.status(500).json({ success: false, message: "Error in logout" });
    }
});

// App.jsx
//check the session status for both customer and admin
app.get("/session", (req, res) => {
    // console.log("=====================================================");    

    //both customer and admin are logged in
    if (req.session.isLoggedIn && req.session.isAdminLoggedIn) {
        console.log("both logged in ");
        return res.status(200).json({ success: true, isLoggedIn: true, isAdminLoggedIn: true, });
    }
    //check if only the customer session is active
    if (req.session.isLoggedIn) {
        console.log("custmer logged in ");
        return res.status(200).json({ success: true, isLoggedIn: true, isAdminLoggedIn: false });
    }
    //check if only the admin session is active
    if (req.session.isAdminLoggedIn) {
        console.log("admin logged in ");
        return res.status(200).json({ success: true, isLoggedIn: false, isAdminLoggedIn: true, });
    }
    //if neither session is active
    return res.status(401).json({
        success: false,
        isLoggedIn: false,
        isAdminLoggedIn: false,
        message: "No user (neither Customer nor Admin) is logged in."
    });

});

//FoodList.jsx
//fetch the list of all available food items
app.get("/get-food-list", async (req, res) => {
    try {

        const result = await db.query("SELECT * FROM food_items");

        // console.log(result.rows);
        if (result.rows.length === 0) {
            //no food items available
            return res.status(404).json({ success: false, food_list: "Food items are not available", });
        } else {
            //successfully fetched food items
            return res.status(200).json({ success: true, food_list: result.rows });
        }
    } catch (error) {
        console.error("Error occured in fetching food list", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred", });
    }
});

//FoodList.jsx
//save an item to the customer's cart (new item or update quantity)
app.post("/save-item-to-cart", async (req, res) => {
    try {
        console.log(req.body);
        const { item_id, custId, quantity } = req.body;

        if (!item_id || item_id === "" || !custId || custId === "" || !quantity || quantity === "") {
            return res.status(400).json({ success: false, message: "Item Id, Customer ID and quantity is missing" });
        }

        //check if the item already exists in the cart for the customer
        const result = await db.query(
            `SELECT * FROM cart_items WHERE custId = $1 and item_id = $2`, [custId, item_id]
        );

        if (result.rows.length === 0) {
            // insert new item into the cart
            const insertedItem = await db.query(
                `INSERT INTO cart_items(custId, item_id, quantity)
                values($1, $2, $3) RETURNING item_id, quantity `, [custId, item_id, quantity]
            );
            console.log(insertedItem);

            // return success, message and inserted item_id and quantity of item  
            if (insertedItem.rows.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Item successfully saved to cart",
                    data: insertedItem.rows[0],
                });
            } else {
                return res.status(500).json({ success: false, message: "Failed to insert item into cart", });
            }

        } else {
            // update the quantity of the existing item in the cart
            const updateQuantity = await db.query(
                `UPDATE cart_items SET quantity = $1 
                WHERE custId = $2 and item_id = $3 RETURNING item_id, quantity `, [quantity, custId, item_id]
            );
            console.log(updateQuantity);
            // return success, message and updated item_id and quantity of item
            if (updateQuantity.rows.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Item quantity successfully updated in cart",
                    data: updateQuantity.rows[0],
                });
            } else {
                return res.status(500).json({ success: false, message: "Failed to update item quantity in cart", });
            }

        }

    } catch (error) {
        console.error("Error occured in saving item in the cart", error);
        return res.status(500).json({ success: false, message: "server error in saving item into cart" });
    }
});

//ListOfCartItem.jsx
// fetch all the cart items for a specific cust id
app.get("/get-cart-items", async (req, res) => {
    try {
        const custId = req.query.custId;
        //check if customer(user) has loggedIn
        if (!custId || custId === "null") {
            return res.status(401).json({ success: false, message: "please login.", });
        } else {
            //fetch all the item details that are added in the cart for the given custId
            const result = await db.query(
                `SELECT f.item_id, f.image, f.name, f.price, c.quantity
                FROM cart_items c 
                JOIN food_items f ON c.item_id = f.item_id
                WHERE c.custId = $1
            `, [custId]);
            console.log(result.rows[0].image)
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: "No items in the cart for this customer(user)." });
            } else {
                return res.status(200).json({ success: true, message: `Cart items has fetched for this custId ${custId}.`, cartItems: result.rows, });
            }
        }
    } catch (error) {
        console.error("Error occured fetching cart items.", error);
        return res.status(500).json({ success: false, message: "Error occured fetching cart items." });
    }
});

//FoodList.jsx
//get the quantity of items in the cart 
app.get("/get-quantity-of-item", async (req, res) => {
    try {
        const custId = req.query.custId;

        const quantityOfItems = await db.query(`SELECT item_id, quantity  FROM cart_items  WHERE custid = $1 `, [custId]);

        if (quantityOfItems.rows.length > 0) {
            //convert an array of object into an object
            const quantityObject = quantityOfItems.rows.reduce((acc, item) => {
                acc[item.item_id] = item.quantity;
                return acc;
            }, {});

            return res.status(200).json({ success: true, quantity: quantityObject, });
        } else {
            return res.status(404).json({ success: false, message: "Customer has not registered" });
        }

    } catch (error) {
        console.error();
        return res.status(500).json({ success: false, message: "Error in getting updated quantity" });
    }
});

//ListOfCartItem.jsx
//delete an item from the cart 
app.delete("/delete-item-from-cart", async (req, res) => {
    try {
        const { custId, item_id } = req.query;
        //checks if item is available in the cart
        const result = await db.query("SELECT * FROM cart_items WHERE custid = $1 and item_id = $2 ", [custId, item_id]);

        if (result.rows.length > 0) {
            // delete item from the cart 
            const deletedItemId = await db.query("DELETE FROM cart_items WHERE custid = $1 and item_id = $2 RETURNING item_id", [custId, item_id]);
            return res.status(200).json({
                success: true,
                message: "item deleted from ",
                //send an id of the deleted item
                deletedItemId: deletedItemId.rows[0].item_id,
            });
        } else {
            return res.status(404).json({ success: false, message: "item not found" })
        }

    } catch (error) {
        console.error("Error in deleting an item from cart", error);
        return res.status(500).json({ success: true, message: "Error in deleting item from cart" });
    }
});

//PlaceOrder.jsx
//insert order  details in the place_orders table
app.post("/place-order", async (req, res) => {
    try {
        const { orderId, custId, custName, email, phoneNumber, addressToDeliver, totalOrderPrice, itemsDetailsJson } = req.body;
        console.log(req.body);
        console.log(typeof (itemsDetailsJson), "******************************************");

        //insert order  details in the place_orders table
        const result = await db.query(`
            INSERT INTO place_orders (order_id, cust_id, customer_name, email, contact_number, items, 
            total_order_price, delivery_address ) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `, [orderId, custId, custName, email, phoneNumber, itemsDetailsJson, totalOrderPrice, addressToDeliver]);

        // check if the order was inserted successfully
        if (result.rows[0]) {
            // calls email service function 
            await sendPaymentSuccessEmail(email, orderId, totalOrderPrice);
            return res.status(200).json({ success: true, order: result.rows[0] });
        } else {
            return res.status(401).json({ success: false, message: "Not able to place order" });
        }

    } catch (error) {
        console.error("Error occurred while placing the order");
        return res.status(500).json({ success: false, message: "Error occurred while placing the order" });

    }
});

//PlaceOrder.jsx
//clear cart for the given cust id after successfull payment 
app.delete("/make-cart-empty", async (req, res) => {
    try {
        const { custId } = req.query;
        if (!custId || custId === "") {
            return res.status(400).json({ success: false, message: "Customer ID is required." });
        }
        // check for items in the cart for the given custId 
        const checkCart = await db.query("SELECT * FROM cart_items WHERE custid = $1", [custId]);

        //check if items are available 
        if (checkCart.rows.length === 0) {
            return res.status(404).json({ success: false, message: `Customer Id ${custId} not found. No items in the cart has added to customer Id: ${custId}` });
        } else {
            // delete item from the cart after successfull payment
            const result = await db.query("DELETE FROM cart_items WHERE custid = $1", [custId]);
            //check if deletion was successful
            //(rowCount) Prints the number of rows deleted
            if (result.rowCount === 0) {
                return res.status(500).json({ success: false, message: `Failed to delete items from the cart for Customer ID: ${custId}` });
            } else {
                return res.status(200).json({ success: true, message: `Cart successfully emptied for Customer ID: ${custId}` });
            }
        }
    } catch (error) {
        console.error("An error occurred while attempting to empty the cart.");

    }
});

//ListItems.jsx
// fetch all items to display it on menu table
app.get("/admin-items-list", async (req, res) => {
    try {
        // fetch all items from the food_items table
        const result = await db.query("SELECT  * FROM food_items ORDER BY item_id DESC");

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No items available." });
        }
        // successfully fetched items
        return res.status(200).json({ success: true, message: "Succefully fetched all items.", items: result.rows })


    } catch (error) {
        console.error("An error occured in fetching food items", error);
        return res.status(500).json({ success: false, message: "An error occured in fetching food items" });
    }
});

//Listitems.jsx
//delete item from item-menu page for the given item id
app.delete("/delete-admin-item-from-menu", async (req, res) => {
    try {
        const { itemId } = req.query;
        console.log(itemId);

        //delete item from item-menu page for the given item id
        const result = await db.query("DELETE FROM food_items WHERE item_id = $1", [itemId]);

        //check if no item found
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: `item of ID ${itemId} not found.` });
        }
        // success message for deleteling item 
        return res.status(200).json({ success: true, message: `item of ID ${itemId} successfully deleted` });

    } catch (error) {
        console.error("An error occured in deleting item.", error);
        return res.status(500).json({ success: false, message: "An error occured in deleting item." });
    }
})

//orders.jsx
//gets all the orders details in the admin orders pages
app.get("/get-admin-order-details", async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, customer_name, order_id, cust_id, contact_number, 
            total_order_price, delivery_address, items, order_status  
            FROM place_orders
            ORDER BY id DESC
        `);
        console.log(typeof (result.rows[0].order_status), "--------------------");
        console.log(result.rows[0].items, "<<<<<<<<<<<<<<<<<<<<<<");

        // check if no rows were returned
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No order found." });
        }

        // return all order details
        return res.status(200).json({ success: true, orderDetails: result.rows });


    } catch (error) {
        console.error("An error in fetching order details", error);
        return res.status(500).json({ success: false, message: "An error in fetching order details" });
    }
});

//order.jsx
//update order delivery status
app.post("/update-order-delivery-status", async (req, res) => {
    try {
        const { order_id, orderDeliveryStatus } = req.body;

        //update order delivery status
        const result = await db.query(
            `UPDATE place_orders
            SET order_status = $1
            WHERE order_id = $2
            `, [orderDeliveryStatus, order_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: `No order has placed for order ID: ${order_id}.` });
        }

        return res.status(200).json({ success: true, message: `Order delivery status has updated for order Id: ${order_id}.` });

    } catch (error) {
        console.error("An errro occured in updating order delivery status", error);
        return res.status(500).json({ success: false, message: 'Server error in updating order status' });
    }
});



//determine where the file should be stored.
const storage = multer.diskStorage({
    // location where to store image file
    destination: (req, file, cb) => {
        cb(null, "public/image");
    },
    // unique file name
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" + file.originalname);
    },
})

//initialize multer
const upload = multer({ storage });

//AddItem.jsx
// save all the detials of the items
app.post("/add-items", upload.single("itemImage"), async (req, res) => {
    try {

        const { itemName, itemDescription, itemCategory, itemPrice } = req.body;
        const itemImage = req.file.path ? `/image/` + req.file.filename : null;
        //check if empty fields
        if (!itemImage || !itemName || !itemPrice || !itemCategory || !itemDescription) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        console.log(req.body);
        console.log(req.file);

        //save details pof the item
        const result = await db.query(`
            INSERT INTO food_items(image, name, price, category, description)
            VALUES ($1, $2, $3, $4, $5)
        `, [itemImage, itemName, itemPrice, itemCategory, itemDescription]);

        console.log(result);

        return res.status(200).json({ success: true, message: "Image and its details have saved." });

    } catch (error) {
        console.error("Error occured in add item.");
        return res.status(500).json({ success: false, message: "Error occured in adding item." });
    }
});

//OrderHistory.jsx
//fetch all order history details
app.get("/get-order-history", async (req, res) => {
    try {
        const custId = req.query.custId;
        console.log("custId >>>>>>>>>>", custId);
        const query =
        `SELECT 
        po.order_id,
        po.payment_at,
        po.total_order_price,
        po.order_status AS delivery_status,
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'item_id', (item_details->>'item_id')::INT,
                'item_name', fi.name,
                'item_quantity', item_details->>'quantity',
                'item_image', fi.image
            )
        ) AS items
    FROM 
        place_orders po
    CROSS JOIN LATERAL 
        jsonb_array_elements(po.items) AS item_details
    JOIN 
        food_items fi
    ON 
        (item_details->>'item_id')::INT = fi.item_id
    WHERE 
        po.cust_id = $1
    GROUP BY 
        po.order_id, po.payment_at, po.total_order_price, po.order_status
    ORDER BY 
        po.order_id DESC
`;

        const result = await db.query(query, [custId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: `No orders found for this cust id: ${custId}.` });
        }

        return res.status(200).json({ success: true, history: result.rows });

    } catch (error) {
        console.error("An error occured in fetch order history.", error);
        return res.status(500).json({ success: false, message: "An error occured in fetch order history." })
    }
});


//Navbar.jsx
//fetch the profile name of the given customer id
app.get("/get-profile-name", async(req, res)=>{
    try{
        const {custId} = req.query;

        //get the profile name of the one who has logged in 
        const result = await db.query(`
            SELECT name FROM customer_registered
            WHERE customer_id = $1    
        `, [custId]);
            
        if (result.rows.length === 0) {
            return res.status(404).json({success: true, message: "Profile name not found, may user have not registered."});
        } 
        
        return res.status(200).json({success: true, profileName: result.rows[0].name});

    }catch(error){
        console.error("An errro occured in fetching profile name of the customer.", error);
        return res.status(500).json({success: false, message: "An error occured in fetching profile name of the customer."});
    }
});

//AdminNavBar.jsx
//fetch the admin profile name of the given admin id
app.get("/get-admin-profile-name", async (req,res)=>{
    try {
        const {adminId} = req.query;
        const result = await db.query("SELECT name FROM admins_registered WHERE admin_id = $1", [adminId]);

        if (result.rows.length === 0) {
            return res.status(404).json({success: false, 
                message: "Admin profile name not found, may user have not registered."
            });
        }

        return res.status(200).json({success: true, adminProfileName: result.rows[0].name});

    } catch (error) {
        console.error("An error occured in fetching admin profile name for the given admin id", error);
        return res.status(500).json({success: false, 
            message: "An error occured in fetching admin profile name for the given admin id"
        });
    }
});


app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);

});

