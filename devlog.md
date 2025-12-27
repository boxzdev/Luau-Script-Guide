# Devlog

## Update: Deployment Fix Confirmation
- **Goal**: Resolve the Cloudflare build failure.
- **Changes**:
  - Re-confirmed `services/gemini.ts` code is correct.
  - Verified removal of invalid `createClient` import (which was causing the "is not exported" error).
  - Ensured correct usage of `new GoogleGenAI()`.

## Update: Fix Cloudflare Build Error
- **Goal**: Resolve the build failure caused by an incorrect import method.
- **Changes**:
  - Fixed `services/gemini.ts` to strictly use `new GoogleGenAI({ apiKey: ... })`.
  - Removed any references to `createClient` which is not exported by the `@google/genai` SDK.

## Update: Rebranding to Guide
- **Goal**: Refine the application identity.
- **Changes**:
  - Changed App Name from "Luau Script Assistant" to **"Luau Script Guide"**.
  - Updated HTML title and project metadata.

## Update: Rebranding
- **Goal**: Update the application identity to reflect its purpose.
- **Changes**:
  - Changed App Name from "Blank Canvas" to **"Luau Script Assistant"**.
  - Updated HTML title and project metadata.

## Update: Consolidated "Variable & Stuff"
- **Goal**: Simplify the user interface by merging related concepts back into a single main category, as splitting them proved too rigid.
- **Changes**:
  - Renamed "Variable" category to **"Variable & Stuff"**.
  - Removed "Keyword" and "Function" categories from the UI.
  - Updated `services/gemini.ts` validation rules:
    - **Variable & Stuff**: Now broadly accepts user variables (`myVar`), reserved keywords (`if`, `local`, `function`), and global functions (`print`, `warn`).
    - **Value**: Remains strictly for literals (Numbers, Strings, Booleans).
    - **Symbol**: Remains strictly for operators and punctuation.

## Update: Added "Function" Category
- **Goal**: Distinctly separate global functions (like `print`) from user variables.
- **Changes**:
  - Added "Function" to the `App.tsx` selection menu.
  - Updated `services/gemini.ts` to include strict rules for "Function" (built-in globals/methods) vs "Variable" (user identifiers).
  - The AI now suggests switching to the "Function" category if a user types `print` or `warn` into the "Variable" category.

## Update: Added "Keyword" Category
- **Goal**: Correctly classify reserved words like `if`, `function`, and `end`, which were previously confused with Symbols or Variables.
- **Changes**:
  - Added "Keyword" to the `App.tsx` selection menu.
  - Updated `services/gemini.ts` validation rules:
    - **Keyword**: Now explicitly includes reserved Lua/Luau keywords (`if`, `then`, `else`, `while`, `function`, etc.).
    - **Symbol**: Now strictly defined as operators (`+`, `-`, `#`) and punctuation (`.`, `:`, `{`).
    - **Variable**: Explicitly excludes reserved keywords.
  - AI now detects if a keyword is entered into the wrong category and suggests using "Keyword".

## Update: AI Text Styling (Markdown)
- **Goal**: Give the AI the ability to style specific words or terms in the explanation to make them pop.
- **Changes**:
  - Added `react-markdown` to the project.
  - Updated `App.tsx` to render the summary using Markdown.
  - Styled `**bold**` text to appear as highlighted terms (white text with a subtle background) rather than just heavy font weight.
  - Updated `services/gemini.ts` instructions to encourage the AI to use `**text**` for emphasis instead of quotes.

## Update: Cleaner Text Style
- **Goal**: Remove distracting quotes (e.g., 'term') from the AI's explanation text.
- **Changes**:
  - Updated `services/gemini.ts` system instruction with a specific STYLE rule: "Do NOT surround the term or keywords with single quotes ('') or double quotes ("") in the summary text."

## Update: Enhanced Explanations
- **Goal**: Make the AI's explanation ("summary") more useful for learning, as the previous version was too basic.
- **Changes**:
  - Updated `services/gemini.ts` system instruction.
  - The AI is now explicitly instructed to provide "DETAILED, EDUCATIONAL" explanations.
  - It must explain WHAT the concept is, HOW it works, and WHY it is used, specifically targeted at beginners learning Luau/Roblox Studio.

