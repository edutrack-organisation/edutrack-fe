import {
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    Grid,
    styled,
    Tooltip,
    Typography,
} from "@mui/material";
import { TopicFrequency } from "../../types/types";
import InfoIcon from "@mui/icons-material/Info";
import { PieChart } from "@mui/x-charts";

interface SubcategorisedTopicsCoveredProps {
    topicFrequencies: TopicFrequency[];
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

const SubcategorisedTopicsCovered = ({
    topicFrequencies,
    onChange,
}: SubcategorisedTopicsCoveredProps) => {
    function categoriseTopics(topicFrequencies: TopicFrequency[]) {
        let categories = new Map();
        topicFrequencies.forEach((topic) => {
            let category = topic.label.split(":")[0];
            if (categories.has(category)) {
                categories.set(category, [...categories.get(category), topic]);
            } else {
                categories.set(category, [topic]);
            }
        });

        return categories;
    }

    const categorisedTopics = categoriseTopics(topicFrequencies);

    return (
        <Box className="subcategorised-topics-covered-container">
            <Box display={"flex"} alignItems={"center"} sx={{ mb: "0.5rem" }}>
                <Typography fontWeight={"bolder"} fontSize={"17px"}>
                    Topics Covered (Seperated into Categories)
                </Typography>
                <Tooltip
                    title="These are the topics covered in the scope for this exam paper, seperated into categories. This functionality works by splitting the topic label by the first colon ':' character."
                    placement="right"
                >
                    <InfoIcon sx={{ fontSize: "1.3rem", ml: "0.5rem" }} />
                </Tooltip>
                <Checkbox defaultChecked onChange={() => onChange(false)} />
                <Typography>Catagorise Topics Covered</Typography>
            </Box>
            <Typography fontWeight={"light"} sx={{ mb: "0.5rem" }}>
                Hover over the pie chart to see the frequency of each topic
            </Typography>

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
                                    {topics.map(
                                        (t: TopicFrequency, index: number) => (
                                            <Tooltip
                                                title={t.label}
                                                key={index}
                                            >
                                                <Chip
                                                    label={t.label}
                                                    sx={{
                                                        alignSelf: "flex-start",
                                                        minHeight: "2rem",
                                                    }}
                                                />
                                            </Tooltip>
                                        )
                                    )}
                                </StyledBox>
                                <PieChart
                                    series={[
                                        {
                                            data: topics,

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
                                    width={250}
                                    height={180}
                                    slotProps={{ legend: { hidden: true } }}
                                />
                            </StyledCard>
                        </Grid>
                    )
                )}
            </Grid>
        </Box>
    );
};

export default SubcategorisedTopicsCovered;
