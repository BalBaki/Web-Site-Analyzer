# WEB SITE ANALYZER BACK-END API

- [Installation](#installation)
- [Running the app](#running-the-app)
- [Test](#test)
- [Environment Variables](#environment-variables)
    - [Variable Details](#variable-details)
- [API Routes](#api-routes)
    - [Analyze](#analyze)
    - [Assistant](#assistant)
        - [Type Descriptions](#type-descriptions)

## Installation

```bash
# Install dependencies
npm install
npx playwright install  # Required for running e2e tests involving browser automation
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
PAGE_SPEED_INSIGHT_API_KEY=your_api_key  # Google PageSpeed Insights API key
WHO_IS_API_KEY=your_api_key              # Whois lookup service API key
CHATGPT_API_KEY=your_api_key             # OpenAI ChatGPT API key
```

### Variable Details

- **`PAGE_SPEED_INSIGHT_API_KEY`**  
  API key for accessing [Google PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/get-started).

- **`WHO_IS_API_KEY`**  
  API key for accessing [WhoIs API](https://whoisjson.com/).

- **`CHATGPT_API_KEY`**  
  API key for accessing [OpenAI ChatGPT API](https://platform.openai.com/account/api-keys).

## API Routes

### Analyze

- **SSE** `/analyze`
- **Request Query:**
    ```json
    {
        "url": "string",
        "services": "array",
        "deepscan": "boolean"
    }
    ```

### Assistant

- **POST** `/assistant`
- **Request Body:**

    ```json
    {
        "type": "accessibility | performance | seo | best-practice | normal",
        "tool": "chatgpt",
        "description": "string",
        "elementHtml"?: "string"
    }
    ```

- **Response:**
    ```json
    {
        "status": "ok",
        "data": {
            "answer": "string"
        }
    }
    ```
    or
    ```json
    {
        "status": "err",
        "err": "string"
    }
    ```

#### Type Descriptions

Each `type` value tells the assistant what kind of analysis or guidance you want:

- **`accessibility`**  
  Provides suggestions to improve accessibility for users with disabilities.  
  _Example: Identifies missing alt attributes, low color contrast, or missing ARIA labels._

- **`performance`**  
  Focuses on speed and load optimization for better user experience.  
  _Example: Recommends image compression, lazy loading, reducing unused CSS/JS._

- **`seo`**  
  Offers improvements to boost visibility on search engines.  
  _Example: Checks for meta tags, heading structure, crawlability, and link health._

- **`best-practice`**  
  Reviews general web development standards and best practices.  
  _Example: Ensures HTTPS usage, modern JS features, and secure coding patterns._

- **`normal`**  
  Provides general advice based on your description. Best for open-ended or uncategorized questions.  
  _Example: "How can I improve the layout of this section?"_
