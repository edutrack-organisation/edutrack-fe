import { Box, Chip, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { TopicFrequency } from "../../types/types";
import { PieChart } from "@mui/x-charts";

interface TopicsCoveredProps {
    topicFrequencies: TopicFrequency[];
}

const TopicsCovered = ({ topicFrequencies }: TopicsCoveredProps) => {
    return (
        <Box className="topics-covered-container">
            <Typography fontWeight={"bolder"} fontSize={"17px"} mb="0.5rem">
                Topics Covered
            </Typography>
            <Box
                className="topics-container"
                display={"flex"}
                flexWrap={"wrap"} // Ensure the content wraps
                sx={{
                    gap: "0.5rem",
                    mb: "2rem",
                }}
            >
                {/* NOTE: dummy all topics covered only */}
                {/* iterate through the key of topicFrequency  */}
                {topicFrequencies.map((t: any, index: number) => (
                    <Tooltip title={t.label} key={index}>
                        <Chip
                            label={t.label}
                            sx={{
                                width: "15rem",
                            }}
                        />
                    </Tooltip>
                ))}
            </Box>

            <Typography fontWeight={"bolder"} fontSize={"17px"} mb="0.5rem">
                Topics Covered to Frequency Pie Chart
            </Typography>
            <PieChart
                series={[
                    {
                        data: topicFrequencies,

                        highlightScope: {
                            fade: "global",
                            highlight: "item",
                        },
                        faded: {
                            innerRadius: 30,
                            additionalRadius: -30,
                            color: "gray",
                        },
                        innerRadius: 30,
                    },
                ]}
                width={400}
                height={250}
                slotProps={{ legend: { hidden: true } }}
            />
            <Box
                sx={{
                    display: "flex",
                    gap: "0.5rem",
                    mt: "0.5rem",
                    alignItems: "center",
                }}
            >
                <InfoIcon sx={{ fontSize: "1.3rem" }} />
                <Typography fontWeight={"light"}>
                    Hover over the pie chart to see the frequency of each topic
                </Typography>
            </Box>
        </Box>
    );
};

export default TopicsCovered;
