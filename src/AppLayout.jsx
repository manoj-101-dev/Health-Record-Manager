/* eslint-disable react/prop-types */
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HealthRecordList from "./pages/HealthRecordList";
import CreateHealthRecord from "./components/CreateHealthRecord";
import EditHealthRecord from "./components/EditHealthRecord";

import SignUp from "./components/SignUp";
import Login from "./components/Login";
import NotFound from "./pages/NotFound";

function AppLayout() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/list" element={<HealthRecordList />} />
      <Route path="/create" element={<CreateHealthRecord />} />
      <Route path="/edit/:id" element={<EditHealthRecord />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppLayout;
