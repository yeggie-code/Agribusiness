import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Login from "./login";
import Signup from "./signup";
import Home from './home';
import UploadBill from "./uploadBills";
import BillDetail from "./billDetails";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/upload-bill" element={<UploadBill />} />
                <Route path="/bill/:id" element={<BillDetail />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
