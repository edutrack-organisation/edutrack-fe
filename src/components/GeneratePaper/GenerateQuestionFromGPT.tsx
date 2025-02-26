import { Box, Button, Typography } from "@mui/material";
import TextArea from "../ViewPdf/TextArea";

const GenerateQuestionFromGPT = () => {
    return (
        <>
            <Box mt={"1rem"}>
                <Typography
                    fontWeight={"bolder"}
                    sx={{
                        fontSize: "17px",
                        mb: "0.5rem",
                    }}
                >
                    Generate questions from scratch (by passing in prompt to
                    GPT-4o)
                </Typography>
                <TextArea
                    className="textarea"
                    placeHolder={"Type your prompt here..."}
                    // onChange={(event) =>
                    //     handlers.handleTitleChange(event.target.value)
                    // }
                />
            </Box>
            <Button
                variant="contained"
                sx={{ mt: "auto", alignSelf: "flex-start" }}
                onClick={() => console.log("not implemented")}
            >
                Generate
            </Button>
        </>
    );
};

export default GenerateQuestionFromGPT;
