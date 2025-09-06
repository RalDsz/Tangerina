// import { anthropic, createNetwork, getDefaultRoutingAgent } from "@inngest/agent-kit";
// import { inngest } from "./client";
// import Events from "./constants";

// // ⚠️ make sure you import/define these somewhere
//  import { databaseAgent } from "./agents/DatabaseAgent";
//  import { iepScanningAgent } from "./agents/IEPScanningAgent";

// const agentNetwork = createNetwork({
//   name: "Agent Team",
//   agents: [databaseAgent, iepScanningAgent],
//   defaultModel: anthropic({
//     model: "claude-3-5-sonnet-latest",
//     defaultParameters: {
//       max_tokens: 1000,
//     },
//   }),
//   defaultRouter: ({ network }) => {
//     const savedToDatabase = network.state.kv.get("savedToDatabase");

//     if (savedToDatabase !== undefined) {
//       return undefined;
//     }
//     return getDefaultRoutingAgent();
//   },
// });

// export const extractAndSavePDF = inngest.createFunction(
//   { id: "extract-and-save-pdf" },
//   { event: Events.EXTRACT_DATA_FROM_PDF_AND_SAVE_TO_DATABASE },
//   async ({ event }) => {
//     const result = await agentNetwork.run(
//       `Extract the Key data from this PDF: ${event.data.url}. Once the data is extracted, save it to the database using the receipt id: ${event.data.receiptId}. Once the receipt is saved, terminate the agent process. Start with the supervisor agent.`
//     );

//     return result.state.kv.get("receipt");
//   }
// );
