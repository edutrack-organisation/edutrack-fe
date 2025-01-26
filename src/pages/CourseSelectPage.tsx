import { Box, Button, CircularProgress, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiMock from "../api/ApiMock";
import { COLORS } from "../constants/constants";
import type { CourseItem } from "../types/types";

const CourseSelectPage = () => {
    const navigate = useNavigate();

    const [isFetchingCourses, setIsFetchingCourses] = useState<boolean>(true);
    const [courses, setCourses] = useState<CourseItem[]>();

    useEffect(() => {
        ApiMock.getCourses().then((result) => {
            setIsFetchingCourses(false);
            setCourses(result.data);
        });
    }, []);

    const handleCourseSelect = (courseId: number) => {
        navigate(`/courses/${encodeURIComponent(courseId)}`);
    };

    return (
        <Box sx={containerStyle}>
            {isFetchingCourses
                ? <CircularProgress size={"100px"} sx={{ color: COLORS.HIGHLIGHT, alignSelf: "center" }} />
                : <Stack sx={{ width: "100%", alignItems: 'center' }}>
                    {courses!.map((course) =>
                        <Button variant='outlined' sx={{ width: "70%", marginY: 1 }} onClick={() => handleCourseSelect(course.courseId)}>
                            {course.courseTitle}
                        </Button>
                    )}
                </Stack>}
        </Box>
    );
};

const containerStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    background: COLORS.WHITE,
};

export default CourseSelectPage;