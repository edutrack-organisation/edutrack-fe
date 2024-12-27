import { Box, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const UploadPdfLoading = () => {
    const [title, setTitle] = useState<string>("Parsing PDF");

    // I want to append '.' to the title every 3 seconds
    // After 30 seconds, I want to say this may take a while
    useEffect(() => {
        const interval = setInterval(() => {
            setTitle((prev) => prev + ".");
        }, 3000);

        const timeout = setTimeout(() => {
            clearInterval(interval);
            setTitle("Parsing PDF... This may take a while");
        }, 30000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <Box
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            mt={"7rem"}
        >
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
                {/* <ContentTable data={[]} handlers={{}} /> */}
                <Skeleton width={"100%"} height={"7rem"} />

                <Box
                    display={"flex"}
                    width={"100%"}
                    height={"10rem"}
                    gap={"1rem"}
                    alignItems={"center"}
                >
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
