import { Box, Chip, CircularProgress, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { COLORS } from "../constants/constants";
import { useEffect, useState } from "react";
import Api from "../api/Api";
import ApiMock from "../api/ApiMock";
import { QuestionItem } from "../types/types";

const QuestionBankPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<QuestionItem[]>();

    useEffect(() => {
        // ApiMock.getQuestionBank().then((response) => {
        //     setData(response.data);
        // }).finally(() => {
        //     setIsLoading(false);
        // });
        setIsLoading(false);
        setData(1);
    }, []);


    return (
        <Box sx={containerStyle}>
            {!isLoading && data // When loading is complete and data is present
                // ? <TableContainer component={Paper}>
                //     <Table>
                //         <TableHead>
                //             <TableRow>
                //                 <TableCell>Topic</TableCell>
                //                 <TableCell>Statistics</TableCell>
                //             </TableRow>
                //         </TableHead>
                //         <TableBody>
                //             {data!.map((item, index) => (
                //                 <TableRow key={index}>
                //                     <TableCell>
                //                         <Chip key={`${item.topic}`} label={item.topic} sx={{ margin: 1 }} />
                //                     </TableCell>
                //                     <TableCell>
                //                         <LinearProgress
                //                             variant="determinate"
                //                             value={item.value}
                //                             sx={{
                //                                 height: 10,
                //                                 borderRadius: 5,
                //                                 '& .MuiLinearProgress-bar': {
                //                                     backgroundColor: getColor(item.value)
                //                                 }
                //                             }}
                //                         />
                //                     </TableCell>
                //                 </TableRow>
                //             ))}
                //         </TableBody>
                //     </Table>
                // </TableContainer>
                ? <Typography>To be filled with questions</Typography>
                : <CircularProgress />
            }
        </Box>
    );
}

const containerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: COLORS.WHITE,
    padding: 3,
};

export default QuestionBankPage;
