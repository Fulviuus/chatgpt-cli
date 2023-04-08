import { OpenAI } from "https://deno.land/x/openai/mod.ts";

import {
  bold,
  cyan,
  green,
  red,
  yellow,
} from "https://deno.land/std/fmt/colors.ts";

import { TerminalSpinner } from "https://deno.land/x/spinners/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const openaiApiKeyFromEnv = Deno.env.get("OPENAI_API_KEY");
const modelVersionFromEnv = Deno.env.get("MODEL_VERSION");

const { OPENAI_API_KEY, MODEL_VERSION } = {
  OPENAI_API_KEY: openaiApiKeyFromEnv || config().OPENAI_API_KEY,
  MODEL_VERSION: modelVersionFromEnv || config().MODEL_VERSION,
};

if (!OPENAI_API_KEY) {
  console.error(red(bold("Error: ")) + "Missing OpenAI key.");
  Deno.exit(1);
}

const openai = new OpenAI(OPENAI_API_KEY);

const args = Deno.args;
if (args.length === 0) {
  console.log(cyan(bold("Usage: ")) + "chatgpt [options] [prompt]");
  Deno.exit(0);
}

const historyFile = `${Deno.env.get("HOME")}/.conversation_history.json`;

function displayHelp() {
  console.log(cyan(bold("Usage: ")) + "cligpt [options] [prompt]");
  console.log("\n" + cyan(bold("Options:")));
  console.log("  -c, --clear-history     Clear conversation history");
  console.log("  -l, --list-history      List conversation history");
  console.log("  -h, --help              Show help information");
}



async function updateConversationHistory(newMessage) {
  let conversationHistory = [];

  try {
    const historyJson = await Deno.readTextFile(historyFile);
    conversationHistory = JSON.parse(historyJson);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(historyFile, JSON.stringify(conversationHistory));
    } else {
      console.error(red(bold("Error: ")) + "Failed to read conversation history.");
      Deno.exit(1);
    }
  }

  conversationHistory.push(newMessage);
  await Deno.writeTextFile(historyFile, JSON.stringify(conversationHistory));
  return conversationHistory;
}

async function clearConversationHistory() {
  await Deno.writeTextFile(historyFile, JSON.stringify([]));
}

async function readConversationHistory() {
  let conversationHistory = [];

  try {
    const historyJson = await Deno.readTextFile(historyFile);
    conversationHistory = JSON.parse(historyJson);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.writeTextFile(historyFile, JSON.stringify(conversationHistory));
    } else {
      console.error(red(bold("Error: ")) + "Failed to read conversation history.");
      Deno.exit(1);
    }
  }

  return conversationHistory;
}

function printConversationHistory(conversationHistory) {
  conversationHistory.forEach((message) => {
    const role = message.role === "user" ? cyan(bold("User: ")) : green(bold("Assistant: "));
    console.log(role + message.content);
  });
}

if (args.includes("--help") || args.includes("-h")) {
  displayHelp();
  Deno.exit(0);
}

// Check for the --clear-history option and its shorthand
if (args.includes("--clear-history") || args.includes("-c")) {
  await clearConversationHistory();
  console.log(yellow(bold("Info: ")) + "Conversation history cleared.");
  Deno.exit(0);
}

// Check for the --show-history option and its shorthand
if (args.includes("--history") || args.includes("-h")) {
  const conversationHistory = await readConversationHistory();
  printConversationHistory(conversationHistory);
  Deno.exit(0);
}

const prompt = args.join(" ");
const terminalSpinner = new TerminalSpinner("Please wait...");
terminalSpinner.start();

try {
  const userMessage = { role: "user", content: prompt };
  const conversationHistory = await updateConversationHistory(userMessage);
  const response = await openai.createChatCompletion({
    model: MODEL_VERSION,
    messages: conversationHistory,
  });

  const assistantMessage = response.choices[0].message.content.trim();
  await updateConversationHistory({ role: "assistant", content: assistantMessage });

  terminalSpinner.stop();
  console.log(green(bold("Response: ")) + assistantMessage);
} catch (error) {
  terminalSpinner.stop();
  console.error(red(bold("Error: ")) + error.message);
  Deno.exit(1);
}