import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import UploadPdfPage from "./pages/UploadPdfPage";
import DoneUploadPage from "./pages/DoneUploadPage";
import ViewPdfPage from "./pages/ViewPdfPage";
import { ToastContainer } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material";
import "@mui/material";

declare module "@mui/material/styles" {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        md: true;
        lg: true;
        xl: true;
    }
}

function App() {
    // Custom MUI theme
    const theme = createTheme({
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1800,
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/uploadpdf" element={<UploadPdfPage />} />
                    <Route path="/doneupload" element={<DoneUploadPage />} />
                    <Route path="/viewpdf" element={<ViewPdfPage />} />
                </Routes>
                <ToastContainer />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
