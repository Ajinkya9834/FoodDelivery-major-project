import './index.css';
import App from './App.jsx';
import {BrowserRouter} from "react-router-dom";
import React from "react";
import { createRoot } from 'react-dom/client'; // Correct import for React 18


createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
