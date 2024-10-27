import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import UploadPdfButton from "./upload-button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadPdfLoading from "./uploading-loading";
import uploadPDFImage from "../../assets/icons/Upload_pdf.png";
import pdfIcon from "../../assets/icons/pdf_icon.png";
import saveIcon from "../../assets/icons/save_icon.png";
import confirmIcon from "../../assets/icons/confirm_icon.png";
import { toast } from "react-toastify";

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
                    throw new Error("Failed to upload file");
                }

                const result = await response.json();
                toast.success("Paper parsed successfully!");
                setIsProcessingFile(false);
                // Redirect after done
                navigate("/doneupload", { state: { response: result } });
            } catch (error) {
                toast.error("Error in parsing PDF");
                setIsProcessingFile(false);
            }
        }
    };

    return (
        <>
            {isProcessingFile ? (
                <UploadPdfLoading />
            ) : (
                <Box width={{ lg: "80%", xl: "70%" }} mx={"auto"}>
                    <Box
                        display={"flex"}
                        marginTop={"8rem"}
                        height={"50vh"}
                        className="upload-pdf-description"
                    >
                        <Box
                            height={"100vh"}
                            width={"50%"}
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                        >
                            <Box className="description" mt={"2rem"}>
                                <Typography
                                    fontSize={"4rem"}
                                    ml={2}
                                    fontWeight={"bold"}
                                    // fontFamily={""}
                                >
                                    Upload PDF
                                </Typography>
                                <Typography
                                    fontSize={"2rem"}
                                    ml={2}
                                    fontFamily={"lato"}
                                >
                                    Easily upload, parse and edit your PDF files
                                </Typography>
                            </Box>
                            <UploadPdfButton
                                label="Upload File"
                                handleUpload={handleUploadFile}
                            />
                        </Box>
                        <img
                            src={uploadPDFImage}
                            alt="upload_pdf_icon"
                            style={{ width: "600px", height: "400px" }}
                        />
                    </Box>
                    <Box
                        className="current-steps-bar"
                        display={"flex"}
                        width={"80%"}
                        mx={"auto"}
                        justifyContent={"space-around"}
                    >
                        <Box
                            className="each_step_container"
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Box
                                className="each_step_icon"
                                borderRadius={"50%"}
                                bgcolor={"#ffafa2"}
                                height={"7rem"}
                                width={"7rem"}
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                <img
                                    src={pdfIcon}
                                    alt="pdf_icn"
                                    height={"50rem"}
                                    width={"50rem"}
                                />
                            </Box>
                            <Typography
                                fontFamily={"lato"}
                                mt={"1rem"}
                                fontSize={"1rem"}
                                bgcolor={"#ffafa2"}
                                padding={"0.7rem"}
                                borderRadius={"1.5rem"}
                                border={"1px solid gray"}
                            >
                                Upload your PDF
                            </Typography>
                        </Box>
                        <Box
                            className="each_step_container "
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Box
                                className="each_step_icon"
                                borderRadius={"50%"}
                                bgcolor={"#f9e7e4"}
                                height={"7rem"}
                                width={"7rem"}
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                <img
                                    src={confirmIcon}
                                    alt="confirm_icon"
                                    height={"50rem"}
                                    width={"50rem"}
                                />
                            </Box>
                            <Typography
                                fontFamily={"lato"}
                                mt={"1rem"}
                                fontSize={"1rem"}
                                bgcolor={"#f9e7e4"}
                                padding={"0.7rem"}
                                borderRadius={"1.5rem"}
                            >
                                Confirm parsed pdf
                            </Typography>
                        </Box>
                        <Box
                            className="each_step_container"
                            display={"flex"}
                            flexDirection={"column"}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Box
                                className="each_step_icon"
                                borderRadius={"50%"}
                                bgcolor={"#f9e7e4"}
                                height={"7rem"}
                                width={"7rem"}
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                            >
                                <img
                                    src={saveIcon}
                                    alt="save_icon"
                                    height={"50rem"}
                                    width={"50rem"}
                                />
                            </Box>
                            <Typography
                                fontFamily={"lato"}
                                mt={"1rem"}
                                fontSize={"1rem"}
                                bgcolor={"#f9e7e4"}
                                padding={"0.7rem"}
                                borderRadius={"1.5rem"}
                            >
                                Save your PDF
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default UploadPdfContainer;
