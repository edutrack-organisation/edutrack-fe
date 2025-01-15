import { Button, Box, Stack, Drawer, IconButton } from "@mui/material";
import { theme } from "../theme";
import EduTrackIcon from "../assets/icons/edutrack_icon.png";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { useAuthState } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
    const navigate = useNavigate();

    const [shouldUseDrawerButton, setShouldUseDrawerButon] = useState(window.innerWidth < window.innerHeight);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setShouldUseDrawerButon(window.innerWidth < window.innerHeight);
            if (window.innerWidth >= window.innerHeight) {
                setIsDrawerOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    const handleNavigate = (route: string) => {
        if (isDrawerOpen) {
            setIsDrawerOpen(false);
        }
        navigate(route);
    };

    // The buttons in the menu when user is logged in
    const loggedInMenuItems = [
        <Button
            variant="text"
            sx={buttonTheme}
            key="Home Button"
            onClick={() => handleNavigate("/")}
        >
            Home
        </Button>,
        <Button
            variant="text"
            sx={buttonTheme}
            key="UploadPdf Button"
            onClick={() => handleNavigate("/uploadpdf")}
        >
            Upload PDf
        </Button>,
        <Button
            variant="text"
            sx={buttonTheme}
            key="ViewPdf Button"
            onClick={() => handleNavigate("/viewpdf")}
        >
            View PDf
        </Button>,
        <Button
            variant="text"
            sx={buttonTheme}
            key="UploadScores Button"
            onClick={() => handleNavigate("/uploadstudentscores")}
        >
            Upload Scores
        </Button>,
        <Button
            variant="text"
            sx={buttonTheme}
            key="UploadDifficulty Button"
            onClick={() => handleNavigate("/uploaddifficulty")}
        >
            Upload Difficulty
        </Button>,
    ];
    
    // The buttons in the menu when user is logged out
    const loggedOutMenuItems = [
        <Button
            variant="text"
            sx={buttonTheme}
            key="Home Button"
            onClick={() => handleNavigate("/")}
        >
            Home
        </Button>,
    ];

    // Login and signup buttons
    const loginAndSignup = [
        <Button
            variant="text"
            sx={buttonTheme}
            key="Login Button"
            onClick={() => handleNavigate("/login")}
        >
            Log In
        </Button>,
        <Button 
            variant="text"
            sx={buttonTheme}
            key="Signup Button"
            onClick={() => handleNavigate("/signup")}
        >
            Sign Up
        </Button>,
    ];

    // Logout button
    const logout = [
        <Button 
            variant="text"
            sx={buttonTheme}
            key="Logout Button"
            onClick={() => handleNavigate("/logout")}
        >
            Log out
        </Button>
    ];

    return (
        <Box
            height={"5rem"}
            alignItems={"center"}
            sx={{
                display: "flex",
                flexDirection: "row",
                background: theme.colors.main,
            }}
        >
            {/* Left portion of the Navbar */}
            {shouldUseDrawerButton ? ( // Use drawer with menu items (hides EduTrack icon)
                <>
                    <IconButton sx={{color: theme.colors.secondary}} onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer
                        anchor="top"
                        open={isDrawerOpen}
                        onClose={() => setIsDrawerOpen(false)}
                    >
                        {useAuthState().state != null ? loggedInMenuItems : loggedOutMenuItems}
                    </Drawer>
                </>
            ) : ( // Place all menu items in the nav bar with the EduTrack icon
                <>
                    <IconButton onClick={() => handleNavigate("/")} disableFocusRipple disableRipple>
                        <img
                            src={EduTrackIcon}
                            width={60}
                            height={60}
                            style={{ margin: 10 }}
                        />
                    </IconButton>
                    <Stack direction="row">{useAuthState().state != null ? loggedInMenuItems : loggedOutMenuItems}</Stack>
                </>
            )}
            
            {/* Right portion of the Navbar */}
            {useAuthState()?.state == null ? ( // Check if user is logged in to display the correct menu items
                <Stack direction="row" marginLeft="auto">
                    {loginAndSignup}
                </Stack>
            ) : (
                <Stack direction="row" marginLeft="auto">
                    {logout}
                </Stack>
            )}
        </Box>
    );
};

const buttonTheme = {
    background: theme.colors.main,
    color: theme.colors.secondary,
    margin: 1,
    "&:hover": {
        color: theme.colors.highlight1,
        background: theme.colors.secondary,
    },
};

export default NavBar;
