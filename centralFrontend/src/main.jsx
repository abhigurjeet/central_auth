
import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { GrantAccess } from './GrantAccess';
import App from './App';

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/grant-access" element={<GrantAccess/>} />
    </Routes>
  </BrowserRouter>
);
