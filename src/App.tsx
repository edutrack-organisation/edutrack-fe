import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import UploadPdfPage from "./pages/UploadPdfPage";
import DoneUploadPage from "./pages/DoneUploadPage";
import ViewPdfPage from "./pages/ViewPdfPage";
import { createTheme, ThemeProvider } from "@mui/material";
import "@mui/material";
import { Toaster } from "react-hot-toast";

declare module "@mui/material/styles" {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        md: true;
        lg: true;
        xl: true;
        lgxl: true;
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
                lgxl: 1300,
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

                <Toaster position="top-right" reverseOrder={false} />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
