This repo lets you use a local PDF/text file to ask questions and generate asnwers.

## How to use

1. Add a .env file (OPENAI API key can be found in https://platform.openai.com/account/api-keys):

```
OPENAI_API_KEY=
```

2. Run `npm i`
3. Run `npm run dev`

You will see a response in your console for the Microsoft 10-K report

## Acknowldgements

- Big thanks to https://github.com/mayooear/gpt4-pdf-chatbot-langchain for the PDF loader functions
