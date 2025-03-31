/**
 * DifficultyFrequency Component
 *
 * A dashboard component that visualizes the distribution of question difficulties.
 * Features:
 * - Displays bar chart of difficulty levels
 * - Shows frequency distribution
 * - Includes tooltips for additional context
 */

import { Box, Tooltip, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import InfoIcon from "@mui/icons-material/Info";

interface DifficultyFrequencyType {
    difficulty: number;
    frequency: number;
    [key: string]: number; // Add index signature for MUI X Charts
}

interface DifficultyFrequencyProps {
    difficultyFrequency: DifficultyFrequencyType[];
}

interface ChartProps {
    data: DifficultyFrequencyType[];
}

/**
 * Renders the header section with title and info tooltip
 */
const DifficultyFrequencyHeader = () => (
    <Box display="flex" alignItems="center" sx={{ mb: "0.5rem" }}>
        <Typography fontWeight="bolder" fontSize="17px">
            Difficulty To Frequency Bar Chart
        </Typography>
        <Tooltip
            title="These are the frequencies for each difficulty level in the exam paper"
            placement="right"
        >
            <InfoIcon sx={{ fontSize: "1.3rem", ml: "0.5rem" }} />
        </Tooltip>
    </Box>
);

/**
 * Renders the difficulty distribution bar chart
 * @param data - Array of difficulty frequency data
 */
const DifficultyFrequencyChart: React.FC<ChartProps> = ({ data }) => (
    // https://mui.com/x/react-charts/bars/?srsltid=AfmBOoqnERpa2-QdT_lcnW5IZqG63huLkkuN4OcwBcVQFSQZykpCom6z
    <BarChart
        series={[{ dataKey: "frequency" }]}
        dataset={data}
        xAxis={[
            {
                scaleType: "band",
                dataKey: "difficulty",
                label: "Difficulty",
                colorMap: {
                    type: "ordinal",
                    colors: ["#e5b3ff"],
                },
            },
        ]}
        width={300}
        height={150}
        borderRadius={5}
        yAxis={[
            {
                label: "Frequency",
                tickMinStep: 1,
            },
        ]}
    />
);

const DifficultyFrequency: React.FC<DifficultyFrequencyProps> = ({
    difficultyFrequency,
}) => {
    return (
        <Box className="difficulty-frequency-container">
            <DifficultyFrequencyHeader />
            <DifficultyFrequencyChart data={difficultyFrequency} />
        </Box>
    );
};

export default DifficultyFrequency;
