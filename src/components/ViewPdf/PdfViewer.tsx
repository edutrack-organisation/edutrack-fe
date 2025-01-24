// React component from https://www.npmjs.com/package/react-pdf?activeTab=readme, which internally using pdf.js
// Customised with zoom feature
// TODO: Responsiveness on bigger screens

import { Box, Pagination, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./PdfViewer.css";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import CloseIcon from "@mui/icons-material/Close";

// required for pdf.js to work
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

// Styled components to style icons for better code reusability
const StyledMuiIcon = styled("div")(({}) => ({
    position: "absolute",
    top: 10,
    zIndex: 4,
    fontSize: "2rem",
    opacity: 0.5,
    ":hover": {
        opacity: 1,
    },
}));

const StyledOuterContainer = styled(Box)(({}) => ({
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: 100,
    right: 20,
    zIndex: 4,
    "&:hover .hover-content": {
        opacity: 1, // Show child on hover
    },
}));

const StyledPagination = styled(Pagination)(({}) => ({
    position: "absolute",
    zIndex: 2,
    width: "100%",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.3s ease-in-out",
}));

const PdfViewer = ({
    pdffile,
    showPDF,
    setShowPDF,
}: {
    pdffile: File | null;
    showPDF: boolean;
    setShowPDF: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [pdfPageNumber, setPdfPageNumber] = useState<number>(1); // Page state for Pagination
    const [numPages, setNumPages] = useState<number>(0); // Total number of pages in PDF
    const [size, setSize] = useState<number>(400); // Zoom in state for PDF

    // Helper functions
    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    const handlePDFPageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPdfPageNumber(value);
    };

    // Zoom in for PDF
    const increaseSize = () => {
        setSize((prevSize) => prevSize + 50); // Increase size by 50px
    };

    // Zoom out for PDF
    const decreaseSize = () => {
        setSize((prevSize) => Math.max(prevSize - 50, 400)); // Decrease size by 50px
    };

    // Use effect for setting the size of the PDF.
    // This is required to set the size of the PDF dynamically by injecting CSS variables
    // This is to overcome limitations of react-pdf library, where width and scale prop will cause blurry of resolution for pdf
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty("--pdf-width", `${size}px`);
    }, [size]);

    return (
        <>
            {showPDF && (
                // Container for absolute positioning
                <StyledOuterContainer className="pdf-viewer-outer-container">
                    {/* Container for relative position to align inner absolute elements */}
                    <Box position={"relative"}>
                        <StyledMuiIcon
                            as={ZoomInIcon}
                            sx={{ right: 90 }}
                            onClick={() => increaseSize()}
                        />
                        <StyledMuiIcon
                            as={ZoomOutIcon}
                            sx={{ right: 55 }}
                            onClick={() => decreaseSize()}
                        />

                        <StyledMuiIcon
                            as={CloseIcon}
                            sx={{ right: 25 }}
                            onClick={() => setShowPDF(false)}
                        />

                        {/* Box container for PDF viewer itself */}
                        <Box
                            display={"flex"}
                            flexDirection={"column"}
                            border={"3px solid black"}
                            overflow={"auto"}
                            width={"420px"} // Width of the PDF viewer
                            height={"440px"} // Height of the PDF viewer
                        >
                            <Document
                                file={pdffile}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                <Page
                                    pageNumber={pdfPageNumber}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </Document>
                        </Box>
                        <StyledPagination
                            count={numPages}
                            page={pdfPageNumber}
                            variant="outlined"
                            className="hover-content" // Use a class to target this element
                            sx={{
                                bottom: { xs: 10, xl: 40 },
                            }}
                            onChange={handlePDFPageChange}
                        />
                    </Box>
                </StyledOuterContainer>
            )}
        </>
    );
};

export default PdfViewer;
