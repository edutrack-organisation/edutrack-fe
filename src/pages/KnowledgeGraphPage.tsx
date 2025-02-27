import { Box, Chip, CircularProgress, LinearProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { COLORS } from "../constants/constants";
import { useEffect, useState } from "react";
import Api from "../api/Api";
import ApiMock from "../api/ApiMock";

const KnowledgeGraphPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [data, setData] = useState<TopicValue[]>();

    useEffect(() => {
        ApiMock.getTopicStatistics().then((response) => {
            setData(response.data);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []);


    return (
        <Box sx={containerStyle}>
            {!isLoading && data // When loading is complete and data is present
                ? <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Topic</TableCell>
                                <TableCell>Statistics</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data!.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Chip key={`${item.topic}`} label={item.topic} sx={{ margin: 1 }} />
                                    </TableCell>
                                    <TableCell>
                                        <LinearProgress
                                            variant="determinate"
                                            value={item.value}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: getColor(item.value)
                                                }
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <CircularProgress />
            }
        </Box>
    );
}

type TopicValue = {
    topic: string;
    value: number;
};

function getColor(value: number) {
    if (value <= 50) {
        // Normalize value between 0 and 1 for the first half.
        const t = value / 50;
        const r = 255; // stays constant
        const g = Math.round(t * 165); // interpolates from 0 to 165
        const b = 0;
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        // For values above 50, normalize between 0 and 1.
        const t = (value - 50) / 50;
        const r = Math.round(255 * (1 - t)); // decreases from 255 to 0
        // g goes from 165 (at 50) to 128 (at 100)
        const g = Math.round(165 + t * (128 - 165));
        const b = 0;
        return `rgb(${r}, ${g}, ${b})`;
    }
}

const containerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: COLORS.WHITE,
    padding: 3,
};

export default KnowledgeGraphPage;
