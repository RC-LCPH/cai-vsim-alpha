import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams } from 'react-router-dom';
import { requestHeraApi as requestHeraChampionApi, defaultConversationState, ConversationState } from './request_hera_champion_api';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import backgroundImage from './assets/images/EdithJacobson.png';
import backgroundImageSpeaking from './assets/images/EdithJacobson_speaks.png';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

// Import components
import LandingPage from './LandingPage';
import ConversationBubbles from './components/ConversationBubbles';
import InputControlsV1 from './components/InputControlsV1';
import InputControlsV2 from './components/InputControlsV2';
import InputControlsV3 from './components/InputControlsV3';

// Import services
import { 
  recognizeSpeech, 
  speakText, 
  startContinuousRecognition, 
  createPressHoldRecognition 
} from './services/speechService';

// Import theme and styles
import theme from './styles/theme';
import './styles/styles.css';
import { containerStyles, errorAlertStyles } from './styles/muiStyles';

// Patient profile information
const patientProfile = {
  name: 'Millie Larsen',
  gender: 'female',
  pronoun: 'her',
  condition: 'leg pain',
  voiceName: 'en-US-JennyNeural',
  voiceStyle: 'whispering'
};

// Main Router Component
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app/:version" element={<AppWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// AppWrapper Component that uses URL params
const AppWrapper: React.FC = () => {
  const { version } = useParams<{ version: string }>();
  return <MainApp version={version || '1'} />;
};

// Main App component that dynamically selects InputControls
const MainApp: React.FC<{ version: string }> = ({ version }) => {
  // Common state
  const [response, setResponse] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [textInput, setTextInput] = useState<string>("");
  const [conversationState, setConversationState] = useState<ConversationState>(defaultConversationState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, content: string}>>([]);
  const [error, setError] = useState<string | null>(null);
  const [showPatientResponse, setShowPatientResponse] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  
  // State for different input control versions
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Check if viewport is mobile size
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // References
  const isProcessingRef = useRef<boolean>(false);
  const recognizerRef = useRef<any>(null);

  // Set viewport meta tag on component mount
  useEffect(() => {
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement('meta');
      metaViewport.setAttribute('name', 'viewport');
      document.head.appendChild(metaViewport);
    }
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    
    // Initialize press-and-hold recognition for V3
    if (version === '3') {
      recognizerRef.current = createPressHoldRecognition();
    }
    
    // Cleanup on unmount
    return () => {
      if (recognizerRef.current && recognizerRef.current.recognizer) {
        recognizerRef.current.recognizer.close();
      }
    };
  }, [version]);

  // Set background image as CSS variable
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background-image', `url(${backgroundImage})`);
    root.style.setProperty('--background-image-speaking', `url(${backgroundImageSpeaking})`);
  }, []);

  // V1: Basic Speak Button handlers
  const handleMicClick = async () => {
    if (isProcessingRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const recognizedText = await recognizeSpeech();
      setUserInput(recognizedText);
      await processUserInput(recognizedText);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred with speech recognition.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // V2: Start/Stop Button handlers
  const handleMicStart = () => {
    if (isProcessingRef.current) return;
    
    setError(null);
    setIsRecording(true);
    
    recognizerRef.current = startContinuousRecognition(
      // Interim results callback
      (text) => {
        setUserInput(text);
      },
      // Final result callback
      (finalText) => {
        processUserInput(finalText);
      },
      // Error callback
      (errorMsg) => {
        setError(errorMsg);
        setIsRecording(false);
      }
    );
    
    recognizerRef.current.start();
  };
  
  const handleMicStop = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // V3: Press and Hold handlers
  const handlePressStart = () => {
    if (isProcessingRef.current || !recognizerRef.current) return;
    
    setError(null);
    recognizerRef.current.start();
  };
  
  const handlePressStop = async () => {
    if (!recognizerRef.current) return;
    
    setIsProcessing(true);
    
    try {
      const recognizedText = await recognizerRef.current.stop();
      setUserInput(recognizedText);
      await processUserInput(recognizedText);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred with speech recognition.");
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Common handlers
  const handleTextSubmit = async () => {
    if (!textInput.trim() || isProcessingRef.current) return;
    
    setUserInput(textInput);
    setTextInput("");
    await processUserInput(textInput);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };
  
  const processUserInput = async (input: string) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    
    setIsLoading(true);
    setError(null);
    setShowPatientResponse(false);
    
    // Only show user's input initially
    const updatedHistory = [{role: 'user', content: input}];
    setConversationHistory(updatedHistory);
    
    try {
      const heraResponse = await requestHeraChampionApi(input, conversationState);
      
      setResponse(heraResponse.response);
      setConversationState(heraResponse.conversationState);
      
      // Update conversation history but don't show patient response yet
      const fullHistory = [...updatedHistory, {role: 'assistant', content: heraResponse.response}];
      setConversationHistory(fullHistory);
      
      // Add delay before showing patient response (800ms)
      setTimeout(() => {
        setShowPatientResponse(true);
        // Speak the response (speech will start at roughly the same time the bubble appears)
        speakAnswer(heraResponse.response);
      }, 800);
      
    } catch (error) {
      console.error("Error processing input with Hera API:", error);
      setError("There was an error processing your request. Please try again.");
    } finally {
      setIsLoading(false);
      isProcessingRef.current = false;
    }
  };

  const speakAnswer = (text: string) => {
    speakText(
      text,
      patientProfile,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      (errorMsg) => {
        console.error("Speech synthesis error:", errorMsg);
        setIsSpeaking(false);
      }
    );
  };
  
  // Render the appropriate input controls based on version
  const renderInputControls = () => {
    switch (version) {
      case '1':
        return (
          <InputControlsV1 
            textInput={textInput}
            setTextInput={setTextInput}
            isLoading={isLoading}
            handleTextSubmit={handleTextSubmit}
            handleMicClick={handleMicClick}
            handleKeyPress={handleKeyPress}
          />
        );
      case '2':
        return (
          <InputControlsV2 
            textInput={textInput}
            setTextInput={setTextInput}
            isLoading={isLoading}
            handleTextSubmit={handleTextSubmit}
            handleMicStart={handleMicStart}
            handleMicStop={handleMicStop}
            isRecording={isRecording}
            handleKeyPress={handleKeyPress}
          />
        );
      case '3':
        return (
          <InputControlsV3 
            textInput={textInput}
            setTextInput={setTextInput}
            isLoading={isLoading}
            handleTextSubmit={handleTextSubmit}
            handleMicStart={handlePressStart}
            handleMicStop={handlePressStop}
            isProcessing={isProcessing}
            handleKeyPress={handleKeyPress}
          />
        );
      default:
        return (
          <InputControlsV1 
            textInput={textInput}
            setTextInput={setTextInput}
            isLoading={isLoading}
            handleTextSubmit={handleTextSubmit}
            handleMicClick={handleMicClick}
            handleKeyPress={handleKeyPress}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div 
        className={`app-background ${isSpeaking ? 'patient-speaking' : ''}`}
      >
        <Box sx={containerStyles}>
          <ConversationBubbles
            conversationHistory={conversationHistory}
            showPatientResponse={showPatientResponse}
            patientName={patientProfile.name}
          />
        </Box>
        
        {/* Dynamic input controls based on version */}
        {renderInputControls()}
        
        {/* Error message above input box */}
        {error && (
          <Alert severity="error" sx={errorAlertStyles}>
            {error}
          </Alert>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;