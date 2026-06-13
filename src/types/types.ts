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
  type: string;
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
  type: string;
  answer?: string;
  description: string;
  mark: number;
  difficulty: number;
  topics: Topic[];
  level: string;
  overview?: Record<string, OptionOverview>;
  student_choice_statistics?: { [key: string]: number };
  grade_statistics?: { [key: string]: number };
  quartile_statistics?: any;
  individual_choice_statistics?: { [key: string]: number };
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
  type: string;
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
  statistics?: { [key: string]: number };
  grade_statistics?: { [key: string]: number };
  quartile_statistics?: {
    top_25: {
      correct_rate: number;
      choices: { [key: string]: number };
    };
    bottom_25: {
      correct_rate: number;
      choices: { [key: string]: number };
    };
  };
  individual_choice_statistics?: { [key: string]: number };
  answer?: string;
}

/**
 * Represents the full payload for the statistics endpoint.
 * Matches schemas.StudentChoiceData
 */
export interface StudentChoiceData {
  questions: QuestionChoiceStatistics[];
}

export interface AIAnalysisPayload {
  patterns: string[];
  distractor_analysis: string[];
  cognitive_depth: string[];
  assessment_quality: string[];
  quartile_analysis: string[];
  recommendations: string[];
}

export interface PaperAnalysis {
  id: number;
  paper_id: number;
  analysis_data: AIAnalysisPayload;
}

export interface TopicInsight {
  topic_name: string;
  better_performing_cohort: string;
  analysis: string;
}

export interface PaperComparisonPayload {
  executive_summary: string;
  performance_shift: string;
  topic_insights: TopicInsight[];
  cognitive_depth_analysis: string;
  actionable_recommendations: string[];
}

export interface PaperComparisonDB {
  id: number;
  baseline_paper_id: number;
  comparison_paper_id: number;
  comparison_data: PaperComparisonPayload;
}