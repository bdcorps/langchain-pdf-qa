import console from "console";
import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import { VectorDBQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { OpenAI } from "langchain/llms";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { HNSWLib } from "langchain/vectorstores";

export const main = async () => {
  const model = new OpenAI({ maxTokens: 1000, temperature: 0.1 });

  const text = fs.readFileSync("tesla.txt", "utf8");
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  const docs = await textSplitter.createDocuments([text]);

  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
  const qaChain = VectorDBQAChain.fromLLM(model, vectorStore);

  const questions = [
    "What is the company's core business?",
    "What are the key products or services offered by the company?",
    "Who are the company's main competitors?",
    "What are the primary markets and target customers for the company?",
    "What are the most significant risks faced by the company?",
    "How is the company mitigating these risks?",
    "What potential industry-wide or macroeconomic risks could affect the company's performance?",
    "What are the key financial and operational highlights from the past year?",
    "What is the management's outlook on the company's future performance?",
    "What are the main drivers of growth for the company?",
    "How does the company plan to address any operational or financial challenges?",
    "How has the company's revenue and net income changed over the past few years?",
    "What are the main sources of the company's cash flow?",
    "How does the company's debt and equity structure compare to industry benchmarks?",
    "Are there any significant changes in the company's assets or liabilities?"
    ,
    "Does the company have effective internal controls in place?",
    "Were there any material weaknesses identified in the internal control system?",
    "Did the auditors issue an unqualified or qualified opinion on the company's financial statements?",
    "Were there any concerns or discrepancies noted by the auditors?",
    "Are there any ongoing or pending legal proceedings involving the company?",
    "How might these legal proceedings impact the company's financial position?",
    "What is the compensation structure for the company's top executives?",
    "Are the executive compensation packages tied to company performance or stock prices?",
    "How does the company's financial performance compare to its historical performance?",
  ]

  const answers = await Promise.all(questions.map(async (question) => {

    const answer = await qaChain.call({
      input_documents: docs,
      query: "You are a financial analyst for Tesla. " + question,
    });

    return "\n\n> " + question + "\n" + answer.text;

  }));

  console.log(answers.join("\n"))
};

main();
