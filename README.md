# New App

## Voice Conversation with AI for the Visually Impaired

New App is an application designed to provide a seamless voice interaction experience with AI for visually impaired users. The app leverages speech recognition and text-to-speech technologies to facilitate a conversational interface without the need for visual cues or login.

### User Journey

1. **Launching the App**
   - The user opens the app, which is optimized for screen readers and voice navigation.
   - No login or sign-up is required.

2. **Starting a Conversation**
   - Upon opening the app, the user is presented with a simple interface to start speaking.
   - A clearly labeled button (both visually and via screen readers) initiates the voice recognition.

3. **Voice Input**
   - The user asks a question or makes a statement orally.
   - The app uses the Web Speech API to capture and transcribe the user's voice input in Arabic.

4. **Processing the Input**
   - The transcribed text is sent to the AI backend using the `createEvent` function with the `chatgpt_request` event type.
   - The AI processes the input and generates a response.

5. **Receiving and Outputting the Response**
   - The AI's textual response is received by the app.
   - The app converts the text to speech using the `text_to_speech` event type.
   - The spoken response is played back to the user.

6. **Continuing the Conversation**
   - The user can continue the conversation by speaking again.
   - The app remains in a listening mode or can be reactivated via the button.

### Features

- **Voice Recognition**: Allows users to input queries through speech in Arabic.
- **AI Interaction**: Utilizes AI to generate responses to user queries.
- **Text-to-Speech**: Converts AI responses into spoken words for the user.
- **Accessible Design**: Optimized for use without visual interaction, supporting screen readers and keyboard navigation.
- **Responsive Interface**: Ensures usability across various device sizes and types.

### External APIs and Services

- **Web Speech API**: Used for speech recognition and synthesis in the browser.
- **ZAPT AI Backend**: Handles AI processing and event creation.

### Environment Variables

- `VITE_PUBLIC_APP_ID`: Your application's public ID for ZAPT.

### Note

- The app is designed to be fully functional without visual input, making it ideal for visually impaired users.