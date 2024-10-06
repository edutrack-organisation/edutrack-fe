import { Button, Box } from "@mui/material";
import { theme } from "../theme";
import EduTrackIcon from "../assets/icons/EduTrackIcon.png";

const buttonTheme = {
    background: theme.colors.main,
    color: theme.colors.secondary,
    '&:hover': {
        color: theme.colors.highlight1,
        background: theme.colors.secondary,
    },
};


const NavBar = () => {
    return (
        <Box
            height={"5rem"}
            display={"flex"}
            alignItems={"center"}
            sx={{
                background: theme.colors.main,
                flexDirection: "row",
                flex: 1,
            }}
            boxShadow={2}
        >
            <a href="./">
                <img
                    src={EduTrackIcon}
                    width={60}
                    height={60}
                    style={{ margin: 10 }}
                />
            </a>
            <Button
                variant="text"
                sx={{ ...buttonTheme, margin: 1 }}
                href="/"
            >
                Home
            </Button>
            <Button
                variant="text"
                sx={{ ...buttonTheme, margin: 1 }}
                href="/uploadpdf"
            >
                Upload PDf
            </Button>
            <Button
                variant="text"
                sx={{ ...buttonTheme, margin: 1, marginLeft: "auto" }}
            >
                Log In
            </Button>
            <Button
                variant="text"
                sx={{ ...buttonTheme, margin: 1 }}
            >
                Sign Up
            </Button>
        </Box>
    );
};

export default NavBar;
