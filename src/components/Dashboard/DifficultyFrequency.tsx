import { Box, Tooltip, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import InfoIcon from "@mui/icons-material/Info";

interface DifficultyFrequencyProps {
    difficultyFrequency: any;
}

const DifficultyFrequency = ({
    difficultyFrequency,
}: DifficultyFrequencyProps) => {
    return (
        <Box className="difficulty-frequency-container">
            <Box display={"flex"} alignItems={"center"} sx={{ mb: "0.5rem" }}>
                <Typography fontWeight={"bolder"} fontSize={"17px"}>
                    Difficulty To Frequency Bar Chart
                </Typography>
                <Tooltip
                    title="These are the frequency for each difficulty in the exam paper"
                    placement="right"
                >
                    <InfoIcon sx={{ fontSize: "1.3rem", ml: "0.5rem" }} />
                </Tooltip>
            </Box>
            <BarChart
                series={[
                    {
                        dataKey: "frequency",
                    },
                ]}
                dataset={difficultyFrequency}
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
                // Below is to add the y-axis label
                yAxis={[
                    {
                        label: "Frequency",
                        tickMinStep: 1,
                    },
                ]}
            />
        </Box>
    );
};

export default DifficultyFrequency;
