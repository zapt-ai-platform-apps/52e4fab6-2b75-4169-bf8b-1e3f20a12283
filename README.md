# New App

## Voice Conversation with AI for the Visually Impaired

New App provides a seamless voice interaction experience with AI for visually impaired users. The app leverages speech recognition and text-to-speech technologies to facilitate a conversational interface without the need for visual cues or login. The conversation text is not displayed, ensuring a pure auditory experience.

### User Journey

1. **Launching the App**
   - The user opens the app, optimized for screen readers and voice navigation.
   - No login or sign-up is required.

2. **Starting a Conversation**
   - Upon opening the app, the user is presented with a simple interface to start speaking.
   - A clearly labeled button (both visually and via screen readers) initiates voice recognition.

3. **Voice Input**
   - The user asks a question or makes a statement orally in Arabic.
   - The app uses the Web Speech API to capture and transcribe the user's voice input.

4. **Processing the Input**
   - The transcribed text is sent to the AI backend using the `createEvent` function with the `chatgpt_request` event type.
   - The AI processes the input and generates a response.

5. **Receiving and Outputting the Response**
   - The AI's textual response is converted to speech using the `text_to_speech` event type.
   - The spoken response is played back to the user.
   - The conversation text is not displayed on the screen.

6. **Continuing the Conversation**
   - The user can continue the conversation by speaking again.
   - The app remains ready for further interaction or can be reactivated via the button.

### Features

- **Voice Recognition**: Allows users to input queries through speech in Arabic.
- **AI Interaction**: Utilizes AI to generate responses to user queries.
- **Text-to-Speech**: Converts AI responses into spoken words for the user.
- **No Visual Conversation Text**: The conversation text is not displayed, focusing solely on auditory interaction.
- **Accessible Design**: Optimized for use without visual interaction, supporting screen readers and keyboard navigation.
- **Responsive Interface**: Ensures usability across various device sizes and types.

### External APIs and Services

- **Web Speech API**: Used for speech recognition in the browser.
- **ZAPT AI Backend**: Handles AI processing and event creation.

### Environment Variables

- `VITE_PUBLIC_APP_ID`: Your application's public ID for ZAPT.

### Note

- The app is designed to be fully functional without visual input, making it ideal for visually impaired users.
- The conversation text is not displayed on the screen to provide a seamless auditory experience.