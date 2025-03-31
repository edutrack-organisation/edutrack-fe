/**
 * SubcategorisedTopicsNotCovered Component
 *
 * A dashboard component that displays uncovered topics grouped by categories.
 * Features:
 * - Groups topics by their main category (split by ':')
 * - Displays categorized topics in cards with scrollable lists
 * - Includes a toggle for categorization mode
 */

import { Box, Checkbox, Chip, Grid, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { GradientCardBlue, StyledBox } from "./styles";

interface SubcategorisedTopicsNotCoveredProps {
    notCoveredTopics: string[];
    onChange: (checked: boolean) => void;
}
interface SectionHeaderProps {
    onCategorizeChange: (checked: boolean) => void;
}

interface CategoryCardProps {
    category: string;
    topics: string[];
}

/**
 * Renders the header section with title, info tooltip, and categorization toggle
 * @param onCategorizeChange - Callback for category view toggle
 */
const SectionHeader: React.FC<SectionHeaderProps> = ({
    onCategorizeChange,
}) => (
    <Box display="flex" alignItems="center" sx={{ mb: "0.5rem" }}>
        <Typography fontWeight="bolder" fontSize="17px">
            Topics Not Covered (Separated into Categories)
        </Typography>
        <Tooltip
            title="These are the topics not covered in the scope for this exam paper, separated into categories. This functionality works by splitting the topic label by the first colon ':' character."
            placement="right"
        >
            <InfoIcon sx={{ fontSize: "1.3rem", ml: "0.5rem" }} />
        </Tooltip>
        <Checkbox defaultChecked onChange={() => onCategorizeChange(false)} />
        <Typography>Categorise Topics Not Covered</Typography>
    </Box>
);

/**
 * Renders a category card with topic chips and scrollable list
 * @param category - Category name
 * @param topics - Array of topics in this category
 */
const CategoryCard: React.FC<CategoryCardProps> = ({ category, topics }) => (
    <GradientCardBlue>
        <Typography fontWeight="bolder" fontSize="17px" mb="0.5rem">
            {category}
        </Typography>
        <StyledBox className="topics-container">
            {topics.map((topic, index) => (
                <Tooltip title={topic} key={index}>
                    <Chip
                        label={topic}
                        sx={{ alignSelf: "flex-start", minHeight: "2rem" }}
                    />
                </Tooltip>
            ))}
        </StyledBox>
    </GradientCardBlue>
);

/**
 * Groups topics by their main category (split by ':')
 * @param topics - Array of topics to categorize
 * @returns Map of categories to their topics
 */
const categoriseTopics = (topics: string[]) => {
    const categories = new Map();
    topics.forEach((topic) => {
        const category = topic.split(":")[0];
        categories.set(
            category,
            categories.has(category)
                ? [...categories.get(category), topic]
                : [topic]
        );
    });
    return categories;
};

const SubcategorisedTopicsNotCovered = ({
    notCoveredTopics,
    onChange,
}: SubcategorisedTopicsNotCoveredProps) => {
    const categorisedTopics = categoriseTopics(notCoveredTopics);

    return (
        <Box className="subcategorised-topics-not-covered-container">
            <SectionHeader onCategorizeChange={onChange} />

            {/* iterate through the categorisedTopics */}
            <Grid container spacing={2}>
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

export default SubcategorisedTopicsNotCovered;
