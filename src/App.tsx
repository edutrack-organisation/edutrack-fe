import "@mui/material";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import UploadPdfPage from "./pages/UploadPdfPage";
import ViewPapersPage from "./pages/ViewPapersPage.tsx";
import KnowledgeGraphPage from "./pages/KnowledgeGraphPage.tsx";
import GeneratePaper from "./pages/GeneratePaper";
import DashboardPage from "./pages/DashboardPage";

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
            <AuthProvider>
                <BrowserRouter>
                    <NavBar />
                    {/* Margin used to place NavBar in fixed position */}
                    <Box sx={{ display: "flex", marginTop: "5rem", minHeight: "calc(100vh - 5rem)", background: COLORS.WHITE }} >
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/courses/:courseId/uploadpdf" element={<UploadPdfPage />} />
                            <Route path="/doneupload" element={<DoneUploadPage />} />
                            <Route path="/courses" element={<CourseSelectPage />} />
                            <Route path="/courses/:courseId" element={<ViewPapersPage />} />
                            <Route path="/courses/:courseId/knowledgegraph" element={<KnowledgeGraphPage />} />

                            <Route path="/signup" element={<SignupPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/logout" element={<LogoutPage />} />
                            {/* Fallback page */}
                            <Route path="*" element={<LandingPage />} />
                            <Route path="/generate" element={<GeneratePaper />} />
                            <Route path="/dashboard" element={<DashboardPage />} />
                        </Routes>
                        <Toaster position="top-right" reverseOrder={false} />
                    </Box>
                </BrowserRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
