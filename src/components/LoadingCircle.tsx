import { Box, CircularProgress } from "@mui/material";
import { theme } from "../theme";

const LoadingCircle = () => {
  return (
    <Box width={"100%"} display={"flex"} justifyContent={"center"} mt={"2rem"}>
      <CircularProgress size={"100px"} sx={{ color: theme.colors.highlight1 }} />
    </Box>
  );
};

export default LoadingCircle;
