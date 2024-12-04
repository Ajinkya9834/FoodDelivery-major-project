import React from "react";
import "./admin-dashboard.css";
import AdminNavBar from "../../../components/admin/admin-navbar/AdminNavBar.jsx";
import AdminSideBar from "../../../components/admin/admin-sidebar/AdminSidebar.jsx";

function AdminDashboard(props){
    const {setIsAdminLoggedIn, isAdminLoggedIn} = props;

        console.log("isAdminLoggedIn.jsx", isAdminLoggedIn);
        
    return(
        <div className="admin-dashboard">
            <section id="admin-dashboard-navbar" >
                <AdminNavBar 
                    isAdminLoggedIn={isAdminLoggedIn} 
                    setIsAdminLoggedIn={setIsAdminLoggedIn} 
                />
            </section>
            <section id="admin-dashboard-sidebar" ><AdminSideBar/></section> 
        </div>
    )
}


export default AdminDashboard;