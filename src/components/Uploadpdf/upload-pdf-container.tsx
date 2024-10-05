import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import UploadPdfButton from "./upload-button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadPdfLoading from "./uploading-loading";

const UploadPdfContainer = () => {
    const navigate = useNavigate();
    const [_uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isProcessingFile, setIsProcessingFile] = useState(false);

    const handleUploadFile = async (file: File | null) => {
        setUploadedFile(file);

        // post processing after uploaded, temporary log
        if (file) {
            console.log("File uploaded: ", file);
            setIsProcessingFile(true);

            // Create a FormData object to hold the file data
            const formData = new FormData();
            formData.append("file", file);

            try {
                // Send the file to the FastAPI endpoint
                const response = await fetch(
                    "http://127.0.0.1:8000/parsePDF/",
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                if (!response.ok) {
                    // #TODO: probably need error handling here
                    throw new Error("Failed to upload file");
                }

                const result = await response.json();

                setIsProcessingFile(false);
                // Redirect after done
                navigate("/doneupload", { state: { response: result } });
            } catch (error) {
                console.error("Error uploading file:", error);
                setIsProcessingFile(false);
            }
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
