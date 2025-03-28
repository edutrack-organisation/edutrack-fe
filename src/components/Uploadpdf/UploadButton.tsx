/**
 * @file UploadButton.tsx
 * @description A custom button component for PDF file uploads
 * Features:
 * - Styled as a Material-UI button with cloud upload icon
 * - Hidden file input for better UX
 * - Supports single PDF file selection
 */

import styled from "@emotion/styled";
import { CloudUploadOutlined } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";

interface UploadPdfButtonProps {
    label: string;
    handleUpload: (file: File | null) => void;
}

const UploadPdfButton: React.FC<UploadPdfButtonProps> = ({ label, handleUpload }) => {
    const VisuallyHiddenInput = styled("input")({
        clip: "rect(0 0 0 0)",
        clipPath: "inset(50%)",
        height: 1,
        overflow: "hidden",
        position: "absolute",
        bottom: 0,
        left: 0,
        whiteSpace: "nowrap",
        width: 1,
    });

    const setUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null; // only select the first file as support single file upload
        handleUpload(file);
    };

    return (
        <Button
            component="label"
            role={undefined} // Removes ARIA role as this button acts as a label
            variant="contained" // Sets the button's visual style to filled variant
            tabIndex={-1} // Excludes the button from keyboard navigation sequence
            startIcon={<CloudUploadOutlined />}
            sx={{
                fontSize: "1.3rem",
                marginTop: "2rem",
                height: "5rem",
                width: "15rem",
                borderRadius: "3rem",
            }}
        >
            <Typography fontWeight={"medium"}>{label}</Typography>
            <VisuallyHiddenInput type="file" accept="application/pdf" onChange={setUploadFile} />
        </Button>
    );
};

export default UploadPdfButton;
