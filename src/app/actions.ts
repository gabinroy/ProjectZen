"use server";

import { summarizeTaskComments } from "@/ai/flows/summarize-task-comments";

export async function getSummary(comments: string) {
  try {
    const { summary } = await summarizeTaskComments({ comments });
    return summary;
  } catch (error) {
    console.error(error);
    return "Error: Could not summarize comments.";
  }
}
