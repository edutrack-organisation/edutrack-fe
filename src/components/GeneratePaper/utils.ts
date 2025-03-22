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
