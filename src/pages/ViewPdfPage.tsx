import {
    Box,
    CircularProgress,
    Typography,
    Stack,
    Button,
    Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Api, { ApiError } from "../api/Api";
import { theme } from "../theme";
import ContentTableFromTitle from "../components/ContentTableFromTitle";
import "../App.css";

const ViewPdfPage = () => {
    const location = useLocation(); // Used for auto redirection to the paper

    const [isFetchingTitleList, setIsFetchingTitleList] =
        useState<Boolean>(true);
    const [titleList, setTitleList] = useState<String[]>([]);
    const [selectedPaper, setSelectedPaper] = useState<number>(-1); // TODO: Check with backend to see how we want to specify the paper

    useEffect(() => {
        Api.getPdfTitleList()
            .then((response) => {
                setIsFetchingTitleList(false);
                const titleList = response.data; // Due to state updating rules, we temporarily overwrite the titleList variable in this scope to make sure that the program runs as intended.
                setTitleList(titleList);

                // Auto redirection
                const title = location?.state?.response?.data?.title ?? "";
                if (title) {
                    // If there is a paper that requires to be automatically redirected
                    setSelectedPaper(response.data.indexOf(title));
                }
            })
            .catch((error) => {
                if (error instanceof ApiError) {
                    // Handle specific API errors
                    console.error("API Error uploading file:", error.message);
                } else {
                    // Handle any unexpected errors
                    console.error("Unexpected error uploading file:", error);
                }
                setIsFetchingTitleList(false);
            });
    }, []);

    const SelectPaperPanel = () => {
        return (
            <Stack flex={1} divider={<Divider flexItem />}>
                {titleList.map((title, index) => (
                    <Button
                        sx={{
                            justifyContent: "flex-start",
                            height: "5rem",
                            flexShrink: 0,
                        }}
                        onClick={() => setSelectedPaper(index)}
                    >
                        {title}
                    </Button>
                ))}
            </Stack>
        );
    };

    return (
        <Box
            sx={{
                height: "calc(100vh - 5rem)", // Remaining height below the NavBar
                display: "flex",
                backgroundColor: theme.colors.secondary, // Example background color
            }}
        >
            {/* Left portion for selection */}
            <Box
                className="scrollable"
                sx={{
                    flex: 1,
                    display: "flex",
                    background: theme.colors.secondary,
                    overflowY: "auto", // Enable vertical scrolling
                }}
            >
                {isFetchingTitleList ? (
                    <Box sx={{ flex: 1, alignSelf: "center" }}>
                        <CircularProgress
                            size={"100px"}
                            sx={{
                                color: theme.colors.highlight1,
                                alignSelf: "center",
                            }}
                        />
                    </Box>
                ) : (
                    <SelectPaperPanel />
                )}
            </Box>

            {/* Vertical Divider */}
            <Divider
                orientation="vertical"
                flexItem
                sx={{
                    backgroundColor: theme.colors.highlight1,
                    width: "0.25rem",
                    borderRadius: 3,
                    margin: 1,
                }}
            />

            {/* Right portion for content */}
            <Box
                sx={{
                    flex: 4,
                    background: theme.colors.secondary,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {selectedPaper !== -1 ? (
                    <ContentTableFromTitle title={titleList[selectedPaper]} />
                ) : (
                    <Box
                        sx={{
                            flex: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            fontSize={"2rem"}
                            ml={2}
                            fontWeight={"bold"}
                            fontFamily={"monospace"}
                            align={"center"}
                        >
                            Select a previously uploaded paper to view.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default ViewPdfPage;
