import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import TextArea from "./TextArea";
import { MuiChipsInput } from "mui-chips-input";
import { DataItem, Handlers } from "../../types/types";
interface ContentTableProps {
    data: DataItem[];
    handlers: Handlers;
}

const ContentTable: React.FC<ContentTableProps> = ({ data, handlers }) => {
    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    // width: { lg: "90%", xl: "80%" },
                    mt: "1.5rem",
                }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: "10%" }}>
                                Question Number
                            </TableCell>
                            <TableCell sx={{ width: "50%" }} align="left">
                                Description
                            </TableCell>
                            <TableCell sx={{ width: "30%" }} align="left">
                                Topics
                            </TableCell>
                            <TableCell align="right">Difficulty</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow
                                key={row.question_uuid}
                                sx={{
                                    "&:last-child td, &:last-child th": {
                                        border: 0,
                                    },
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell align="left">
                                    <TextArea
                                        textContent={row.description}
                                        onChange={(event) =>
                                            handlers.handleDescriptionChange(
                                                index,
                                                event.target.value
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell align="left">
                                    <MuiChipsInput
                                        value={row.topics}
                                        onChange={(newChip) =>
                                            handlers.handleTopicsChange(
                                                index,
                                                newChip
                                            )
                                        }
                                        sx={{
                                            width: "350px",
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: "#E5EAF2", // Custom border color
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#B0BEC5", // Border color on hover
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#1E88E5", // Border color when focused
                                                },
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        type="number"
                                        id="outlined-basic"
                                        defaultValue={row.difficulty || 0}
                                        variant="outlined"
                                        onChange={(event) =>
                                            handlers.handleDifficultyChange(
                                                index,
                                                parseInt(event.target.value)
                                            )
                                        }
                                        sx={{
                                            "& .MuiTextField-root": {
                                                "& fieldset": {
                                                    borderColor: "#E5EAF2", // Custom border color
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: "#B0BEC5", // Border color on hover
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#1E88E5", // Border color when focused
                                                },
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => {
                                            handlers.handleQuestionDelete(
                                                index
                                            );
                                        }}
                                        sx={{
                                            alignSelf: "flex-end",
                                            margin: "1rem",
                                        }}
                                        variant="contained"
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default ContentTable;
