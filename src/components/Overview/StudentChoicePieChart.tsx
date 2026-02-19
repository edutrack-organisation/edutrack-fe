import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography } from "@mui/material";

interface Props {
  questionNumber: number;
  statistics: { [key: string]: number }; // e.g., { "A": 0.25, "B": 0.5, ... }
  entropy: number;
  small?: boolean;
  grade_statistics?: { [key: string]: number };
}

// Colors for the pie slices
const COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Green
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#AF19FF", // Purple
  "#FF1919", // Red
];

/**
 * Renders a custom label on the pie chart slices.
 */
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

  // Don't render label if percentage is too small
  if (percent < 0.05) {
    return null;
  }

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
  statistics,
  entropy,
  small = false,
  grade_statistics,
}: Props) => {
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

  const hasGradeStats =
    grade_statistics && typeof grade_statistics["correct"] === "number";
  console.log(grade_statistics)
  const passRate = grade_statistics
    ? (grade_statistics!["correct"] * 100).toFixed(0)
    : null;

  return (
    <Box
      p={1}
      border="1px solid #eee"
      borderRadius={2}
      sx={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        width: "100%",
      }}
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
            Pass Rate: {passRate}%
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
              outerRadius={small ? 70 : 120} // ✅ smaller chart
              fill="#8884d8"
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
            // Add a color based on the entropy value
            color: entropy > 0.75 ? "red" : entropy > 0.5 ? "orange" : "green",
          }}
        >
          {/* Format as a percentage */}
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