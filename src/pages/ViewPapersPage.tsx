import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Stack,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiMock, { ApiError } from "../api/ApiMock";
import PaperInspector from "../components/ViewPaper/PaperInspector";
import { COLORS } from "../constants/constants";
import type { PaperItem } from "../types/types";

const ViewPapersPage = () => {
    const navigate = useNavigate();
    const courseId: number = Number(decodeURIComponent(useParams().courseId!));

    const [isFetchingPapers, setIsFetchingPapers] = useState<boolean>(true);
    const [paperList, setPaperList] = useState<PaperItem[]>();
    const [selectedPaper, setSelectedPaper] = useState<number>();

    useEffect(() => {
        // TODO: Validate courseId
        // 1. Check if courseId is valid
        // 2. Check if user has access to courseId
        if (isNaN(courseId)) {
            navigate("/courses");
        };

        // Fetch papers for the course
        ApiMock.getCoursePapers(courseId).then((response) => {
            setPaperList(response.data);
            setIsFetchingPapers(false);
        }).catch((error) => {
            if (error instanceof ApiError) {
                // Handle specific API errors
                console.error("API Error uploading file:", error.message);
            } else {
                // Handle any unexpected errors
                console.error("Unexpected error uploading file:", error);
            }
            setIsFetchingPapers(false);
        });
    }, []);

    return (
        <Box sx={containerStyle}>
            {/* Left portion for selection */}
            <Box sx={scrollboxStyle}>
                {isFetchingPapers ? (
                    <CircularProgress size={"100px"} sx={{ color: COLORS.HIGHLIGHT, alignSelf: "center" }} />
                ) : (
                    <Stack flex={1} divider={<Divider flexItem />}>
                        {paperList!.map((paper: PaperItem, index) => (
                            <Button
                                key={`Paper${index}`}
                                sx={{
                                    textAlign: "left",              // Aligns text to the left
                                    justifyContent: "flex-start",   // Aligns multi-line text to the left
                                    minHeight: "5rem",              // Ensures minimum height
                                    flexShrink: 0,                  // Prevents the button from shrinking
                                }}
                                onClick={() => setSelectedPaper(index)}
                            >
                                {paper.paperTitle}
                            </Button>
                        ))}
                    </Stack>
                )}
            </Box>

            {/* Vertical Divider */}
            <Divider orientation="vertical" flexItem sx={{ backgroundColor: COLORS.HIGHLIGHT, width: "0.25rem", borderRadius: 3, margin: 1, }} />

            {/* Right portion for content */}
            <Box sx={displayboxStyle}>
                {(selectedPaper !== undefined) ? (
                    <PaperInspector paper={paperList![selectedPaper]} />
                ) : (
                    <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography fontSize={"2rem"} fontWeight={"bold"} fontFamily={"monospace"}>
                            No paper selected.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const containerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    background: COLORS.WHITE,
};

const scrollboxStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    background: COLORS.WHITE,
    maxHeight: "calc(100vh - 5rem)", // Account for Navbar height
    overflowY: "auto", // Enable vertical scrolling during overflow
};

const displayboxStyle = {
    flex: 4,
    display: "flex",
    flexDirection: "column",
    background: COLORS.WHITE,
};

export default ViewPapersPage;
