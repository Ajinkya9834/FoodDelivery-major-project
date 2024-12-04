import React from "react";
import Alert from '@mui/material/Alert';

function InfoAlert(props){

    return(
        <Alert  variant="outlined" severity="info" 
        sx={{
          fontWeight: "bold",
          backgroundColor: "lightblue",
          position: "fixed",
          top: 20, right: 20,
          zIndex: 15,
        }} 
        >
        {props.alertMessage}
      </Alert>
    );
}


export default InfoAlert;