/**
 * Utility functions for the Generate Paper feature
 * Contains helper functions for:
 * - Data transformation
 * - Format conversion
 * etc
 */

import { Topic, QuestionFromDB } from "./types";
import { DataItemWithUUID } from "../../types/types";
import * as XLSX from "xlsx";

/**
 * Questions that are generated/retrieved from the database have other fields such as Foreign keys
 * We want to format the question from QuestionFromDB to DataItemWithUUID for rendering on our table
 * @param generatedQuestions
 * @returns DataItemWithUUID[]
 */
export const formatGeneratedQuestions = (generatedQuestions: QuestionFromDB[]) => {
    return generatedQuestions.map((q) => {
        return {
            description: q.description,
            mark: q.mark,
            difficulty: q.difficulty,
            uuid: String(q.id), // uuid from content table uses id from database
            topics: q.topics.map((t: Topic) => t.title),
        } as DataItemWithUUID;
    });
};

/**
 * Exports the generated questions to an Excel file
 * Creates a worksheet with question details including number, description, topics, marks, and difficulty
 * @param questions - Array of questions to be exported
 * @returns void - Generates and downloads a 'generated_questions.xlsx' file
 */
export const exportToExcel = (questions: DataItemWithUUID[]) => {
    // Transform questions to a format suitable for Excel
    const excelData = questions.map((question, index) => ({
        "No.": index + 1,
        Description: question.description,
        Topics: question.topics.join("; "),
        Marks: question.mark,
        Difficulty: question.difficulty,
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Questions");

    // Generate Excel file
    XLSX.writeFile(workbook, "generated_questions.xlsx");
};

/**
 * Calculates the distribution of marks across topics in the generated questions
 * Provides both weighted (marks/difficulty) and non-weighted (raw marks) calculations
 * @param questions - Array of questions with their marks, topics, and difficulty levels
 * @returns Object containing two arrays formatted for pie chart visualization
 */
export function countGeneratedQuestionStatistic(questions: DataItemWithUUID[]) {
    const topicsMarksMap = new Map(); // keep track of NON-WEIGHTED total marks for each topic
    const weightedTopicsMarksMap = new Map(); // keep track of WEIGHTED total marks for each topic

    // Calculate total marks (non weighted) for each topic
    questions.forEach((question) => {
        question.topics.forEach((topic) => {
            topicsMarksMap.set(topic, (topicsMarksMap.get(topic) || 0) + question.mark);
        });
    });

    // Calculate total marks (non weighted) for each topic
    questions.forEach((question) => {
        question.topics.forEach((topic) => {
            weightedTopicsMarksMap.set(
                topic,
                (weightedTopicsMarksMap.get(topic) || 0) + question.mark / question.difficulty
            );
        });
    });

    // Format both map to be displayed as a pie chart format
    const pieChartTopicsMarksSeries = Array.from(topicsMarksMap).map(([topic, mark], index) => ({
        id: index,
        value: mark,
        label: topic,
    }));

    const pieChartWeightedTopicsMarksSeries = Array.from(weightedTopicsMarksMap).map(([topic, mark], index) => ({
        id: index,
        value: Number(mark.toFixed(2)),
        label: topic,
    }));

    return { pieChartTopicsMarksSeries, pieChartWeightedTopicsMarksSeries };
}
