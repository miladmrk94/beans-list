import { useState } from 'react';



function extractTextAsObject(apiResponse) {
  // استخراج مقدار text از پاسخ API
  const text = apiResponse.candidates[0].content.parts[0].text;
  
  // پیدا کردن متن از اولین '{' تا آخرین '}'
  const jsonText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1).trim();

  try {
      // تبدیل متن به آبجکت JSON
      return JSON.parse(jsonText);
  } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
  }
}

const VocabularyAssistant = () => {
  const [inputWord, setInputWord] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!inputWord) return;
    setLoading(true);
    setOutput(null);

    try {
      // ارسال درخواست به سرور Render
      const response = await fetch('https://beansproxy.onrender.com/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: inputWord }),
      });

      const result = await response.json();
      console.log(extractTextAsObject(result));
      

      // بررسی و نمایش پاسخ
      setOutput(result.response ? result.response.text : 'No result received.');
    } catch (error) {
      console.error('Error:', error);
      setOutput('An error occurred while generating the response.');
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Vocabulary Assistant</h1>
      <input
        type="text"
        placeholder="Enter a word..."
        value={inputWord}
        onChange={(e) => setInputWord(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '10px' }}
      />
      <button
        onClick={handleGenerate}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Generate'}
      </button>
      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
        <h3>Output:</h3>
        <code>{output}</code>
      </div>
    </div>
  );
};

export default VocabularyAssistant;
