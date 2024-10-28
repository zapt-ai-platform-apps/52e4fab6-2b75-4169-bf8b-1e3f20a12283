# New App

## Voice Conversation with AI for the Visually Impaired

New App is an application designed to provide a seamless voice interaction experience with AI for visually impaired users. The app leverages speech recognition and text-to-speech technologies to facilitate a conversational interface without the need for visual cues.

### User Journey

1. **Launching the App**
   - The user opens the app, which is optimized for screen readers and voice navigation.

2. **Authentication**
   - The user signs in using the "Sign in with ZAPT" option.
   - Authentication is handled via Supabase, supporting social providers like Google, Facebook, and Apple.

3. **Starting a Conversation**
   - Upon successful login, the app prompts the user to begin speaking.
   - A clearly labeled button or voice command initiates the voice recognition.

4. **Voice Input**
   - The user asks a question or makes a statement orally.
   - The app uses the Web Speech API to capture and transcribe the user's voice input.

5. **Processing the Input**
   - The transcribed text is sent to the AI backend using the `createEvent` function with the `chatgpt_request` event type.
   - The AI processes the input and generates a response.

6. **Receiving and Outputting the Response**
   - The AI's textual response is received by the app.
   - The app converts the text to speech using the `text_to_speech` event type.
   - The spoken response is played back to the user.

7. **Continuing the Conversation**
   - The user can continue the conversation by speaking again.
   - The app remains in a listening mode or can be reactivated via a button or voice command.

### Features

- **Voice Recognition**: Allows users to input queries through speech.
- **AI Interaction**: Utilizes AI to generate responses to user queries.
- **Text-to-Speech**: Converts AI responses into spoken words for the user.
- **Accessible Design**: Optimized for use without visual interaction, supporting screen readers and keyboard navigation.
- **Authentication**: Secure sign-in using Supabase with support for multiple social providers.
- **Responsive Interface**: Ensures usability across various device sizes and types.

### External APIs and Services

- **Web Speech API**: Used for speech recognition and synthesis in the browser.
- **Supabase Auth**: Manages user authentication.
- **ZAPT AI Backend**: Handles AI processing and event creation.

### Environment Variables

- `VITE_PUBLIC_APP_ID`: Your application's public ID for ZAPT.
- `NEON_DB_URL`: Database URL for Neon (if applicable).

### Note

- Ensure that all necessary environment variables are set in a `.env` file.
- The app is designed to be fully functional without visual input, making it ideal for visually impaired users.