## Update: Removed 'String' Category
- **Goal**: Simplified the UI as the 'String' category was deemed redundant.
- **Changes**:
  - Removed "String" from the `App.tsx` dropdown.
  - Updated `services/gemini.ts` to remove the dedicated String category rule.
  - Updated "Value" category rule to strictly include String literals (e.g., "hello") alongside Numbers and Booleans, ensuring strings are still usable as values.

## Update: Smarter Error Messages & Category Suggestions
- **Goal**: Address user confusion regarding why certain terms (like "if") are invalid in the "Variable" category while others (like "message") are valid.
- **Changes**:
  - Updated `services/gemini.ts` validation logic.
  - The AI now explicitly checks if a user typed a reserved keyword (e.g., `if`) into the "Variable" category and suggests switching to the "Symbol" category in the error message.
  - Clarified in the system prompt that identifier names (like `message`) are valid variables, whereas control flow keywords are not.
  - Improved cross-category error messages (e.g., typing a variable name into "String" suggests adding quotes).

## Update: Removed 'Any' & Enforced Single Entity Rule
- **Goal**: Ensure inputs are strictly one word/token/entity based on the user's feedback.
- **Changes**:
  - Removed "Any" from the selection menu in `App.tsx`. Default is now "Variable".
  - Updated `services/gemini.ts` with a **Global Rule**: Inputs containing spaces (representing multiple tokens like "local if") are now strictly invalid.
  - The AI will return an error message if the user tries to combine multiple concepts (e.g. "Invalid Variable: Input must be a SINGLE variable").

## Update: Strict Category Validation
- **Goal**: Allow users to enforce strict type checking (Variable, String, Value, Symbol) and reject mismatched inputs (e.g., typing a string literal when "Variable" is selected).
- **Changes**:
  - Updated `App.tsx`:
    - Added a `<select>` dropdown inside the input container.
    - Added a vertical divider styling.
    - Updated `handleSearch` to pass the selected category.
  - Updated `services/gemini.ts`:
    - Added `category` parameter to `getLuauHelp`.
    - Enhanced prompt to strictly enforce syntax rules based on the category (e.g., checking for quotes on strings).
    - AI now returns specific "Invalid [Category]" errors.

## Update: Added Script Output Box
- **Goal**: Show what happens when the code runs (console output or effect) in a separate box.
- **Changes**:
  - Updated `services/gemini.ts` to include `scriptOutput` in the JSON schema and prompt.
  - Updated `App.tsx` layout:
    - Replaced the single centered code box with a `flex` row containing two boxes side-by-side.
    - Left box: "Script" (Input code).
    - Right box: "Output" (Result/Console logs).
    - Added headers ("SCRIPT", "OUTPUT") to the boxes for clarity.
    - Output text styled with a slight green tint to resemble a terminal/success log.

## Update: Input Validation & Error Handling
- **Goal**: Detect "nonsense" input (e.g., 'dadwe', 'locals') and display a specific error message instead of hallucinating an answer.
- **Changes**:
  - Updated `services/gemini.ts` schema to include `isValid: boolean`.
  - Updated prompt to explicitly handle nonsense input and return "You must type a valid variable, not nonsense."
  - Updated `App.tsx` to include `isError` state.
  - Added visual error feedback: red text for the message and red border accents on containers.
  - Hides the code box when the input is invalid.

## Update: Changed Trigger to "Enter" & Simplified Code
- **Goal**: User must press "Enter" to search (disabled auto-typing search). Code examples must be extremely basic.
- **Changes**:
  - Removed debounce `useEffect` in `App.tsx`.
  - Added `onKeyDown` handler to `textarea` to detect 'Enter' key.
  - Updated `services/gemini.ts` prompt to explicitly request "VERY BASIC, SIMPLE" code.

## Update: Luau/Roblox Assistant Logic
- **Goal**: Implement functionality where typing a variable name (like 'local') provides an explanation and a code snippet.
- **Changes**:
  - Updated `services/gemini.ts` with `getLuauHelp` using structured JSON output (`summary`, `code`).
  - Updated `App.tsx`:
    - Added state for `summary`, `code`, and `loading`.
    - Added debounce logic to auto-fetch data after 1 second of inactivity.
    - Mapped `summary` to the top area of the main box.
    - Mapped `code` to the smaller inner box.
    - Added loading states and transitions.