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
  Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    Box
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

const BLOOM_LEVELS = [
  "Remember",
  "Understand",
  "Apply",
  "Analyze",
  "Evaluate",
  "Create",
];

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
                <TableCell sx={{ width: "40%" }} align="left">
                  {" "}
                  {/* Slightly reduced width to fit the new column */}
                  Description
                </TableCell>
                <TableCell sx={{ width: "20%" }} align="left">
                  Topics
                </TableCell>
                <TableCell sx={{ width: "10%" }} align="left">
                  Level
                </TableCell>
                <TableCell sx={{ width: "10%" }} align="left">
                  Type
                </TableCell>
                <TableCell sx={{ width: "10%" }} align="left">
                  Marks
                </TableCell>
                <TableCell align="right">Difficulty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <>
                  {/* Question Row */}
                  <TableRow
                    key={row.uuid}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>

                    <TableCell align="left">
                      <TextArea
                        required
                        className="textarea"
                        textContent={row.description}
                        onChange={(event) =>
                          handlers.handleDescriptionChange(
                            index,
                            event.target.value,
                          )
                        }
                      />
                    </TableCell>

                    <TableCell align="left">
                      <CreatableSelect
                        required
                        isMulti
                        value={formatTopicsForReactSelect(row.topics)}
                        options={formatTopicsForReactSelect(allTopics)}
                        onChange={(newChip) =>
                          handlers.handleTopicsChange(
                            index,
                            deformatTopicsForReactSelect(newChip),
                          )
                        }
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            width: "350px",
                          }),
                          menuList: (baseStyles) => ({
                            ...baseStyles,
                            maxHeight: "200px",
                            overflowY: "auto",
                            ...scrollbarStyle,
                          }),
                        }}
                      />
                    </TableCell>

                    <TableCell align="left">
                      <Select
                        value={row.level || "Remember"} // Default safe fallback
                        size="small"
                        fullWidth
                        onChange={(e) =>
                          handlers.handleLevelChange(index, e.target.value)
                        }
                        sx={{
                          fontSize: "0.875rem",
                          backgroundColor: "white",
                          minWidth: "110px",
                        }}
                      >
                        {BLOOM_LEVELS.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>

                    <TableCell align="left">
                      <Select
                        value={row.type || "MCQ"} // Default to MCQ
                        size="small"
                        fullWidth
                        onChange={(e) =>
                          handlers.handleTypeChange(index, e.target.value)
                        }
                        sx={{
                          fontSize: "0.875rem",
                          backgroundColor: "white",
                          minWidth: "90px",
                        }}
                      >
                        <MenuItem value="MCQ">MCQ</MenuItem>
                        <MenuItem value="MRQ">MRQ</MenuItem>
                      </Select>
                    </TableCell>

                    <TableCell align="left">
                      <TextField
                        type="number"
                        required
                        inputProps={{ min: 1 }}
                        defaultValue={row.mark || 0}
                        variant="outlined"
                        onChange={(event) =>
                          handlers.handleMarkChange(
                            index,
                            parseInt(event.target.value),
                          )
                        }
                        sx={tableStyles.textField}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <TextField
                        type="number"
                        required
                        inputProps={{ min: 1, max: 5 }}
                        defaultValue={row.difficulty || 0}
                        variant="outlined"
                        onChange={(event) =>
                          handlers.handleDifficultyChange(
                            index,
                            parseInt(event.target.value),
                          )
                        }
                        sx={tableStyles.textField}
                      />
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Delete Question">
                        <IconButton
                          onClick={() => handlers.handleQuestionDelete(index)}
                        >
                          <DeleteOutlineIcon sx={tableStyles.icon} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Tooltip title="Add Question">
                        <IconButton
                          onClick={() => handlers.handleQuestionAdd(index)}
                        >
                          <AddCircleOutlineIcon sx={tableStyles.icon} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>

                  {/* Overview Row (Shown Below Each Question) */}
                  {row.overview && (
                    <TableRow key={`overview-${row.uuid}`}>
                      <TableCell
                        colSpan={7}
                        sx={{ backgroundColor: "#f9f9f9" }}
                      >
                        <strong>Option Overviews:</strong>
                        <Box
                          display="flex"
                          flexWrap="wrap"
                          gap={1}
                          mt={2}
                          justifyContent="flex-end"
                        >
                          {Object.entries(row.overview).map(([opt, detail]) => (
                            <Box
                              key={opt}
                              width="180px"
                              border="1px solid #ddd"
                              borderRadius={1}
                              padding={1}
                              bgcolor="#fff"
                              fontSize="0.75rem"
                            >
                              <Typography
                                fontWeight="bold"
                                fontSize="0.75rem"
                                gutterBottom
                              >
                                Option {opt}
                              </Typography>

                              <Typography
                                fontSize="0.7rem"
                                fontStyle="italic"
                                gutterBottom
                              >
                                Interpretation:
                              </Typography>
                              <TextArea
                                textContent={detail.interpretation}
                                onChange={(e) =>
                                  handlers.handleOverviewChange?.(
                                    index,
                                    opt,
                                    "interpretation",
                                    e.target.value,
                                  )
                                }
                                style={{
                                  fontSize: "0.7rem",
                                  minHeight: "40px",
                                }}
                              />

                              <Typography
                                fontSize="0.7rem"
                                fontStyle="italic"
                                mt={1}
                                gutterBottom
                              >
                                Likely Misunderstanding:
                              </Typography>
                              <TextArea
                                textContent={detail.likely_misunderstanding}
                                onChange={(e) =>
                                  handlers.handleOverviewChange?.(
                                    index,
                                    opt,
                                    "likely_misunderstanding",
                                    e.target.value,
                                  )
                                }
                                style={{
                                  fontSize: "0.7rem",
                                  minHeight: "40px",
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
};

export default ContentTable;
