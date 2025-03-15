/**
 * Styles specific to the Dashboard feature components
 * Contains Material-UI style configurations for:
 * - Gradient card layouts
 * - Scrollable containers
 * - Custom scrollbar appearance
 */

import { Box, Card, styled } from "@mui/material";
import { scrollbarStyle } from "../GeneratePaper/styles";

export const GradientCardBlue = styled(Card)(({}) => ({
    padding: "1rem",
    borderRadius: "1.5rem",
    backgroundColor: `background: rgb(255,255,255);
background: -moz-linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(231,250,255,1) 94%);
background: -webkit-linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(231,250,255,1) 94%);
background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(231,250,255,1) 94%);
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffffff",endColorstr="#e7faff",GradientType=1);`,
}));

export const GradientCardPurple = styled(Card)(({}) => ({
    height: "15rem",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "1.5rem",
    bgcolor: `background: rgb(255,255,255);
background: -moz-linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(254,241,251,1) 90%);
background: -webkit-linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(254,241,251,1) 90%);
background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(254,241,251,1) 90%);
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffffff",endColorstr="#fef1fb",GradientType=1);`,
}));

export const StyledBox = styled(Box)(({}) => ({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    height: "10rem",
    overflow: "auto",
    ...scrollbarStyle,
}));
