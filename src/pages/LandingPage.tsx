import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { theme } from "../theme"

const LandingPage = () => {
  return (
    <Box sx={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', flex: 1, padding: 10, marginBottom: 5 }}>
        <Typography
          fontSize={"4rem"}
          fontFamily={"Poppins, sans-serif"}
          textAlign={"center"}
          fontWeight={"bold"}
          sx={{ color: theme.colors.secondary }}
        >
          EduTrack
        </Typography>
        <Typography
          fontSize={"2.8rem"}
          fontFamily={"Poppins, sans-serif"}
          textAlign={"center"}
          sx={{ color: theme.colors.secondary }}
        >
          measure the impact of education practices on learning outcomes.
        </Typography>
      </Box>
      <Typography
        fontSize={"2.8rem"}
        fontWeight={"bold"}
        fontFamily={"monospace"}
        textAlign={"center"}
        sx={{ textDecoration: "underline" }}
        
      >
        Features
      </Typography>


      <Stack divider={<Divider flexItem />}>

        <FeatureStack
          image={<Skeleton variant="rectangular" width={400} height={300} sx={{ marginLeft: "auto", marginRight: "auto" }} />}
          title={"Question Bank"}
          desc={"Auto-generate corpus of questions from past year papers."}
        />

        <FeatureStack
          image={<Skeleton variant="rectangular" width={400} height={300} sx={{ marginLeft: "auto", marginRight: "auto" }} />}
          title={"Knowledge Graph"}
          desc={"This is a map of all knowledge used to infer the coverage and scope of different educational activities."}
        />

        <FeatureStack
          image={<Skeleton variant="rectangular" width={400} height={300} sx={{ marginLeft: "auto", marginRight: "auto" }} />}
          title={"Assessment Generator"}
          desc={"The knowledge graph and the question bank would be leveraged to generate assessments."}
        />

        <FeatureStack
          image={<Skeleton variant="rectangular" width={400} height={300} sx={{ marginLeft: "auto", marginRight: "auto" }} />}
          title={"Assessment Metric"}
          desc={"Each student's performance would be normalized by generating a metric that is independent of the assessment."}
        />

        <FeatureStack
          image={<Skeleton variant="rectangular" width={400} height={300} sx={{ marginLeft: "auto", marginRight: "auto" }} />}
          title={"Intuitive UI"}
          desc={"Use intuitive UI/UX to navigate the site."}
        />

      </Stack>
    </Box>
  );
};

const FeatureStack = ({ image, title, desc }: any) => {
  return (
    <Stack direction={{ sm: 'column', md: 'row' }} spacing={2} margin={5}>
      <Box flex={1} >
        {/* <Skeleton variant="rectangular" width={400} height={300} sx={{ marginLeft: "auto", marginRight: "auto" }} /> */}
        {image}
      </Box>
      <Stack sx={{ flex: 2 }} >
        <Typography
          fontSize={"2.8rem"}
          textAlign={"center"}
        >
          {title}
        </Typography>
        <Typography
          fontSize={"1.3rem"}
          textAlign={"center"}
        >
          {desc}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default LandingPage;
