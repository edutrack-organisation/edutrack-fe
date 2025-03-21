/**
 * @file UploadPdfContainer.tsx
 * @description Container component for PDF upload functionality
 * Handles the upload process workflow including:
 * - PDF file upload and parsing
 * - Progress indication
 * - Step-by-step visual guide
 * - Navigation to confirmation page
 */

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import UploadPdfButton from "./UploadButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadPdfLoading from "./UploadingLoading";
import uploadPDFImage from "../../assets/icons/Upload_pdf.png";
import pdfIcon from "../../assets/icons/pdf_icon.png";
import saveIcon from "../../assets/icons/save_icon.png";
import confirmIcon from "../../assets/icons/confirm_icon.png";
import toast from "react-hot-toast";
import { pdfApi } from "./uploadPDFApi";
interface StepProps {
    icon: string;
    altText: string;
    label: string;
    isActive?: boolean;
}

interface UploadHeaderProps {
    handleUploadFile: (file: File | null) => Promise<void>;
    uploadPDFImage: string;
}

const UploadPdfContainer = () => {
    const navigate = useNavigate();
    const [_uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isProcessingFile, setIsProcessingFile] = useState(false);

    const handleUploadFile = async (file: File | null) => {
        setUploadedFile(file);
        if (!file) {
            toast.error("Please select a PDF file");
            return;
        }

        setIsProcessingFile(true);

        try {
            const result = await pdfApi.parsePDF(file);
            toast.success("Paper parsed successfully!");
            navigate("/doneupload", {
                state: { response: result, file },
            });
        } catch (error) {
            toast.error("Error in parsing PDF");
        } finally {
            setIsProcessingFile(false);
        }
    };

    /**
     * Renders a single step in the upload process workflow
     * Changes appearance based on whether the step is active
     */
    const ProcessStep = ({ icon, altText, label, isActive = false }: StepProps) => (
        <Box
            className="each_step_container"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Box
                className="each_step_icon"
                borderRadius="50%"
                bgcolor={isActive ? "#ffafa2" : "#f9e7e4"}
                height="7rem"
                width="7rem"
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <img src={icon} alt={altText} height="50rem" width="50rem" />
            </Box>
            <Typography
                fontFamily="lato"
                mt="1rem"
                fontSize="1rem"
                bgcolor={isActive ? "#ffafa2" : "#f9e7e4"}
                padding="0.7rem"
                borderRadius="1.5rem"
                border={isActive ? "1px solid gray" : undefined}
            >
                {label}
            </Typography>
        </Box>
    );

    /**
     * Renders the upload section header with title, description, upload button and image
     */
    const UploadHeader: React.FC<UploadHeaderProps> = ({ handleUploadFile, uploadPDFImage }) => (
        <Box display={"flex"} marginTop={{ lg: "3rem", xl: "8rem" }} height={"50vh"} className="upload-pdf-description">
            <Box height={"100vh"} width={"50%"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                <Box className="description" mt={"2rem"}>
                    <Typography fontSize={{ md: "2.5rem", xl: "4rem" }} ml={2} fontWeight={"bold"}>
                        Upload PDF
                    </Typography>
                    <Typography fontSize={{ lg: "1.5rem", xl: "2rem" }} ml={2} fontFamily={"lato"}>
                        Easily upload, parse and edit your PDF files
                    </Typography>
                </Box>
                <UploadPdfButton label="Upload File" handleUpload={handleUploadFile} />
            </Box>
            <Box
                component="img"
                src={uploadPDFImage}
                alt="upload_pdf_icon"
                sx={{
                    width: { lg: "400px", xl: "600px" },
                    height: { lg: "300px", xl: "400px" },
                }}
            />
        </Box>
    );

    return (
        <>
            {isProcessingFile ? (
                <UploadPdfLoading />
            ) : (
                <Box width={{ lg: "80%", xl: "70%" }} mx={"auto"} mt={"5rem"}>
                    <UploadHeader handleUploadFile={handleUploadFile} uploadPDFImage={uploadPDFImage} />
                    <Box
                        className="current-steps-bar"
                        display={"flex"}
                        width={"80%"}
                        mx={"auto"}
                        justifyContent={"space-around"}
                    >
                        <ProcessStep icon={pdfIcon} altText="pdf_icon" label="Upload your PDF" isActive={true} />
                        <ProcessStep icon={confirmIcon} altText="confirm_icon" label="Confirm parsed pdf" />
                        <ProcessStep icon={saveIcon} altText="save_icon" label="Save your PDF" />
                    </Box>
                </Box>
            )}
        </>
    );
};

export default UploadPdfContainer;
