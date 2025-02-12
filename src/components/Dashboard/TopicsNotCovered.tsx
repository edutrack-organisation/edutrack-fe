import { Box, Checkbox, Chip, Tooltip, Typography } from "@mui/material";

interface TopicsNotCoveredProps {
    notCoveredTopics: string[];
    onChange: (checked: boolean) => void;
}

const TopicsNotCovered = ({
    notCoveredTopics,
    onChange,
}: TopicsNotCoveredProps) => {
    return (
        <Box className="topics-not-covered-container">
            <Box display={"flex"} alignItems={"center"} sx={{ mb: "0.5rem" }}>
                <Typography fontWeight={"bolder"} fontSize={"17px"}>
                    Topics Not Covered
                </Typography>
                <Checkbox onChange={() => onChange(true)} />
                <Typography>Catagorise Topics Not Covered</Typography>
            </Box>
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
