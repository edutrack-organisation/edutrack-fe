// React component from https://www.npmjs.com/package/react-pdf?activeTab=readme, which internally using pdf.js

import { Box, Modal, Pagination } from "@mui/material";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./PdfViewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const PdfViewer = ({
    pdffile,
    showPDF,
}: {
    pdffile: File | null;
    showPDF: boolean;
    setShowPDF: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [pdfPageNumber, setPdfPageNumber] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    const handlePDFPageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPdfPageNumber(value);
    };

    return (
        <>
            {showPDF && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        position: "fixed",
                        right: 0,
                        zIndex: 1, // Ensure the modal is on top
                        mt: { xs: "13rem", lgxl: "15rem", xl: "15rem" },
                        mr: { lg: "2rem", xl: "5rem" },
                    }}
                >
                    <Box
                        display={"flex"}
                        flexDirection={"column"}
                        border={"3px solid black"}
                        position={"relative"}
                        sx={{
                            "&:hover .hover-content": {
                                opacity: 1, // Show child on hover
                            },
                        }}
                    >
                        <Document
                            file={pdffile}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page pageNumber={pdfPageNumber} />
                        </Document>
                        <Pagination
                            count={numPages}
                            page={pdfPageNumber}
                            variant="outlined"
                            className="hover-content" // Use a class to target this element
                            sx={{
                                position: "absolute",
                                zIndex: 2,
                                bottom: { xs: 10, xl: 40 },
                                width: "100%",
                                textAlign: "center", // Center content inside
                                display: "flex", // Use flexbox for centering
                                justifyContent: "center", // Horizontal centering
                                opacity: 0, // Initially hidden
                                transition: "opacity 0.3s ease-in-out", // Smooth transition
                            }}
                            onChange={handlePDFPageChange}
                        />
                    </Box>
                </Box>
            )}
        </>
    );
};

export default PdfViewer;
