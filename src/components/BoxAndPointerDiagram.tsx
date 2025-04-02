import { Box, Typography } from "@mui/material";
import React from "react";

// Helper function to calculate statistics
export const calculateStatistics = (data: number[]) => {
    if (data.length === 0) {
        return null;
    }

    const sorted = [...data].sort((a, b) => a - b);

    const mean = sorted.reduce((acc, val) => acc + val, 0) / sorted.length;

    const median = (sorted.length % 2 === 0)
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

    const mode = Object.entries(
        sorted.reduce((acc, num) => {
            acc[num] = (acc[num] || 0) + 1;
            return acc;
        }, {} as Record<number, number>)
    )
        .reduce((acc, [key, value]) => {
            if (value > acc.maxFrequency) {
                acc.maxFrequency = value;
                acc.modes = [Number(key)];
            } else if (value === acc.maxFrequency) {
                acc.modes.push(Number(key));
            }
            return acc;
        }, { maxFrequency: 0, modes: [] as number[] }).modes;

    const q1 = sorted[Math.floor((sorted.length / 4))];
    const q3 = sorted[Math.floor((3 * sorted.length) / 4)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    return {
        mean,
        mode,
        median,
        q1,
        q3,
        min,
        max
    };
};

// BoxAndPointerDiagram Component with a border of 5 around the diagram
const BoxAndPointerDiagram: React.FC<{ data: number[], min_value?: number, max_value?: number, height?: number, width?: number }> = ({ data, min_value = 0, max_value = -1, width = 300, height = 40 }) => {
    const stats = calculateStatistics(data);

    if (!stats) {
        return <Typography>No data available</Typography>;
    }

    const { mean, mode, median, q1, q3, min, max } = stats;
    if (max_value == -1) max_value = max;                  // When max_value is not set explicitly, use max from data
    if (max_value == min_value) max_value = min_value + 1; // When max_value - min_value == 0, set that to 1 instead to prevent division by 0 errors

    const scale = (value: number) =>
        5 + ((value - min_value) / (max_value - min_value)) * (width - 10); // Scales value to fit the diagram width

    const Y1 = 5;                       // Top limit
    const Y2 = 5 + ((height - 10) / 4); // Quarter way
    const Y3 = height / 2;              // Midpoint
    const Y4 = height - Y2;             // Bottom quarter way
    const Y5 = height - 5;              // Bottom limit

    return (
        <Box sx={{ textAlign: "center", border: '10px solid #ddd', display: 'inline-block', padding: 2 }}>
            {/* SVG Diagram */}
            <svg width={width} height={height}>
                {/* Min and Max lines */}
                <line x1={scale(min)} y1={Y2} x2={scale(min)} y2={Y4} stroke="black" />
                <line x1={scale(max)} y1={Y2} x2={scale(max)} y2={Y4} stroke="black" />

                {/* Connecting line */}
                <line x1={scale(min)} y1={Y3} x2={scale(max)} y2={Y3} stroke="black" />

                {/* Box */}
                <rect
                    x={scale(q1)}
                    y={Y1}
                    width={scale(q3) - scale(q1)}
                    height={Y5 - Y1}
                    fill="white"
                    stroke="black"
                />

                {/* Median line */}
                <line
                    x1={scale(median)}
                    y1={Y1}
                    x2={scale(median)}
                    y2={Y5}
                    stroke="black"
                    strokeWidth="2"
                />
            </svg>

            {/* Overview */}
            <Box sx={{ marginTop: "10px", fontSize: "14px" }}>
                <Typography variant="body2">Mean: {mean.toFixed(2)}</Typography>
                <Typography variant="body2">Median: {median.toFixed(2)}</Typography>
                <Typography variant="body2">Mode: {mode.length > 0 ? mode.join(", ") : "None"}</Typography>
                <Typography variant="body2">Min: {min}, Q1: {q1}, Q3: {q3}, Max: {max}</Typography>
            </Box>
        </Box>
    );
};

export default BoxAndPointerDiagram;
