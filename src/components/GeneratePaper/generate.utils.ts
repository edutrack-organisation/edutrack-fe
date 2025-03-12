import { Topic, QuestionFromDB } from "./generate.types";
import { DataItemWithUUID } from "../../types/types";

/**
 * Questions that are generated/retrieved from the database have other fields such as Foreign keys
 * We want to format the question from QuestionFromDB to DataItemWithUUID for rendering on our table
 * @param generatedQuestions
 * @returns DataItemWithUUID[]
 */
export const formatGeneratedQuestions = (
    generatedQuestions: QuestionFromDB[]
) => {
    console.log("inside util ");
    console.log(generatedQuestions);

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
