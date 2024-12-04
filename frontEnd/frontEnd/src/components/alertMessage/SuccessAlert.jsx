import React from "react";
import Alert from '@mui/material/Alert';


function SuccessAlert(props) {

  return (
    <Alert variant="outlined" severity="success" sx={{
      fontWeight: "bold",
      position: "fixed",
      top: 20,
      right: 20,
      backgroundColor: "lightgreen",
      zIndex: 15,
    }} >
      {props.alertMessage}
    </Alert>
  )

}


export default SuccessAlert;