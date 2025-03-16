/**
 * Type definitions for the Upload PDF feature
 */

export interface ParsedPDFResponse {
    questions: {
        question_text: string;
        marks: number;
        topics: string[];
        difficulty: number;
    }[];
    title: string;
    allTopics: string[];
}
