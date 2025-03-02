import { Box, LinearProgress, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

interface OverallDifficultyProps {
    paperAverageDifficulty: number;
}

const OverallDifficulty = ({
    paperAverageDifficulty,
}: OverallDifficultyProps) => {
    return (
        <Box className="overall-difficulty-container">
            <Box
                display={"flex"}
                alignItems={"center"}
                sx={{ marginBottom: "0.5rem" }}
            >
                <Typography fontWeight={"bolder"} fontSize={"17px"}>
                    Overall Difficulty
                </Typography>
                <Tooltip
                    title="Difficulty level is rated from 1 to 5, and is determined based on ML model predictions"
                    placement="right"
                >
                    <InfoIcon sx={{ fontSize: "1.3rem", ml: "0.5rem" }} />
                </Tooltip>
            </Box>
            <Box
                className="progress-bar-container"
                display={"flex"}
                flexDirection={"column"}
                sx={{ gap: "0.5rem" }}
            >
                <Typography fontWeight={"Medium"}>
                    Average difficulty level:
                    {paperAverageDifficulty}
                </Typography>

                <LinearProgress
                    variant="determinate"
                    value={(paperAverageDifficulty / 5) * 100}
                    sx={{
                        height: "0.8rem",
                        borderRadius: "1rem",
                    }}
                />
                <Typography fontWeight={"light"}>
                    Based on the average difficulty rating of all questions
                </Typography>
            </Box>
        </Box>
    );
};

export default OverallDifficulty;
