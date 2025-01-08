import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LandingPage from "./pages/LandingPage";
import UploadPdfPage from "./pages/UploadPdfPage";
import DoneUploadPage from "./pages/DoneUploadPage";
import ViewPdfPage from "./pages/ViewPdfPage";
import UploadStudentScoresPage from "./pages/UploadStudentScoresPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import LogoutPage from "./pages/LogoutPage.tsx";
import { ToastContainer } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material";
import { AuthProvider } from "./context/AuthContext.tsx";
import UploadDifficultyPage from "./pages/UploadDifficultyPage.tsx";

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
        // palette: { // TODO: change the default colors for buttons and such
        //     primary: {
        //         main: "#070708", // Black
        //     },
        //     secondary: {
        //         main: "#FFFAFA", // White
        //     },
        //     background: {
        //         default: "#FFFAFA", // White
        //     },
        // },
    });

    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <BrowserRouter>
                    <NavBar />
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/uploadpdf" element={<UploadPdfPage />} />
                        <Route path="/doneupload" element={<DoneUploadPage />} />
                        <Route path="/viewpdf" element={<ViewPdfPage />} />
                        <Route path="/uploadstudentscores" element={<UploadStudentScoresPage />} />
                        <Route path="/uploaddifficulty" element={<UploadDifficultyPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/logout" element={<LogoutPage />} />
                    </Routes>
                    <ToastContainer />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
