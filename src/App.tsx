import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import UploadPdfPage from "./pages/UploadPdfPage";
import DoneUploadPage from "./pages/DoneUploadPage";
import ViewPdfPage from "./pages/ViewPdfPage";

function App() {
    return (
        <BrowserRouter>
            <NavBar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/uploadpdf" element={<UploadPdfPage />} />
                <Route path="/doneupload" element={<DoneUploadPage />} />
                <Route path="/viewpdf" element={<ViewPdfPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
