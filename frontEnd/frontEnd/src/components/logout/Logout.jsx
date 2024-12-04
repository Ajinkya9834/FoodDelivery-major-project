import axios from "axios";
import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Logout(){
    console.log("logout component");
    
    const adminRole = useLocation().state?.adminRole;
    console.log('adminRole in logout > ' + adminRole);
    const custRole = useLocation().state?.custRole;
    console.log('custRole in logout > ' + custRole);
    
    const navigate = useNavigate();


    //logout according to the role 
    useEffect(() => {
        async function handleLogout(){

            let role;
            //check if on  the roles are available otherwise null
            if (adminRole) {
                role = "admin"
            } else if(custRole){
                role = "customer"
            }else{
                role =  null;
            }
            
            
            try {
              const response = await axios.post("http://localhost:3000/logout", {
                role: role, 
              });
              console.log("response.data (logout.jsx)", response.data);
                // localStorage.clear(); // clear any stored user data
                
                if (adminRole === "admin") {
                    localStorage.removeItem("adminId");
                    console.log("admin id(logout.jsx)", localStorage.getItem("adminId"));
                    navigate("/login");

                } else if(custRole === "customer"){
                    localStorage.removeItem("custId");
                    console.log("custid id(logout.jsx)", localStorage.getItem("custId"));
                    navigate("/");
                }
                console.log("admin id(logout.jsx)", localStorage.getItem("adminId"));
                console.log("custid id(logout.jsx)", localStorage.getItem("custId"));

            } catch (error) {
                console.error("Error logging out", error);
            }
        }


        handleLogout();
    }, []);
    
    return null; 
    
}

export default Logout;