export function usePronunciation() {
  const speakWord = async (word) => {
    try {
      const API_KEY = 'AUC9q6lEMBcctHk7x4vpUjy7_rUliUi7vMYcb7vvKKsG';
      const API_URL = 'https://api.eu-de.text-to-speech.watson.cloud.ibm.com/instances/25602067-0601-4e93-9200-0bc46112baa2/v1/synthesize';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`apikey:${API_KEY}`)}`,
          'Content-Type': 'application/json',
          'Accept': 'audio/wav',
        },
        body: JSON.stringify({
          text: word,
          //voice: 'en-US_AllisonV3Voice', // You can choose different voices
          voice: 'en-US_EmmaExpressive', // You can choose different voices
          accept: 'audio/wav',
          gender: "female",
         
        })
      });

      if (!response.ok) throw new Error('Watson API request failed');

      const audioBlob = await response.blob();
      const audio = new Audio(URL.createObjectURL(audioBlob));
      audio.play();
    } catch (error) {
      console.error('Error with Watson TTS:', error);
      // Fall back to browser's speech synthesis as last resort
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return { speakWord };
} 