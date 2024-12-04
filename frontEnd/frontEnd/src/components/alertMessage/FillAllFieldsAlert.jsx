import React from "react";
import Alert from '@mui/material/Alert';


function FillAllFieldsAlert(props){
    return(
        <Alert variant="outlined" severity="warning" 
        sx={{
            fontWeight: "bold",
            position: "fixed",
            top: 20,
            right: 20,
            backgroundColor: "lightyellow",
            zIndex: 15,
        }} 
        >
         {props.alertMessage}
      </Alert>
    )
}

export default FillAllFieldsAlert;