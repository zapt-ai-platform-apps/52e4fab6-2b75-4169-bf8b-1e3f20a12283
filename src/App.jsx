import { createSignal, onMount, Show } from 'solid-js';
import { createEvent } from './supabaseClient';

function App() {
  const [loading, setLoading] = createSignal(false);
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
        await getAIResponse(transcript);
      };

      recog.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setLoading(false);
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
    if (recognition() && !isListening()) {
      setIsListening(true);
      recognition().start();
    }
  };

  const stopListening = () => {
    if (recognition() && isListening()) {
      recognition().stop();
      setIsListening(false);
    }
  };

  const getAIResponse = async (text) => {
    setLoading(true);
    try {
      const response = await createEvent('chatgpt_request', {
        prompt: text,
        response_type: 'text',
      });
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

      audio.onended = () => {
        startListening();
      };
    } catch (error) {
      console.error('Error in text-to-speech:', error);
    }
  };

  return (
    <div class="h-full bg-gray-100 p-4 text-gray-800">
      <div class="h-full max-w-xl mx-auto flex flex-col justify-center items-center">
        <h1 class="text-2xl font-bold text-purple-600 mb-4">محادثة AI الصوتية</h1>

        <div class="bg-white p-4 rounded-lg shadow-md w-full">
          <Show when={!isListening()}>
            <button
              class="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={startListening}
              disabled={loading()}
            >
              {loading() ? 'جارٍ المعالجة...' : 'اضغط للتحدث'}
            </button>
          </Show>
          <Show when={isListening()}>
            <button
              class="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={stopListening}
              disabled={loading()}
            >
              جاري الاستماع... اضغط للإيقاف
            </button>
          </Show>
        </div>
      </div>
    </div>
  );
}

export default App;