import React, { useEffect, useRef, useState } from 'react';

const VoiceAssistant = () => {
  const [text, setText] = useState('');
  const recognitionRef = useRef(null);
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      handleSubmit(transcript); // send to backend
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    recognitionRef.current.start();
  };

  const handleSubmit = async (voiceText:string) => {
    try {
      const res = await fetch('http://localhost:3000/ai/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: voiceText }),
      });

      const data = await res.json();
      speakText(data.response); 
    } catch (error) {
      console.error(error);
    }
  };

  const speakText = (text:string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🎙️ Voice Assistant</h2>
      <p><strong>Detected:</strong> {text}</p>
      <button onClick={startListening}>Start Talking</button>
    </div>
  );
};

export default VoiceAssistant;
