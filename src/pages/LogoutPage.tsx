import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants/constants";

const LogoutPage = () => {
    const navigate = useNavigate();
    const { logout } = useAuthContext();

    const [isLoggedOut, setIsLoggedOut] = useState<boolean | null>(false);

    useEffect(() => {
        // Simulate a logout process (involving API)
        setTimeout(() => {
            setIsLoggedOut(true);
            logout();
        }, 1500);
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: COLORS.WHITE,
                padding: "2rem",
            }}
        >
            {isLoggedOut ? (
                <>
                    <Typography variant="h5">
                        Successfully logged out!
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ marginTop: "1rem", }}
                        onClick={() => navigate("/")} // In case user needs to logout manually
                    >
                        Back to homepage
                    </Button>
                </>
            ) : (
                <>
                    <CircularProgress sx={{ marginBottom: "1rem" }} />
                    <Typography variant="h6" gutterBottom>
                        Logging out...
                    </Typography>
                    <Typography variant="body1">
                        Please wait while we log you out securely.
                    </Typography>
                </>
            )}
            
        </Box>
    );
};

export default LogoutPage;
