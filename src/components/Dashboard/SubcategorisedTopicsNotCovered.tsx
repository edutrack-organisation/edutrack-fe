import {
    Box,
    Card,
    Checkbox,
    Chip,
    Grid,
    styled,
    Tooltip,
    Typography,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

interface SubcategorisedTopicsNotCoveredProps {
    notCoveredTopics: string[];
    onChange: (checked: boolean) => void;
}

// Styled components
const StyledBox = styled(Box)(({}) => ({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    height: "10rem",
    overflow: "auto",
    //customise the scroll color
    "::-webkit-scrollbar": {
        width: "6px", // Width of the scrollbar
    },
    "::-webkit-scrollbar-track": {
        background: "#ebebeb", // Background of the scrollbar track
        borderRadius: "8px",
    },
    "::-webkit-scrollbar-thumb": {
        background: "#c2c2c2", // Color of the scrollbar thumb
        borderRadius: "8px", // Rounded corners for the scrollbar thumb
    },
}));

const StyledCard = styled(Card)(({}) => ({
    padding: "1rem",
    borderRadius: "1.5rem",
    backgroundColor: `background: rgb(255,255,255);
background: -moz-linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(231,250,255,1) 94%);
background: -webkit-linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(231,250,255,1) 94%);
background: linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(231,250,255,1) 94%);
filter: progid:DXImageTransform.Microsoft.gradient(startColorstr="#ffffff",endColorstr="#e7faff",GradientType=1);`,
}));

const SubcategorisedTopicsNotCovered = ({
    notCoveredTopics,
    onChange,
}: SubcategorisedTopicsNotCoveredProps) => {
    function categoriseTopics(notCoveredTopics: string[]) {
        let categories = new Map();
        notCoveredTopics.forEach((topic) => {
            let category = topic.split(":")[0];
            if (categories.has(category)) {
                categories.set(category, [...categories.get(category), topic]);
            } else {
                categories.set(category, [topic]);
            }
        });

        return categories;
    }

    const categorisedTopics = categoriseTopics(notCoveredTopics);

    return (
        <Box className="subcategorised-topics-not-covered-container">
            <Box display={"flex"} alignItems={"center"} sx={{ mb: "0.5rem" }}>
                <Typography fontWeight={"bolder"} fontSize={"17px"}>
                    Topics Not Covered (Seperated into Categories)
                </Typography>
                <Tooltip
                    title="These are the not topics covered in the scope for this exam paper, seperated into categories. This functionality works by splitting the topic label by the first colon ':' character."
                    placement="right"
                >
                    <InfoIcon sx={{ fontSize: "1.3rem", ml: "0.5rem" }} />
                </Tooltip>
                <Checkbox defaultChecked onChange={() => onChange(false)} />
                <Typography>Catagorise Topics Not Covered</Typography>
            </Box>

            {/* iterate through the categorisedTopics */}
            <Grid container spacing={2}>
                {Array.from(categorisedTopics).map(
                    ([category, topics], index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <StyledCard>
                                <Typography
                                    fontWeight={"bolder"}
                                    fontSize={"17px"}
                                    mb="0.5rem"
                                >
                                    {category}
                                </Typography>
                                <StyledBox className="topics-container">
                                    {topics.map((t: string, index: number) => (
                                        <Tooltip title={t} key={index}>
                                            <Chip
                                                label={t}
                                                sx={{
                                                    alignSelf: "flex-start",
                                                    minHeight: "2rem",
                                                }}
                                            />
                                        </Tooltip>
                                    ))}
                                </StyledBox>
                            </StyledCard>
                        </Grid>
                    )
                )}
            </Grid>
        </Box>
    );
};

export default SubcategorisedTopicsNotCovered;
