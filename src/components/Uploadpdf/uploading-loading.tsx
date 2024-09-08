import { Box, CircularProgress } from "@mui/material";

const UploadPdfLoading = () => {
  return (
    <Box width={"100%"} display={"flex"} justifyContent={"center"} mt={"2rem"}>
      <CircularProgress size={"100px"} />
    </Box>
  );
};

export default UploadPdfLoading;
