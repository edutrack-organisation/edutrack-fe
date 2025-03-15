/**
 * SubcategorisedTopicsCovered Component
 *
 * A dashboard component that displays topics grouped by categories with visualizations.
 * Features:
 * - Groups topics by their main category (split by ':')
 * - Displays categorized topics in cards with scrollable lists
 * - Shows pie charts for topic frequency distribution within each category
 * - Includes a toggle for categorization mode
 */

import { Box, Checkbox, Chip, Grid, Tooltip, Typography } from "@mui/material";
import { TopicFrequency } from "../../types/types";
import InfoIcon from "@mui/icons-material/Info";
import { PieChart } from "@mui/x-charts";
import React from "react";
import { GradientCardBlue, StyledBox } from "./styles";

interface SubcategorisedTopicsCoveredProps {
    topicFrequencies: TopicFrequency[];
    onChange: (checked: boolean) => void;
}

interface SectionHeaderProps {
    onCategorizeChange: (checked: boolean) => void;
}

interface CategoryCardProps {
    category: string;
    topics: TopicFrequency[];
}

/**
 * Renders the header section with title, info tooltip, and categorization toggle
 * @param onCategorizeChange - Callback for category view toggle
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
    onCategorizeChange,
}) => (
    <>
        <Box display="flex" alignItems="center" sx={{ mb: "0.5rem" }}>
            <Typography fontWeight="bolder" fontSize="17px">
                Topics Covered (Separated into Categories)
            </Typography>
            <Tooltip
                title="These are the topics covered in the scope for this exam paper, separated into categories. This functionality works by splitting the topic label by the first colon ':' character."
                placement="right"
            >
                <InfoIcon sx={{ fontSize: "1.3rem", ml: "0.5rem" }} />
            </Tooltip>
            <Checkbox
                defaultChecked
                onChange={() => onCategorizeChange(false)}
            />
            <Typography>Categorise Topics Covered</Typography>
        </Box>
        <Typography fontWeight="light" sx={{ mb: "0.5rem" }}>
            Hover over the pie chart to see the frequency of each topic
        </Typography>
    </>
);

/**
 * Renders a category card with topic chips and frequency pie chart
 * @param category - Category name
 * @param topics - Array of topics with their frequencies
 */
const CategoryCard: React.FC<CategoryCardProps> = ({ category, topics }) => (
    <GradientCardBlue>
        <Typography fontWeight="bolder" fontSize="17px" mb="0.5rem">
            {category}
        </Typography>
        <StyledBox className="topics-container">
            {topics.map((topic, index) => (
                <Tooltip title={topic.label} key={index}>
                    <Chip
                        label={topic.label}
                        sx={{ alignSelf: "flex-start", minHeight: "2rem" }}
                    />
                </Tooltip>
            ))}
        </StyledBox>
        <PieChart
            series={[
                {
                    data: topics, // The dataset for the pie chart
                    highlightScope: { fade: "global", highlight: "item" }, // When hovering, fades all segments except the highlighted one
                    faded: {
                        innerRadius: 30, // Sets the inner radius of faded segments
                        additionalRadius: -30, // Reduces the size of faded segments
                        color: "gray", // Color of faded segments
                    },
                    innerRadius: 30,
                },
            ]}
            width={250}
            height={180}
            slotProps={{ legend: { hidden: true } }}
        />
    </GradientCardBlue>
);

/**
 * Groups topics by their main category (split by ':')
 */
const categoriseTopics = (topicFrequencies: TopicFrequency[]) => {
    const categories = new Map();
    topicFrequencies.forEach((topic) => {
        const category = topic.label.split(":")[0];
        categories.set(
            category,
            categories.has(category)
                ? [...categories.get(category), topic]
                : [topic]
        );
    });
    return categories;
};

const SubcategorisedTopicsCovered: React.FC<
    SubcategorisedTopicsCoveredProps
> = ({ topicFrequencies, onChange }) => {
    const categorisedTopics = categoriseTopics(topicFrequencies);

    return (
        <Box className="subcategorised-topics-covered-container">
            <SectionHeader onCategorizeChange={onChange} />
            <Grid container spacing={2}>
                {/* iterate through the categorisedTopics */}
                {Array.from(categorisedTopics).map(
                    ([category, topics], index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <CategoryCard category={category} topics={topics} />
                        </Grid>
                    )
                )}
            </Grid>
        </Box>
    );
};

export default SubcategorisedTopicsCovered;
