import { Box, Chip, Tooltip, Typography } from "@mui/material";

interface TopicsNotCoveredProps {
    notCoveredTopics: string[];
}

const TopicsNotCovered = ({ notCoveredTopics }: TopicsNotCoveredProps) => {
    return (
        <Box className="topics-not-covered-container">
            <Typography fontWeight={"bolder"} fontSize={"17px"} mb="0.5rem">
                Topics Not Covered
            </Typography>
            <Box
                className="topics-not-used-container"
                display={"flex"}
                flexWrap={"wrap"} // Ensure the content wraps
                sx={{
                    gap: "0.5rem",
                    mb: "2rem",
                }}
            >
                {notCoveredTopics.map((t: string, index: number) => (
                    <Tooltip title={t} key={index}>
                        <Chip
                            label={t}
                            sx={{
                                width: "15rem",
                            }}
                        />
                    </Tooltip>
                ))}
            </Box>
        </Box>
    );
};

export default TopicsNotCovered;
