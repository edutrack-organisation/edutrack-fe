import { Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Api from "../api/Api";
import { COLORS } from "../constants/constants";
import type { CourseItem } from "../types/types";

const CourseSelectPage = () => {
    const navigate = useNavigate();

    const [isFetchingCourses, setIsFetchingCourses] = useState<boolean>(true);
    const [courseTitleToAdd, setCourseTitleToAdd] = useState<string>('');
    const [isAddingCourse, setIsAddingCourse] = useState<boolean>(false);
    const [courses, setCourses] = useState<CourseItem[]>();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = () => {
        setIsFetchingCourses(true);
        Api.getCourses().then((response) => {
            if (response.success) {
                setCourses(response.data);
            } else {
                toast.error("Error fetching courses");
            }
        }).catch((error) => {
            toast.error("Error fetching courses");
        }).finally(() => {
            setIsFetchingCourses(false);
        });
    };

    const handleCourseSelect = (courseId: number) => {
        navigate(`/courses/${encodeURIComponent(courseId)}`);
    };

    const handleAddCourse = (courseTitle: string) => {
        setIsAddingCourse(true);
        Api.addCourse(courseTitle).then((response) => {
            if (response.success) {
                toast.success("Course added!");
                fetchCourses();
            } else {
                toast.error("Failed to add course");
            }
        }).finally(() => {
            setIsAddingCourse(false);
        });
    };

    return (
        <Box sx={containerStyle}>
            {isAddingCourse ? (
                <CircularProgress sx={{ alignSelf: "center", margin: 3 }} />
            ) : (
                <Box sx={{display: "flex", width: "100%", alignItems: "center", justifyContent: "center", margin: 1 }}>
                    <TextField value={courseTitleToAdd} onChange={(event) => {setCourseTitleToAdd(event.target.value)}} sx={{ width: "50%" }} />
                    <Button variant="contained" onClick={() => {handleAddCourse(courseTitleToAdd)}} sx={{ width: "15%", marginLeft: 3 }}>Add Course</Button>
                </Box>
            )}
            {isFetchingCourses
                ? <CircularProgress size={"100px"} sx={{ color: COLORS.HIGHLIGHT, alignSelf: "center", margin: 3 }} />
                : <Stack sx={{ width: "100%", alignItems: 'center' }}>
                    {courses!.map((course) =>
                        <Button key={`Course ${course.courseId}`} variant='outlined' sx={{ width: "70%", marginY: 1 }} onClick={() => handleCourseSelect(course.courseId)}>
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
    flexDirection: "column",
    background: COLORS.WHITE,
};

export default CourseSelectPage;