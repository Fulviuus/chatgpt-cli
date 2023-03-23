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

const prompt = args.join(" ");
const terminalSpinner = new TerminalSpinner("Please wait...");
terminalSpinner.start();

try {
  const response = await openai.createChatCompletion({
    model: MODEL_VERSION,
    messages: [{ role: "user", content: prompt }],
  });

  terminalSpinner.stop();
  console.log(green(bold("Response: ")) + response.choices[0].message.content.trim());
} catch (error) {
  terminalSpinner.stop();
  console.error(red(bold("Error: ")) + error.message);
  Deno.exit(1);
}