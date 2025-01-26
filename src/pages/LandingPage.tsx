import { Box, Container, Divider, Stack, Typography } from "@mui/material";
import { theme } from "../theme";
import QuestionBankImage from "../assets/images/question_bank.jpg";
import KnowledgeGraphImage from "../assets/images/knowledge_graph.jpg";
import AssessmentGeneratorImage from "../assets/images/assessment_generator.jpg";
import AssessmentMetricImage from "../assets/images/assessment_metric.jpg";
import IntuitiveUiImage from "../assets/images/intuitive_ui.jpg";
import { COLORS } from "../constants/constants";

const LandingPage = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: COLORS.WHITE,
            }}
        >
            <Container
                sx={{
                    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                    minWidth: "100%",
                    padding: 10,
                    marginBottom: 5,
                }}
            >
                <Typography
                    fontSize={{ xs: "3rem", sm: "3.5rem", md: "4rem" }}
                    fontFamily={"Poppins, sans-serif"}
                    textAlign={"center"}
                    fontWeight={"bold"}
                    sx={{ color: COLORS.WHITE }}
                >
                    EduTrack
                </Typography>
                <Typography
                    fontSize={{ xs: "1.4rem", sm: "2.1rem", md: "2.8rem" }}
                    fontFamily={"Poppins, sans-serif"}
                    textAlign={"center"}
                    sx={{ color: COLORS.WHITE }}
                >
                    measure the impact of education practices on learning
                    outcomes.
                </Typography>
            </Container>
            <Typography
                fontSize={{ xs: "3rem", sm: "3.5rem", md: "4rem" }}
                fontWeight={"bold"}
                fontFamily={"monospace"}
                textAlign={"center"}
                sx={{ textDecoration: "underline" }}
            >
                Features
            </Typography>

            <Stack divider={<Divider flexItem />}>
                <FeatureStack
                    image={QuestionBankImage}
                    title={"Question Bank"}
                    desc={
                        "Auto-generate corpus of questions from past year papers."
                    }
                />

                <FeatureStack
                    image={KnowledgeGraphImage}
                    title={"Knowledge Graph"}
                    desc={
                        "This is a map of all knowledge used to infer the coverage and scope of different educational activities."
                    }
                />

                <FeatureStack
                    image={AssessmentGeneratorImage}
                    title={"Assessment Generator"}
                    desc={
                        "The knowledge graph and the question bank would be leveraged to generate assessments."
                    }
                />

                <FeatureStack
                    image={AssessmentMetricImage}
                    title={"Assessment Metric"}
                    desc={
                        "Each student's performance would be normalized by generating a metric that is independent of the assessment."
                    }
                />

                <FeatureStack
                    image={IntuitiveUiImage}
                    title={"Intuitive UI"}
                    desc={"Use intuitive UI/UX to navigate the site."}
                />
            </Stack>
        </Box>
    );
};

interface FeatureStackProps {
    image: string;
    title: string;
    desc: string;
}

const FeatureStack: React.FC<FeatureStackProps> = ({ image, title, desc }) => {
    return (
        <Stack direction={{ sm: "column", md: "row" }} spacing={2} margin={5}>
            <Box 
                flex={1}
                component="img"
                src={image}
                sx={{
                    width: { xs: '100%', sm: 400 },
                    height: { xs: 'auto', sm: 300 },
                    objectFit: 'contain',
                    paddingY: 2,
                }}>
            </Box>
            <Stack sx={{ flex: 2 }}>
                <Typography fontSize={{ xs: "2.2rem", sm: "2.5rem", md: "2.8rem" }} textAlign={"center"}>
                    {title}
                </Typography>
                <Typography fontSize={{ xs: "1.1rem", sm: "1.2rem", md: "1.3rem" }} textAlign={"center"}>
                    {desc}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default LandingPage;
