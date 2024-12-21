import { useRef } from "react";

export function usePronunciation() {
  const audioCache = useRef({});

  const speakWord = async (word) => {
    try {
      if (audioCache.current[word]) {
        audioCache.current[word].play();
        return;
      }

      const API_KEY = "sk_47f51bc4f15fc72d13db62ad317f8ad7303c6dc8bb937d48";
      const API_URL =
        "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: word,
          model_id: "eleven_turbo_v2",
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      const audioBlob = await response.blob();
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audioCache.current[word] = audio;
      audio.play();
    } catch (error) {
      console.error("Error with ElevenLabs TTS:", error);

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";

      const voices = window.speechSynthesis.getVoices();

      const markVoice = voices.find(
        (voice) => voice.name === "Google US English"
      );

      if (markVoice) {
        utterance.voice = markVoice;
      }

      utterance.pitch = 1;
      utterance.rate = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    }
  };

  return { speakWord };
}
