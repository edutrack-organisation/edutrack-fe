import { Box, Typography } from "@mui/material";
import TextArea from "./TextArea";

interface OverviewEditorProps {
  questionIndex: number;
  overview: {
    [key: string]: {
      interpretation: string;
      likely_misunderstanding: string;
    };
  };
  onChange: (
    questionIndex: number,
    optionKey: string,
    field: "interpretation" | "likely_misunderstanding",
    value: string
  ) => void;
}

const OverviewEditor: React.FC<OverviewEditorProps> = ({
  questionIndex,
  overview,
  onChange,
}) => {
  return (
    <Box
      mt={2}
      mb={3}
      px={2}
      py={1}
      border="1px dashed #ccc"
      borderRadius={2}
      width="100%"
    >
      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        Option Overviews
      </Typography>

      {Object.entries(overview).map(([opt, details]) => (
        <Box key={opt} mb={3}>
          <Typography fontWeight="bold">Option {opt}</Typography>

          <Typography fontStyle="italic" mt={1}>
            Interpretation:
          </Typography>
          <TextArea
            textContent={details.interpretation}
            onChange={(e) =>
              onChange(questionIndex, opt, "interpretation", e.target.value)
            }
          />

          <Typography fontStyle="italic" mt={1}>
            Likely Misunderstanding:
          </Typography>
          <TextArea
            textContent={details.likely_misunderstanding}
            onChange={(e) =>
              onChange(
                questionIndex,
                opt,
                "likely_misunderstanding",
                e.target.value
              )
            }
          />
        </Box>
      ))}
    </Box>
  );
};

export default OverviewEditor;
