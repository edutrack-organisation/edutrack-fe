/**
 * TopicsNotCovered Component
 *
 * A dashboard component that displays topics not covered in the exam paper.
 * Features:
 * - Displays a list of uncovered topics as chips
 * - Includes a toggle for topic categorization
 * - Provides tooltips for topic names
 */

import { Box, Checkbox, Chip, Tooltip, Typography } from "@mui/material";
import React from "react";

interface TopicsNotCoveredHeaderProps {
    onCategorizeChange: (checked: boolean) => void;
}

interface TopicsChipListProps {
    topics: string[];
}

interface TopicsNotCoveredProps {
    notCoveredTopics: string[];
    onChange: (checked: boolean) => void;
}

/**
 * Header component for Topics Not Covered section
 * Displays the section title and categorization toggle
 */
const TopicsNotCoveredHeader: React.FC<TopicsNotCoveredHeaderProps> = ({
    onCategorizeChange,
}) => (
    <Box display="flex" alignItems="center" sx={{ mb: "0.5rem" }}>
        <Typography fontWeight="bolder" fontSize="17px">
            Topics Not Covered
        </Typography>
        <Checkbox onChange={() => onCategorizeChange(true)} />
        <Typography>Categorise Topics Not Covered</Typography>
    </Box>
);

/**
 * Displays a list of uncovered topics as chips in a wrapped container
 * Each chip shows a topic name with a tooltip
 */
const TopicsChipList: React.FC<TopicsChipListProps> = ({ topics }) => (
    <Box
        className="topics-not-used-container"
        display="flex"
        flexWrap="wrap"
        sx={{ gap: "0.5rem", mb: "2rem" }}
    >
        {topics.map((topic, index) => (
            <Tooltip title={topic} key={index}>
                <Chip label={topic} sx={{ width: "15rem" }} />
            </Tooltip>
        ))}
    </Box>
);

const TopicsNotCovered: React.FC<TopicsNotCoveredProps> = ({
    notCoveredTopics,
    onChange,
}) => {
    return (
        <Box className="topics-not-covered-container">
            <TopicsNotCoveredHeader onCategorizeChange={onChange} />
            <TopicsChipList topics={notCoveredTopics} />
        </Box>
    );
};

export default TopicsNotCovered;
