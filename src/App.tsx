import { Box, createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import NavBar from "./components/NavBar";
import { COLORS } from "./constants/constants.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import CourseSelectPage from "./pages/CourseSelectPage.tsx";
import DoneUploadPage from "./pages/DoneUploadPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage.tsx";
import LogoutPage from "./pages/LogoutPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import UploadDifficultyPage from "./pages/UploadDifficultyPage.tsx";
import UploadPdfPage from "./pages/UploadPdfPage";
import UploadStudentScoresPage from "./pages/UploadStudentScoresPage.tsx";
import ViewPapersPage from "./pages/ViewPapersPage.tsx";
import ViewPdfPage from "./pages/ViewPdfPage";

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
            <AuthProvider>
                <BrowserRouter>
                    <NavBar />
                    {/* Margin used to place NavBar in fixed position */}
                    <Box sx={{ display: "flex", marginTop: "5rem", minHeight: "calc(100vh - 5rem)", background: COLORS.WHITE }} >
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/uploadpdf" element={<UploadPdfPage />} />
                            <Route path="/doneupload" element={<DoneUploadPage />} />
                            <Route path="/courses" element={<CourseSelectPage />} />
                            <Route path="/courses/:courseId" element={<ViewPapersPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/logout" element={<LogoutPage />} />
                            {/* Fallback page */}
                            <Route path="*" element={<LandingPage />} />
                        </Routes>
                    </Box>
                    <ToastContainer />
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
