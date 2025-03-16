/**
 * @file ContentTable.tsx
 * @description Table component for displaying and editing uploaded questions
 * Features:
 * - Editable question descriptions using TextArea
 * - Topic management with multi-select and create options
 * - Mark and difficulty score inputs
 * - Question deletion and addition capabilities
 * - Handlers passed as props for all interactions
 */

import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from "@mui/material";
import TextArea from "./TextArea";
import { DataItemWithUUID, Handlers } from "../../types/types";

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CreatableSelect from "react-select/creatable";
import { scrollbarStyle, tableStyles } from "../../styles";
import { deformatTopicsForReactSelect, formatTopicsForReactSelect } from "../../utils";
interface ContentTableProps {
    data: DataItemWithUUID[];
    handlers: Handlers;
    allTopics: string[];
}

const ContentTable: React.FC<ContentTableProps> = ({ data, handlers, allTopics }) => {
    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    mt: "16rem",
                }}
            >
                <Table sx={tableStyles.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: "10%" }}>Question Number</TableCell>
                            <TableCell sx={{ width: "50%" }} align="left">
                                Description
                            </TableCell>
                            <TableCell sx={{ width: "20%" }} align="left">
                                Topics
                            </TableCell>
                            <TableCell sx={{ width: "10%" }} align="left">
                                Marks
                            </TableCell>
                            <TableCell align="right">Difficulty</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow
                                key={row.uuid}
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
                                        className="textarea"
                                        textContent={row.description}
                                        onChange={(event) =>
                                            handlers.handleDescriptionChange(index, event.target.value)
                                        }
                                    />
                                </TableCell>
                                <TableCell align="left">
                                    <CreatableSelect
                                        isMulti
                                        value={formatTopicsForReactSelect(row.topics)}
                                        options={formatTopicsForReactSelect(allTopics)}
                                        onChange={(newChip) =>
                                            handlers.handleTopicsChange(index, deformatTopicsForReactSelect(newChip))
                                        }
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                width: "350px",
                                            }),
                                            menuList: (baseStyles) => ({
                                                ...baseStyles,
                                                maxHeight: "200px", // Set max height for the dropdown
                                                overflowY: "auto", // Enable vertical scrolling
                                                ...scrollbarStyle, // Apply custom scrollbar styles
                                            }),
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="left">
                                    <TextField
                                        type="number"
                                        id="outlined-basic"
                                        defaultValue={row.mark || 0}
                                        variant="outlined"
                                        onChange={(event) =>
                                            handlers.handleMarkChange(index, parseInt(event.target.value))
                                        }
                                        sx={tableStyles.textField}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        type="number"
                                        id="outlined-basic"
                                        defaultValue={row.difficulty || 0}
                                        variant="outlined"
                                        onChange={(event) =>
                                            handlers.handleDifficultyChange(index, parseInt(event.target.value))
                                        }
                                        sx={tableStyles.textField}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Delete Question">
                                        <IconButton
                                            onClick={() => {
                                                handlers.handleQuestionDelete(index);
                                            }}
                                        >
                                            <DeleteOutlineIcon sx={tableStyles.icon} />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Add Question">
                                        <IconButton
                                            onClick={() => {
                                                handlers.handleQuestionAdd(index);
                                            }}
                                        >
                                            <AddCircleOutlineIcon sx={tableStyles.icon} />
                                        </IconButton>
                                    </Tooltip>
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
