import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import UploadButton from "../components/UploadButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingCircle from "../components/LoadingCircle";
import Api, { ApiError } from "../api/Api";

const UploadPdfPage = () => {
    const navigate = useNavigate();
    const [_uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isProcessingFile, setIsProcessingFile] = useState(false);

    const handleUploadFile = async (file: File | null) => {
        setUploadedFile(file);
        
        if (file) {
            console.log("File uploaded: ", file); // TODO: Post processing after uploaded, temporary log
            setIsProcessingFile(true);

            try {
                const result = await Api.uploadPdfPaper(file);
                
                setIsProcessingFile(false);

                // Redirect after done
                navigate("/doneupload", { state: { response: result } });
            } catch (error) {
                if (error instanceof ApiError) {
                    // Handle specific API errors
                    console.error("API Error uploading file:", error.message);
                } else {
                    // Handle any unexpected errors
                    console.error("Unexpected error uploading file:", error);
                }
                setIsProcessingFile(false);
            }
        }
    };

    return (
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
            {isProcessingFile ? <LoadingCircle /> : <UploadButton label="Upload File" handleUpload={handleUploadFile} />}
        </Box>
    );
};

export default UploadPdfPage;
