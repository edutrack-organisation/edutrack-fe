/**
 * GeneratedQuestionStatistic Component
 *
 * A component that visualizes the distribution of marks across topics in generated questions.
 * Features:
 * - Displays two pie charts showing marks distribution by topics
 * - Shows both weighted and non-weighted mark allocations
 * - Features interactive highlighting and hover effects
 * - Provides tooltips for additional information
 **/

import { Box, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { TopicFrequency } from "../../types/types";
import { PieChart } from "@mui/x-charts";
import React from "react";
import { PieChartData } from "./types";

interface GeneratedQuestionStatisticProps {
    pieChartTopicsMarksSeries: PieChartData[];
    pieChartWeightedTopicsMarksSeries: PieChartData[];
}

interface PieChartProps {
    data: TopicFrequency[];
    chartTitle: string;
    toolTipContent: string;
}

/**
 * Renders a donut chart showing topic-marks of generated questions distribution
 * Features interactive highlighting and hover effects
 * @param data - Array of data for chart visualization
 */
const PieChartVisual: React.FC<PieChartProps> = ({ data, chartTitle, toolTipContent }) => (
    <>
        {data.length > 0 && (
            <Box display={"flex"} flexDirection={"column"} sx={{ width: "50%" }}>
                <Typography fontWeight="bolder" fontSize="12px" mb="0.5rem">
                    {chartTitle}
                </Typography>
                <PieChart
                    series={[
                        {
                            data, // The dataset for the pie chart
                            highlightScope: { fade: "global", highlight: "item" }, // When hovering, fades all segments except the highlighted one
                            faded: {
                                innerRadius: 30, // Sets the inner radius of faded segments
                                additionalRadius: -30, // Reduces the size of faded segments
                                color: "gray", // Color of faded segments
                            },
                            innerRadius: 30,
                        },
                    ]}
                    height={130}
                    slotProps={{ legend: { hidden: true } }}
                />

                <Box
                    sx={{
                        display: "flex",
                        gap: "0.5rem",
                        mt: "0.5rem",
                        alignItems: "center",
                    }}
                >
                    <InfoIcon sx={{ fontSize: "1.3rem" }} />
                    <Typography fontWeight="light" fontSize="12px">
                        {toolTipContent}
                    </Typography>
                </Box>
            </Box>
        )}
    </>
);

const GeneratedQuestionStatistic: React.FC<GeneratedQuestionStatisticProps> = ({
    pieChartTopicsMarksSeries,
    pieChartWeightedTopicsMarksSeries,
}) => {
    return (
        <Box className="generated-question-statistic-container" display={"flex"}>
            <PieChartVisual
                data={pieChartTopicsMarksSeries}
                chartTitle={"Non-weighted allocated marks - By Topics"}
                toolTipContent={"Hover over to view non-weighted marks worth of questions generated"}
            />
            <PieChartVisual
                data={pieChartWeightedTopicsMarksSeries}
                chartTitle={"Weighted allocated marks - By Topics"}
                toolTipContent={"Hover over to view weighted marks worth of questions generated"}
            />
        </Box>
    );
};

export default GeneratedQuestionStatistic;
