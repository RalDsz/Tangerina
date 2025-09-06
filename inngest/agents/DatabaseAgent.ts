import { createAgent, openai} from "@inngest/agent-kit";

import { saveToDatabaseTool } from "./tools/saveToDatabaseTool.js";

export const databaseAgent = createAgent({
  name: "Database Agent",
  description:
    "Responsible for taking key information regarding receipts and saving it to the Convex database.",
  system:
    "You are a helpful assistant that takes key information regarding receipts and saves it to the Convex database.",
    model: openai({
      model: "gpt-4o-mini",
        defaultParameters: {
            max_completion_tokens: 1000,
        }   
    }),
    tools: [saveToDatabaseTool],

});
