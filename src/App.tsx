import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UploadPDF from "./pages/UploadPdfPage";
import ViewPDF from "./pages/ViewPdfPage";
import NavBar from "./components/navbar";
import DoneUpload from "./pages/DoneUploadPage";

function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/uploadpdf" element={<UploadPDF />} />
                <Route path="/viewpdf" element={<ViewPDF />} />
                <Route path="/doneupload" element={<DoneUpload />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
