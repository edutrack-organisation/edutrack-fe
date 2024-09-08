import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import UploadPdfButton from "./upload-button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadPdfLoading from "./uploading-loading";

const UploadPdfContainer = () => {
    const navigate = useNavigate();
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isProcessingFile, setIsProcessingFile] = useState(false);

    const handleUploadFile = (file: File | null) => {
        setUploadedFile(file);

        // post processing after uploaded, temporary log
        if (file) {
            console.log("File uploaded: ", file);
            setIsProcessingFile(true);

            //   Stimulate file parsing with a timeout
            setTimeout(() => {
                setIsProcessingFile(false);
                // Redirect after done
                navigate("/doneupload");
            }, 2000);
        }
    };

    return (
        <>
            {isProcessingFile ? (
                <UploadPdfLoading />
            ) : (
                <Box
                    height={"100vh"}
                    width={"100%"}
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                >
                    <Box className="description" mt={"2rem"}>
                        <Typography
                            fontSize={"4rem"}
                            ml={2}
                            fontWeight={"bold"}
                            fontFamily={"monospace"}
                        >
                            Upload PDF
                        </Typography>
                    </Box>
                    <UploadPdfButton
                        label="Upload File"
                        handleUpload={handleUploadFile}
                    />
                </Box>
            )}{" "}
        </>
    );
};

export default UploadPdfContainer;
