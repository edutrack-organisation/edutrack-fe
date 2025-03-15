/**
 * AverageDifficultyByTopic Component
 *
 * A dashboard component that displays difficulty metrics for each topic.
 * Features:
 * - Shows average difficulty score per topic
 * - Displays difficulty distribution in bar charts
 * - Provides tooltips for topic names and details
 */

import { Box, Grid, Tooltip, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { DifficultyFrequencyAndAverageDifficultyForTopic } from "../../types/types";
import InfoIcon from "@mui/icons-material/Info";
import { GradientCardPurple } from "./styles";
import React from "react";

interface AverageDifficultyByTopicProps {
    difficultyFrequencyAndAverageDifficultyForEachTopic: DifficultyFrequencyAndAverageDifficultyForTopic[];
}

interface TopicDifficultyCardProps {
    topic: DifficultyFrequencyAndAverageDifficultyForTopic;
}

interface SectionHeaderProps {
    title: string;
    tooltipText: string;
}

/**
 * Renders the header section with title and info tooltip
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    tooltipText,
}) => (
    <Box display="flex" alignItems="center" sx={{ mb: "0.5rem" }}>
        <Typography fontWeight="bolder" fontSize="17px">
            {title}
        </Typography>
        <Tooltip title={tooltipText} placement="right">
            <InfoIcon sx={{ fontSize: "1.3rem", ml: "0.5rem" }} />
        </Tooltip>
    </Box>
);

/**
 * Renders a topic card with difficulty metrics and distribution chart
 */
const TopicDifficultyCard: React.FC<TopicDifficultyCardProps> = ({ topic }) => (
    <GradientCardPurple>
        <Tooltip title={topic.label} placement="bottom-end">
            <Typography
                fontWeight="bolder"
                sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                }}
            >
                {topic.label}
            </Typography>
        </Tooltip>
        <Typography fontWeight="bolder" fontSize="1.5rem" sx={{ mt: "0.2rem" }}>
            {topic.topicAverageDifficulty.toFixed(1)}
        </Typography>
        <Typography fontWeight="lighter" fontSize="0.7rem">
            Average Difficulty
        </Typography>
        <BarChart
            series={[{ dataKey: "frequency" }]}
            dataset={topic.topicDifficultyFrequency}
            xAxis={[
                {
                    scaleType: "band",
                    dataKey: "difficulty", // Specifies which property to use for x-axis values

                    label: "Difficulty", // Text label displayed below the x-axis
                },
            ]}
            width={300}
            height={150}
            borderRadius={5}
            yAxis={[
                {
                    label: "Frequency", // Text label displayed beside the y-axis
                    tickMinStep: 1, // Ensures y-axis ticks are whole numbers
                },
            ]}
        />
    </GradientCardPurple>
);

const AverageDifficultyByTopic: React.FC<AverageDifficultyByTopicProps> = ({
    difficultyFrequencyAndAverageDifficultyForEachTopic,
}) => {
    return (
        <Box className="average-difficulty-by-topic-container">
            <SectionHeader
                title="Difficulty by Topic"
                tooltipText="These are the difficulty levels for each topic based on the questions in the exam paper"
            />
            <Grid container spacing={2}>
                {difficultyFrequencyAndAverageDifficultyForEachTopic.map(
                    (perTopic, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <TopicDifficultyCard topic={perTopic} />
                        </Grid>
                    )
                )}
            </Grid>
        </Box>
    );
};

export default AverageDifficultyByTopic;
