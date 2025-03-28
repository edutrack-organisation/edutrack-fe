/**
 * OverallDifficulty Component
 *
 * A dashboard component that visualizes the average difficulty level of an exam paper.
 * Features:
 * - Displays overall difficulty score (1-5 scale)
 * - Shows visual progress bar representation
 * - Includes ML model prediction information
 * - Provides tooltips for additional context
 */

import { Box, LinearProgress, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

interface OverallDifficultyProps {
    paperAverageDifficulty: number;
}

interface DifficultyHeaderProps {
    title: string;
}

interface DifficultyProgressProps {
    difficulty: number;
}

/**
 * Renders the header section with title and info tooltip
 */
const DifficultyHeader: React.FC<DifficultyHeaderProps> = ({ title }) => (
    <Box display="flex" alignItems="center" sx={{ marginBottom: "0.5rem" }}>
        <Typography fontWeight="bolder" fontSize="17px">
            {title}
        </Typography>
        <Tooltip
            title="Difficulty level is rated from 1 to 5, and is determined based on ML model predictions"
            placement="right"
        >
            <InfoIcon sx={{ fontSize: "1.3rem", ml: "0.5rem" }} />
        </Tooltip>
    </Box>
);

/**
 * Renders the difficulty progress bar with labels
 */
const DifficultyProgress: React.FC<DifficultyProgressProps> = ({
    difficulty,
}) => (
    <Box
        className="progress-bar-container"
        display="flex"
        flexDirection="column"
        sx={{ gap: "0.5rem" }}
    >
        <Typography fontWeight="medium">
            Average difficulty level: {difficulty}
        </Typography>
        <LinearProgress
            variant="determinate"
            value={(difficulty / 5) * 100}
            sx={{
                height: "0.8rem",
                borderRadius: "1rem",
            }}
        />
        <Typography fontWeight="light">
            Based on the average difficulty rating of all questions
        </Typography>
    </Box>
);

const OverallDifficulty: React.FC<OverallDifficultyProps> = ({
    paperAverageDifficulty,
}) => {
    return (
        <Box className="overall-difficulty-container">
            <DifficultyHeader title="Overall Difficulty" />
            <DifficultyProgress difficulty={paperAverageDifficulty} />
        </Box>
    );
};

export default OverallDifficulty;
