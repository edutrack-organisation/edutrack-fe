import React from "react";
import { Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

// UPDATED: Changed 'labels' to 'bins' to match your data type
interface HistogramData {
  counts: number[];
  bins: string[];
}

interface HistogramProps {
  data: HistogramData;
}

const StudentGradesHistogram: React.FC<HistogramProps> = ({ data }) => {
  if (!data || data.counts.length === 0) {
    return null;
  }

  return (
    <Box p={2}>
      <BarChart
        series={[{ data: data.counts, label: "Number of Students" }]}
        height={200}
        // UPDATED: Changed 'data.labels' to 'data.bins'
        xAxis={[{ data: data.bins, scaleType: "band" }]}
        yAxis={[{ label: "Number of Students" }]}
        margin={{ top: 50, bottom: 30, left: 50, right: 10 }}
        grid={{ horizontal: true }}
      />
    </Box>
  );
};

export default StudentGradesHistogram;
