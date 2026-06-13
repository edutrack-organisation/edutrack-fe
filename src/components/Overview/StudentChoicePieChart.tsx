import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Box, Typography } from "@mui/material";

interface Props {
  questionNumber: number;
  type?: string;
  statistics: { [key: string]: number };
  individual_choice_statistics?: { [key: string]: number };
  entropy: number;
  small?: boolean;
  grade_statistics?: { [key: string]: number };
  correctAnswer?: string | null;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1919",
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.05) return null;
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize="14px"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const StudentChoicePieChart = ({
  questionNumber: question,
  type,
  statistics,
  individual_choice_statistics,
  entropy,
  small = false,
  grade_statistics,
  correctAnswer
}: Props) => {
  const passRate =
    grade_statistics && typeof grade_statistics["correct"] === "number"
      ? (grade_statistics["correct"] * 100).toFixed(0)
      : null;

  // --- MRQ Logic (Bar Chart) ---
  if (
    type === "MRQ" &&
    individual_choice_statistics &&
    Object.keys(individual_choice_statistics).length > 0
  ) {
    // Split the correct answer (e.g. "A,C" -> ["A", "C"])
    const correctOptions = correctAnswer
      ? correctAnswer.split(/[^A-Z0-9]+/).filter(Boolean)
      : [];

    const mrqData = Object.entries(individual_choice_statistics)
      .sort(([keyA], [keyB]) => {
        if (keyA === "BLANK") return 1;
        if (keyB === "BLANK") return -1;
        return keyA.localeCompare(keyB);
      })
      .map(([name, value]) => {
        const isCorrectOption = correctOptions.includes(name);
        const selectionRate = value * 100;

        // If it's a distractor (not in answer key), show % of students who avoided it
        const displayedValue = isCorrectOption
          ? selectionRate
          : 100 - selectionRate;
        const labelSuffix = isCorrectOption ? "(Selected)" : "(Not Selected)";

        return {
          name: name === "BLANK" ? "BLANK" : `Option ${name}`,
          value: displayedValue,
          fullLabel:
            name === "BLANK" ? "BLANK" : `Option ${name} ${labelSuffix}`,
          isCorrect: isCorrectOption,
        };
      });

    return (
      <Box
        p={1}
        border="1px solid #eee"
        borderRadius={2}
        sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)", width: "100%" }}
      >
        <Typography variant="subtitle1" gutterBottom textAlign="center">
          Question {question} (MRQ Accuracy)
        </Typography>
        {/* ... Pass Rate Typography ... */}
        <Box sx={{ height: 300, width: "100%", pt: 2 }}>
          <ResponsiveContainer>
            <BarChart
              data={mrqData}
              margin={{ top: 0, right: 20, bottom: 20, left: -10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(tick) => `${tick}%`} domain={[0, 100]} />
              {/* Updated Tooltip to show what the percentage represents */}
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value.toFixed(1)}%`,
                  props.payload.isCorrect
                    ? "Correctly Selected"
                    : "Correctly Omitted",
                ]}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {mrqData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    // Green if student "got it right" (selected correct or ignored wrong),
                    // though you might prefer your original COLORS array.
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Typography
          variant="caption"
          display="block"
          textAlign="center"
          sx={{ mt: 1, fontStyle: "italic" }}
        >
          Bars show % of students who correctly handled each option.
        </Typography>
      </Box>
    );
  }

  // --- MCQ Logic (Pie Chart) ---
  const data = Object.entries(statistics).map(([name, value]) => ({
    name: `Option ${name}`,
    value: value * 100,
  }));

  if (!data || data.length === 0) {
    return (
      <Box mb={2} p={1} border="1px solid #eee" borderRadius={2}>
        <Typography variant="subtitle1" gutterBottom>
          Question {question}
        </Typography>
        <Typography variant="body2">
          No student choice data available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      p={1}
      border="1px solid #eee"
      borderRadius={2}
      sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)", width: "100%" }}
    >
      <Typography variant="subtitle1" gutterBottom textAlign="center">
        Question {question}
      </Typography>
      {passRate !== null && (
        <Box mb={1} textAlign="center">
          <Typography
            variant="h6"
            color="success.main"
            sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
          >
            Correct Rate: {passRate}%
          </Typography>
        </Box>
      )}
      <Box
        sx={{
          height: 300,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={small ? 70 : 120}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box mt={2} textAlign="center">
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          component="span"
          sx={{
            color: entropy > 0.75 ? "red" : entropy > 0.5 ? "orange" : "green",
          }}
        >
          Confusion (Entropy): {(entropy * 100).toFixed(0)}%
        </Typography>
        <Typography variant="caption" display="block">
          (0% = single answer, 100% = random)
        </Typography>
      </Box>
    </Box>
  );
};

export default StudentChoicePieChart;
