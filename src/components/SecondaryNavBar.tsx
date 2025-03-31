import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { COLORS } from "../constants/constants";

const SecondaryNavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [courseId, setCourseId] = useState<string | undefined>(null);

    useEffect(() => {
        // Extract courseId from the path
        const pathSegments = location.pathname.split('/');
        const courseIdIndex = pathSegments.indexOf('courses') + 1;
        if (courseIdIndex > 0 && pathSegments.length > courseIdIndex) {
            setCourseId(pathSegments[courseIdIndex]);
        } else {
            setCourseId(null);
        }
    }, [location]);

    const handleNavigate = (route: string) => {
        navigate(route);
    };

    return (
        <Box sx={secondaryNavBarContainerStyle}>
            <IconButton sx={{ color: COLORS.WHITE }} onClick={() => handleNavigate("/courses")}>
                <ArrowBackIcon />
            </IconButton>
            <Stack direction="row">
                {courseId && (
                    <>
                        <Button
                            variant="text"
                            sx={buttonStyle}
                            onClick={() => handleNavigate(`/courses/${courseId}`)}
                        >
                            View Papers
                        </Button>
                        <Button
                            variant="text"
                            sx={buttonStyle}
                            onClick={() => handleNavigate(`/courses/${courseId}/uploadpdf`)}
                        >
                            Upload PDF
                        </Button>
                        <Button
                            variant="text"
                            sx={buttonStyle}
                            onClick={() => handleNavigate(`/courses/${courseId}/knowledgegraph`)}
                        >
                            Topic statistics
                        </Button>
                    </>
                )}
            </Stack>
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

const secondaryNavBarContainerStyle = {
    height: '3rem',
    width: '100%',
    alignItems: 'center',
    display: "flex",
    flexDirection: "row",
    background: COLORS.BLACK,
    boxShadow: 2,
};

export default SecondaryNavBar;