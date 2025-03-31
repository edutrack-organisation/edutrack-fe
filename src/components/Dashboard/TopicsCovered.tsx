/**
 * TopicsCovered Component
 *
 * A dashboard component that visualizes the distribution of topics in an exam paper.
 * Features:
 * - Displays a list of covered topics as chips (non subcategorised)
 * - Shows a pie chart representing topic frequencies
 * - Includes a toggle for topic categorization
 * - Provides tooltips for additional information
 **/

import { Box, Checkbox, Chip, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { TopicFrequency } from "../../types/types";
import { PieChart } from "@mui/x-charts";
import React from "react";

interface TopicsCoveredHeaderProps {
    onCategorizeChange: (checked: boolean) => void;
}
interface TopicsCoveredProps {
    topicFrequencies: TopicFrequency[];
    onChange: (checked: boolean) => void;
}

interface TopicsChipListProps {
    topics: TopicFrequency[];
}

interface TopicsPieChartProps {
    data: TopicFrequency[];
}

/**
 * Header component for Topics Covered section
 * Displays the section title, info tooltip, and categorization toggle
 * @param onCategorizeChange - Callback function when categorization checkbox is toggled
 */
const TopicsCoveredHeader: React.FC<TopicsCoveredHeaderProps> = ({
    onCategorizeChange,
}) => (
    <Box display="flex" alignItems="center" sx={{ mb: "0.5rem" }}>
        <Typography fontWeight="bolder" fontSize="17px">
            Topics Covered
        </Typography>
        <Tooltip
            title="These are the topics covered in the scope for this exam paper"
            placement="right"
        >
            <InfoIcon sx={{ fontSize: "1.3rem", ml: "0.5rem" }} />
        </Tooltip>
        <Checkbox onChange={() => onCategorizeChange(true)} />
        <Typography>Categorise Topics Covered</Typography>
    </Box>
);

/**
 * Displays a list of topics as chips in a wrapped container
 * Each chip shows a topic label with a tooltip
 * @param topics - Array of topic frequencies to display
 */
const TopicsChipList: React.FC<TopicsChipListProps> = ({ topics }) => (
    <Box
        className="topics-container"
        display="flex"
        flexWrap="wrap"
        sx={{ gap: "0.5rem", mb: "2rem" }}
    >
        {topics.map((topic, index) => (
            <Tooltip title={topic.label} key={index}>
                <Chip label={topic.label} sx={{ width: "15rem" }} />
            </Tooltip>
        ))}
    </Box>
);

/**
 * Renders a donut chart showing topic frequency distribution
 * Features interactive highlighting and hover effects
 * @param data - Array of topic frequencies for chart visualization
 */
const TopicsPieChart: React.FC<TopicsPieChartProps> = ({ data }) => (
    <>
        <Typography fontWeight="bolder" fontSize="17px" mb="0.5rem">
            Topics Covered to Frequency Pie Chart
        </Typography>
        <PieChart
            series={[
                {
                    data, // The dataset for the pie chart
                    highlightScope: { fade: "global", highlight: "item" }, // When hovering, fades all segments except the highlighted one
                    faded: {
                        innerRadius: 30, // Sets the inner radius of faded segments
                        additionalRadius: -30, // Reduces the size of faded segments
                        color: "gray", // Color of faded segments
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
            <Typography fontWeight="light">
                Hover over the pie chart to see the frequency of each topic
            </Typography>
        </Box>
    </>
);

const TopicsCovered: React.FC<TopicsCoveredProps> = ({
    topicFrequencies,
    onChange,
}) => {
    return (
        <Box className="topics-covered-container">
            <TopicsCoveredHeader onCategorizeChange={onChange} />
            <TopicsChipList topics={topicFrequencies} />
            <TopicsPieChart data={topicFrequencies} />
        </Box>
    );
};

export default TopicsCovered;
