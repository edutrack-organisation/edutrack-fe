import MenuIcon from "@mui/icons-material/Menu";
import { Box, Button, Drawer, IconButton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EduTrackIcon from "../assets/icons/edutrack_icon.png";
import { COLORS, USERID } from "../constants/constants";
import { useAuthContext } from "../context/AuthContext";

const NavBar = () => {
    const navigate = useNavigate();
    const auth = useAuthContext();

    // User a drawer to keep menu Items when page width is small
    const [shouldUseDrawerButton, setShouldUseDrawerButon] = useState(window.innerWidth < window.innerHeight);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        // Extracting local userId
        // TODO: add a session timeout
        const userId = localStorage.getItem(USERID);
        if (userId != null) {
            auth.setUserId(+userId);
        }

        // Handling the use of drawer on resize
        const handleResize = () => {
            setShouldUseDrawerButon(window.innerWidth < window.innerHeight);
            if (window.innerWidth >= window.innerHeight) {
                setIsDrawerOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);

        // Removing listeners on exit
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    // Close drawer during redirection
    const handleNavigate = (route: string) => {
        if (isDrawerOpen) {
            setIsDrawerOpen(false);
        }
        navigate(route);
    };

    // List of all menu items
    const menuItems = {
        homeIcon:
            <IconButton onClick={() => handleNavigate("/")} disableFocusRipple disableRipple>
                <img
                    src={EduTrackIcon}
                    width={60}
                    height={60}
                    style={{ margin: 10 }}
                />
            </IconButton>,

        home:
            <Button
                variant="text"
                sx={buttonStyle}
                key="Home Button"
                onClick={() => handleNavigate("/")}
            >
                Home
            </Button>,

        courseSelect:
            <Button
                variant="text"
                sx={buttonStyle}
                key="CourseSelect Button"
                onClick={() => handleNavigate("/courses")}
            >
                Course Select
            </Button>,

        uploadPdf:
            <Button
                variant="text"
                sx={buttonStyle}
                key="UploadPdf Button"
                onClick={() => handleNavigate("/uploadpdf")}
            >
                Upload PDf
            </Button>,

        viewPdf:
            <Button
                variant="text"
                sx={buttonStyle}
                key="ViewPdf Button"
                onClick={() => handleNavigate("/viewpdf")}
            >
                View PDf
            </Button>,

        uploadScores: // To be removed
            <Button
                variant="text"
                sx={buttonStyle}
                key="UploadScores Button"
                onClick={() => handleNavigate("/uploadstudentscores")}
            >
                Upload Scores
            </Button>,

        uploadDifficulty: // To be removed
            <Button
                variant="text"
                sx={buttonStyle}
                key="UploadDifficulty Button"
                onClick={() => handleNavigate("/uploaddifficulty")}
            >
                Upload Difficulty
            </Button>,

        login:
            <Button
                variant="text"
                sx={buttonStyle}
                key="Login Button"
                onClick={() => handleNavigate("/login")}
            >
                Log In
            </Button>,

        logout:
            <Button
                variant="text"
                sx={buttonStyle}
                key="Logout Button"
                onClick={() => handleNavigate("/logout")}
            >
                Log out
            </Button>,

        signUp:
            <Button
                variant="text"
                sx={buttonStyle}
                key="Signup Button"
                onClick={() => handleNavigate("/signup")}
            >
                Sign Up
            </Button>,
    };

    // The buttons in the menu when user is logged in
    const loggedInMenuItems = [
        menuItems.home,
        menuItems.courseSelect,
        menuItems.uploadPdf,
        menuItems.viewPdf,
        menuItems.uploadScores,
        menuItems.uploadDifficulty,
    ];

    // The buttons in the menu when user is logged out
    const loggedOutMenuItems = [
        menuItems.home,
    ];

    // Login and signup buttons
    const loginAndSignup = [
        menuItems.login,
        menuItems.signUp,
    ];

    // Logout button
    const logout = [
        menuItems.logout,
    ];

    return (
        <Box sx={containerStyle}>
            {/* Left portion of the Navbar */}
            {shouldUseDrawerButton ? ( // Use drawer with menu items (hides EduTrack icon)
                <>
                    <IconButton sx={{ color: COLORS.WHITE }} onClick={() => setIsDrawerOpen(!isDrawerOpen)} >
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="top" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} >
                        {auth.userId != null ? loggedInMenuItems : loggedOutMenuItems}
                    </Drawer>
                </>
            ) : ( // Place all menu items in the nav bar with the EduTrack icon
                <>
                    {menuItems.homeIcon}
                    <Stack direction="row">{auth.userId != null ? loggedInMenuItems : loggedOutMenuItems}</Stack>
                </>
            )}

            {/* Right portion of the Navbar */}
            {auth.userId == null ? ( // Check if user is logged in to display the correct menu items
                <Stack direction="row" marginLeft="auto">{loginAndSignup}</Stack>
            ) : (
                <Stack direction="row" marginLeft="auto">{logout}</Stack>
            )}
        </Box>
    );
};

const buttonStyle = {
    background: COLORS.BLACK,
    color: COLORS.WHITE,
    margin: 1,
    "&:hover": {
        color: COLORS.HIGHLIGHT,
        background: COLORS.WHITE,
    },
};

const containerStyle = {
    height: '5rem',
    width: '100%',
    alignItems: 'center',
    display: "flex",
    flexDirection: "row",
    background: COLORS.BLACK,

    // Keep NavBar in fixed position above screen
    position: 'fixed',
    zIndex: 3,
    boxShadow: 2,
};

export default NavBar;
