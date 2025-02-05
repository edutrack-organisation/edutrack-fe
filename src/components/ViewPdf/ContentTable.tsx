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
import { MultiValue } from "react-select";
interface ContentTableProps {
    data: DataItemWithUUID[];
    handlers: Handlers;
    allTopics: string[];
}

const ContentTable: React.FC<ContentTableProps> = ({
    data,
    handlers,
    allTopics,
}) => {
    // Helper functions to format topics properly for react-select rendering
    // React-select requires the value to be in the format {label: string, value: string}
    const formatTopicsForReactSelect = (topics: string[]) => {
        return topics.map((topic) => {
            return { label: topic, value: topic };
        });
    };

    // Helper function to deformat topics for react-select (from {label: string, value: string} to string[])
    const deformatTopicsForReactSelect = (
        topicsLabelValue: MultiValue<{ label: string; value: string }>
    ) => {
        return topicsLabelValue.map((t) => {
            return t.label;
        });
    };

    return (
        <>
            <TableContainer
                component={Paper}
                sx={{
                    // width: { lg: "90%", xl: "80%" },
                    mt: "16rem",
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
                                            handlers.handleDescriptionChange(
                                                index,
                                                event.target.value
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell align="left">
                                    <CreatableSelect
                                        isMulti
                                        value={formatTopicsForReactSelect(
                                            row.topics
                                        )}
                                        options={formatTopicsForReactSelect(
                                            allTopics
                                        )}
                                        onChange={(newChip) =>
                                            handlers.handleTopicsChange(
                                                index,
                                                deformatTopicsForReactSelect(
                                                    newChip
                                                )
                                            )
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
                                                "::-webkit-scrollbar": {
                                                    width: "6px", // Width of the scrollbar
                                                },
                                                "::-webkit-scrollbar-track": {
                                                    background: "#ebebeb", // Background of the scrollbar track
                                                    borderRadius: "8px",
                                                },
                                                "::-webkit-scrollbar-thumb": {
                                                    background: "#c2c2c2", // Color of the scrollbar thumb
                                                    borderRadius: "8px", // Rounded corners for the scrollbar thumb
                                                },
                                            }),
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
                                    <Tooltip title="Delete Question">
                                        <IconButton
                                            onClick={() => {
                                                handlers.handleQuestionDelete(
                                                    index
                                                );
                                            }}
                                        >
                                            <DeleteOutlineIcon
                                                sx={{
                                                    height: "2rem",
                                                    width: "2rem",
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Add Question">
                                        <IconButton
                                            onClick={() => {
                                                handlers.handleQuestionAdd(
                                                    index
                                                );
                                            }}
                                        >
                                            <AddCircleOutlineIcon
                                                sx={{
                                                    height: "2rem",
                                                    width: "2rem",
                                                }}
                                            />
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
