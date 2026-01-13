# Cypress Selector Generator

An AI-powered developer tool designed to streamline the process of writing stable, maintainable Cypress tests. It takes HTML snippets and natural language descriptions as input and uses Google's Gemini API to generate optimal Cypress selectors.

## Features

- **AI-Powered Selector Generation**: Accurately identifies elements and generates `cy.get()` or `cy.contains()` commands based on HTML context and user intent.
- **Best Practice Adherence**: Prioritizes `data-cy`, `data-test`, stable IDs, and semantic classes over brittle selectors.
- **Action Builder**: Quickly append common Cypress commands like `.click()`, `.type()`, `.should()`, etc., using an interactive UI.
- **Client-Side Security**: API keys are stored securely in your browser's `localStorage` and never sent to any backend server.
- **Real-time Preview**: Syntax-highlighted code preview with one-click copy.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on desktop and mobile.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.0 Flash (via `@google/genai` SDK)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A Google AI Studio API Key

### Configuration

The application requires a valid Google Gemini API Key to function.

1. **Launch the App**: Open the application in your browser.
2. **Set API Key**: Click the **"Set API Key"** button in the header (or attempt to generate a selector).
3. **Enter Key**: Paste your Google AI Studio API key into the secure modal.
   - The key is saved to your browser's `localStorage`.
   - It is only used to authenticate requests directly to Google's API.

### Usage

1. **Paste HTML**: Copy the HTML snippet of the component you want to test into the "HTML Snippet" area.
2. **Describe Element**: Type a short description of the element you want to select (e.g., "The login button" or "The email input field").
3. **Generate**: Click "Generate Selector".
4. **Refine**: Use the "Append Actions" panel to add interactions like clicks, typing, or assertions.
5. **Copy**: Click the copy icon in the code preview to copy the final Cypress code to your clipboard.

## Project Structure

- **`App.tsx`**: Main application logic and layout.
- **`services/geminiService.ts`**: Handles interactions with the Google Gemini API.
- **`utils/storage.ts`**: Manages local storage for API credentials.
- **`components/`**: Reusable UI components (ApiKeyModal, CodePreview, Button).

## License

MIT