import { createSignal, onMount, Show, For } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [loading, setLoading] = createSignal(false);
  const [conversation, setConversation] = createSignal([]);
  const [isListening, setIsListening] = createSignal(false);
  const [recognition, setRecognition] = createSignal(null);

  onMount(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = 'ar-SA'; // Arabic language
      recog.continuous = false;
      recog.interimResults = false;

      recog.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setConversation([...conversation(), { speaker: 'user', text: transcript }]);
        await getAIResponse(transcript);
      };

      recog.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    } else {
      alert('متصفحك لا يدعم التعرف على الصوت'); // Your browser does not support speech recognition
    }
  });

  const startListening = () => {
    if (recognition()) {
      setIsListening(true);
      recognition().start();
    }
  };

  const stopListening = () => {
    if (recognition()) {
      setIsListening(false);
      recognition().stop();
    }
  };

  const getAIResponse = async (text) => {
    setLoading(true);
    try {
      const response = await createEvent('chatgpt_request', {
        prompt: text,
        response_type: 'text',
      });
      setConversation([...conversation(), { speaker: 'ai', text: response }]);
      await speakResponse(response);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  const speakResponse = async (text) => {
    try {
      const audioUrl = await createEvent('text_to_speech', {
        text,
        language: 'ar-SA',
      });
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error in text-to-speech:', error);
    }
  };

  return (
    <div class="min-h-screen bg-gray-100 p-4 text-gray-800">
      <div class="max-w-xl mx-auto">
        <div class="flex justify-center items-center mb-4">
          <h1 class="text-2xl font-bold text-purple-600">محادثة AI الصوتية</h1>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-md mb-4">
          <Show when={!isListening()}>
            <button
              class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={startListening}
            >
              اضغط للتحدث
            </button>
          </Show>
          <Show when={isListening()}>
            <button
              class="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={stopListening}
            >
              جاري الاستماع... اضغط للإيقاف
            </button>
          </Show>
        </div>

        <div class="bg-white p-4 rounded-lg shadow-md h-64 overflow-y-auto">
          <For each={conversation()}>
            {(msg) => (
              <div class={`mb-4 ${msg.speaker === 'user' ? 'text-right' : 'text-left'}`}>
                <p
                  class={`${
                    msg.speaker === 'user' ? 'bg-blue-100' : 'bg-gray-200'
                  } p-2 rounded-lg inline-block`}
                >
                  {msg.text}
                </p>
              </div>
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

export default App;