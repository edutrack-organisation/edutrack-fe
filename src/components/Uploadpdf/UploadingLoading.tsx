/**
 * @file UploadingLoading.tsx
 * @description Loading component displayed during PDF parsing process
 * Features:
 * - Animated loading text with dots
 * - Timeout message after 30 seconds
 * - Skeleton UI elements to indicate loading state
 */

import { Box, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const INITIAL_TITLE = "Parsing PDF";
const DOT_INTERVAL = 3000;
const TIMEOUT_DURATION = 30000;
const TIMEOUT_MESSAGE = "Parsing PDF... This may take a while";

const UploadPdfLoading = () => {
    const [title, setTitle] = useState<string>(INITIAL_TITLE);

    useEffect(() => {
        const interval = setInterval(() => {
            setTitle((prev) => prev + ".");
        }, DOT_INTERVAL);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            setTitle(TIMEOUT_MESSAGE);
        }, TIMEOUT_DURATION);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    // We render skeleton loading for good UX
    return (
        <Box width={"100%"} display={"flex"} justifyContent={"center"} mt={"7rem"}>
            <Box
                display={"flex"}
                alignItems={"center"}
                flexDirection={"column"}
                sx={{ width: { xs: "90%", xl: "78%" } }}
                mx={"auto"}
            >
                <Typography fontSize={"3rem"} ml={2} fontWeight={"bold"}>
                    {title}
                </Typography>

                <Box
                    display={"flex"}
                    width={"100%"}
                    padding={"1rem"}
                    mt={"2rem"}
                    gap={"1rem"}
                    justifyContent={"space-between"}
                    height={"7rem"}
                >
                    <Skeleton width={"100%"} />
                    <Skeleton width={"13rem"} />
                </Box>

                {/* This is the table of questions and its details */}
                <Skeleton width={"100%"} height={"7rem"} />

                <Box display={"flex"} width={"100%"} height={"10rem"} gap={"1rem"} alignItems={"center"}>
                    <Skeleton width={"33%"} height={"100%"} />
                    <Skeleton width={"33%"} height={"100%"} />
                    <Skeleton width={"20%"} height={"100%"} />
                    <Skeleton width={"7%"} height={"100%"} />
                    <Skeleton variant="circular" width={"7%"} height={"50%"} />
                </Box>
            </Box>
        </Box>
    );
};

export default UploadPdfLoading;
