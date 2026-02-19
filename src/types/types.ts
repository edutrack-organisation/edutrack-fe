import { DatasetElementType } from "@mui/x-charts/internals";

export type Handlers = {
    [key: string]: (...args: any[]) => void;
};

export interface OptionOverview {
  interpretation: string;
  likely_misunderstanding: string;
}

export interface DataItem {
  description: string;
  topics: string[];
  difficulty: number;
  mark: number;
  level: string;
  overview?: Record<string, OptionOverview>; // e.g., "A": { interpretation, likely_misunderstanding }
}

export interface DataItemWithUUID extends DataItem {
  uuid: string;
}


// Types for dashboard
export interface TopicFrequency {
    id: number;
    value: number;
    label: string;
}
// This is for each topic, rather than overall for the paper
export interface DifficultyFrequencyAndAverageDifficultyForTopic {
    label: string;
    topicDifficultyFrequency: DatasetElementType<
        string | number | Date | null | undefined
    >[]; // [{frequency, difficulty}...]
    topicAverageDifficulty: number;
}


// added on 9 oct
export interface Topic {
  id: number;
  title: string;
}

export interface Question {
  id: number;
  question_number: number;
  description: string;
  mark: number;
  difficulty: number;
  topics: Topic[];
  level: string;
}

export interface Paper {
  id: number;
  title: string;
  description: string | null;
  overall_difficulty: number | null;
  questions: any[]; // Or a more specific Question[] type
  statistics: Statistic | null;
  module_code: string;
  module_name: string;
  academic_year: string;
  semester: string;
}

export interface PaperSummary {
  id: number;
  title: string;
  has_grades: boolean;
}

export interface QuestionUpdate {
  question_number: number;
  description: string;
  mark: number;
  difficulty: number;
  topics_str: string[];
  level: string;
}

export interface GradeDistribution {
  bins: string[];
  counts: number[];
  total_students: number;
  average_score: number;
  standard_deviation: number;
}

export interface Statistic {
  id: number;
  normalised_average_marks: number;
  normalised_mean_marks: number;
  normalised_median_marks: number;
  normalised_min_marks: number;
  normalised_max_marks: number;
}

/**
 * Represents the statistics for a single question.
 * Matches schemas.QuestionChoiceStatistics
 */
export interface QuestionChoiceStatistics {
  question_id: number;
  statistics?: { [key: string]: number }; // e.g., {"A": 0.25, "B": 0.5}
  grade_statistics?: { [key: string]: number }; // e.g. {"correct": 0.6, "incorrect": 0.4}
}

/**
 * Represents the full payload for the statistics endpoint.
 * Matches schemas.StudentChoiceData
 */
export interface StudentChoiceData {
  questions: QuestionChoiceStatistics[];
}
