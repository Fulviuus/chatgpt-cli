# ChatGPT CLI

A simple command-line interface (CLI) for OpenAI's ChatGPT powered by Deno.

## Features

- Send prompts to ChatGPT and receive responses.
- Maintain conversation history.
- Clear conversation history.
- Show conversation history.
- Colored output.

## Prerequisites

- [Deno](https://deno.land/): A secure runtime for JavaScript and TypeScript. Please follow the [installation guide](https://deno.land/#installation) on their official website.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/chatgpt-cli.git
cd chatgpt-cli
```

2. Create a `.env` file in the root directory of the project with the following content:

```
OPENAI_API_KEY=your_openai_api_key
MODEL_VERSION=model_version
```

Replace `your_openai_api_key` with your actual OpenAI API key and `model_version` with the desired GPT model version (e.g., `gpt-4` or `gpt-3.5-turbo`).

## Usage

Navigate to the project directory and run the script with the desired options:

```bash
deno run --allow-env --allow-read --allow-write cligpt.ts [options] [prompt]
```

### Options

- `-c`, `--clear-history`: Clear conversation history.
- `-s`, `--show-history`: Show conversation history.
- `-h`, `--help`: Show help information.

### Examples

1. Send a prompt to ChatGPT:

```bash
deno run --allow-env --allow-read --allow-write cligpt.ts "What is the capital of France?"
```

2. Show conversation history:

```bash
deno run --allow-env --allow-read --allow-write cligpt.ts -s
```

3. Clear conversation history:

```bash
deno run --allow-env --allow-read --allow-write cligpt.ts -c
```

## Configure Alias

You can set up an alias to run the ChatGPT CLI script more easily. Add the following lines to your shell configuration file (`.bashrc` for Bash or `.zshrc` for Zsh), replacing `/path/to/cligpt.ts` with the actual path to the `cligpt.ts` file in your project directory, and `your_openai_api_key` and `model_version` with your actual OpenAI API key and desired GPT model version, respectively:

### Bash

Add the following line to your `~/.bashrc`:

```bash
alias cligpt='OPENAI_API_KEY=your_openai_api_key MODEL_VERSION=model_version deno run --allow-env --allow-read --allow-write /path/to/cligpt.ts'
```

Then, run `source ~/.bashrc` to apply the changes.

### Zsh

Add the following line to your `~/.zshrc`:

```bash
alias cligpt='OPENAI_API_KEY=your_openai_api_key MODEL_VERSION=model_version deno run --allow-env --allow-read --allow-write /path/to/cligpt.ts'
```

Then, run `source ~/.zshrc` to apply the changes.

After setting up the alias, you can use the `cligpt` command followed by options and prompts, e.g., `cligpt -s` or `cligpt "What is the capital of France?"`.


## License

This project is licensed under the [MIT License](LICENSE).
