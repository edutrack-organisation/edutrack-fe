import { Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { theme } from "../theme"

const LandingPage = () => {
  return (
    <Box sx={{ flex: 1, flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ background: theme.colors.main, flex: 1, padding: 10, marginBottom: 5 }}>
        <Typography
          fontSize={"4rem"}
          fontFamily={"monospace"}
          textAlign={"center"}
          fontWeight={"bold"}
        >
          EduTrack
        </Typography>
        <Typography
          fontSize={"2.8rem"}
          fontFamily={"monospace"}
          textAlign={"center"}
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

        <Stack direction="row" spacing={2} margin={5}>
          <Box flex={1} >
            <Skeleton variant="rectangular" width={400} height={300} sx={{ marginLeft: "auto", marginRight: "auto" }} />
          </Box>
          <Stack sx={{ flex: 2 }} >
            <Typography
              fontSize={"2.8rem"}
              textAlign={"center"}
            >
              Question Bank
            </Typography>
            <Typography
              fontSize={"1.3rem"}
              textAlign={"center"}
            >
              Auto-generate corpus of questions from past year papers.
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} margin={5}>
          <Box flex={1} >
            <Skeleton variant="rectangular" width={400} height={300} sx={{ marginLeft: "auto", marginRight: "auto" }} />
          </Box>
          <Stack sx={{ flex: 2 }} >
            <Typography
              fontSize={"2.8rem"}
              textAlign={"center"}
            >
              Knowledge Graph
            </Typography>
            <Typography
              fontSize={"1.3rem"}
              textAlign={"center"}
            >
              This is a map of all knowledge used to infer the coverage and scope of different educational activities.
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} margin={5}>
          <Box flex={1} >
            <Skeleton variant="rectangular" width={400} height={300} sx={{ marginLeft: "auto", marginRight: "auto" }} />
          </Box>
          <Stack sx={{ flex: 2 }} >
            <Typography
              fontSize={"2.8rem"}
              textAlign={"center"}
            >
              Assessment Generator
            </Typography>
            <Typography
              fontSize={"1.3rem"}
              textAlign={"center"}
            >
              The knowledge graph and the question bank would be leveraged to generate assessments.
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} margin={5}>
          <Box flex={1} >
            <Skeleton variant="rectangular" width={400} height={300} sx={{ marginLeft: "auto", marginRight: "auto" }} />
          </Box>
          <Stack sx={{ flex: 2 }} >
            <Typography
              fontSize={"2.8rem"}
              textAlign={"center"}
            >
              Assessment Metric
            </Typography>
            <Typography
              fontSize={"1.3rem"}
              textAlign={"center"}
            >
              Each student's performance would be normalized by generating a metric that is independent of the assessment.
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} margin={5}>
          <Box flex={1} >
            <Skeleton variant="rectangular" width={400} height={300} sx={{ marginLeft: "auto", marginRight: "auto" }} />
          </Box>
          <Stack sx={{ flex: 2 }} >
            <Typography
              fontSize={"2.8rem"}
              textAlign={"center"}
            >
              Intuitive UI
            </Typography>
            <Typography
              fontSize={"1.3rem"}
              textAlign={"center"}
            >
              Use intuitive UI/UX to navigate the site.
            </Typography>
          </Stack>
        </Stack>

      </Stack>
    </Box>
  );
};

export default LandingPage;
