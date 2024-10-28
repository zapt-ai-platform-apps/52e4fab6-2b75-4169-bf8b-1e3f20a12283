import { createSignal, onMount, createEffect, Show } from 'solid-js';
import { supabase, createEvent } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [loading, setLoading] = createSignal(false);
  const [conversation, setConversation] = createSignal([]);
  const [isListening, setIsListening] = createSignal(false);
  const [recognition, setRecognition] = createSignal(null);

  const checkUserSignedIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(() => {
    checkUserSignedIn();
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

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

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
    <div class="h-full bg-gray-100 p-4 text-gray-800">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center h-full">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">
                تسجيل الدخول باستخدام ZAPT
              </h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                تعرف على المزيد حول ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                showLinks={false}
                localization={{
                  variables: {
                    sign_in: {
                      email_label: 'البريد الإلكتروني',
                      password_label: 'كلمة المرور',
                      button_label: 'تسجيل الدخول',
                    },
                  },
                }}
              />
            </div>
          </div>
        }
      >
        <div class="max-w-xl mx-auto">
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold text-purple-600">محادثة AI الصوتية</h1>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
              onClick={handleSignOut}
            >
              تسجيل الخروج
            </button>
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
                <div
                  class={`mb-4 ${
                    msg.speaker === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
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
      </Show>
    </div>
  );
}

export default App;