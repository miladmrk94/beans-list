import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (hasSeenIntro) {
      navigate('/beans-list/');
    }
  }, [navigate]);

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenIntro', 'true');
    navigate('/beans-list/');
  };

  return (
    <div className="min-h-screen bg-[#323841] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-success">Welcome to Beans</h1>
          <p className="text-gray-300 text-lg">
            Your personal vocabulary learning assistant
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="bg-[#374151] p-4 rounded-lg">
              <h2 className="text-success font-semibold mb-2">📝 Easy Word Management</h2>
              <p className="text-gray-300 text-sm">
                Upload your vocabulary list or add words manually with translations
              </p>
            </div>

            <div className="bg-[#374151] p-4 rounded-lg">
              <h2 className="text-success font-semibold mb-2">🎯 Practice Mode</h2>
              <p className="text-gray-300 text-sm">
                Test your knowledge with interactive practice sessions
              </p>
            </div>

            <div className="bg-[#374151] p-4 rounded-lg">
              <h2 className="text-success font-semibold mb-2">🤖 AI Assistant</h2>
              <p className="text-gray-300 text-sm">
                Get detailed explanations and examples for each word
              </p>
            </div>
          </div>

          <button
            onClick={handleGetStarted}
            className="w-full btn btn-success text-white py-3 rounded-lg text-lg font-semibold"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intro; 