/**
 * Utility functions for processing and analyzing exam paper data
 */

import { DifficultyFrequencyAndAverageDifficultyForTopic } from "../../types/types";
import { Question } from "./types";

/**
 * This function serve to count the frequency of each difficulty level and the average difficulty for each topic
 * @param questions
 * @returns An object containing the formattedDifficultyFrequency and the paperAverageDifficulty
 */
export const countDifficultyFrequencyAndAverageDifficultyForEachTopic = (questions: Question[]) => {
    let totalDifficulty = 0;
    const numberOfQuestionForThisTopic = questions.length;
    const difficultyFrequency = new Map();
    questions.forEach((question) => {
        difficultyFrequency.set(question.difficulty, (difficultyFrequency.get(question.difficulty) || 0) + 1);
        totalDifficulty += question.difficulty;
    });

    // convert the difficultyFrequency map to series for BarChart for each topic
    const topicDifficultyFrequency = Array.from(difficultyFrequency).map(([difficulty, frequency]) => ({
        difficulty: difficulty,
        frequency: frequency,
    }));

    return {
        topicDifficultyFrequency, // This is the [{difficulty: difficulty, frequency: frequency}] for each topic
        topicAverageDifficulty: totalDifficulty / numberOfQuestionForThisTopic,
    };
};

/**
 * This function takes in an array of questions and returns a map of [topic, questions] pairs. It's used to extract the questions for each topic.
 * @param questions
 * @returns An array of [topic, questions] pairs
 */
export const retrieveQuestionsForEachTopic = (questions: Question[]) => {
    const questionsForEachTopic = new Map();

    questions.forEach((question) => {
        question.topics.forEach((topic: string) => {
            const existingQuestions = questionsForEachTopic.get(topic) || [];
            questionsForEachTopic.set(topic, [...existingQuestions, question]);
        });
    });

    // convert the map to an array of [topic, questions] pairs
    return Array.from(questionsForEachTopic);
};

/**
 * This function counts the frequency of each topic in the questions array and sets the state for the PieChart
 * @param questions
 */
export function countTopicsFrequency(questions: Question[], allTopics: string[]) {
    const localTopicsFrequencyMap = new Map();

    questions.forEach((question) => {
        question.topics.forEach((topic: string) => {
            localTopicsFrequencyMap.set(topic, (localTopicsFrequencyMap.get(topic) || 0) + 1);
        });
    });

    const pieChartTopicsFrequencySeries = Array.from(localTopicsFrequencyMap).map(([topic, frequency], index) => ({
        id: index,
        value: frequency,
        label: topic,
    }));

    const notCoveredTopics = Array.from(new Set(allTopics)).filter((topic) => !localTopicsFrequencyMap.has(topic));

    return { pieChartTopicsFrequencySeries, notCoveredTopics };
}

/**
 * This function calculates the frequency of each difficulty level for the entire paper
 * @param topicsDifficultyFrequencyAndAverageDifficulty  An array of DifficultyFrequencyAndAverageDifficultyForTopic
 * @returns An array of {difficulty: number, frequency: number}
 */
export function calculateFrequencyForEachDifficultyLevel(
    topicsDifficultyFrequencyAndAverageDifficulty: DifficultyFrequencyAndAverageDifficultyForTopic[]
) {
    const difficultyFrequencyMap = new Map();

    topicsDifficultyFrequencyAndAverageDifficulty.forEach((topic) => {
        topic.topicDifficultyFrequency.forEach((df) => {
            difficultyFrequencyMap.set(df.difficulty, (difficultyFrequencyMap.get(df.difficulty) || 0) + df.frequency);
        });
    });

    return Array.from(difficultyFrequencyMap).map(([difficulty, frequency]) => ({
        difficulty,
        frequency,
    }));
}
