/**
 * @file utils.ts
 * @description Global utility functions for the application
 * Contains helper functions that are used across multiple components:
 */

import { MultiValue } from "react-select";

// React-select requires the value to be in the format {label: string, value: string}
export const formatTopicsForReactSelect = (topics: string[]) => {
    return topics.map((topic) => {
        return { label: topic, value: topic };
    });
};

// Helper function to deformat topics for react-select (from {label: string, value: string} to string[])
export const deformatTopicsForReactSelect = (topicsLabelValue: MultiValue<{ label: string; value: string }>) => {
    return topicsLabelValue.map((t) => {
        return t.label;
    });
};
