import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

// Speech API constants
const SPEECH_API_KEY = process.env.REACT_APP_SPEECH_API_KEY || "";
const SPEECH_REGION = process.env.REACT_APP_SPEECH_REGION || "eastus";

// Interface for patient profile
interface PatientProfile {
  voiceName: string;
  voiceStyle: string;
}

/**
 * Recognize speech from microphone input - one-time recognition
 * @returns Promise that resolves to recognized text
 */
export const recognizeSpeech = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(SPEECH_API_KEY, SPEECH_REGION);
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(result => {
      recognizer.close();
      
      if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        const text = result.text.trim();
        if (text) {
          resolve(text);
        } else {
          reject(new Error("No speech detected. Please try again."));
        }
      } else {
        reject(new Error("Speech recognition failed. Please try again or use text input."));
      }
    });
  });
};

/**
 * Continuous speech recognition with explicit stop
 * @param onInterimResult Callback for interim results
 * @param onFinalResult Callback for final result
 * @returns Object with start and stop methods
 */
export const startContinuousRecognition = (
  onInterimResult: (text: string) => void,
  onFinalResult: (text: string) => void,
  onError: (error: string) => void
) => {
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(SPEECH_API_KEY, SPEECH_REGION);
  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
  
  let finalText = '';
  
  recognizer.recognized = (_, event) => {
    if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
      const text = event.result.text.trim();
      if (text) {
        finalText += ' ' + text;
        onInterimResult(finalText.trim());
      }
    }
  };
  
  recognizer.canceled = (_, event) => {
    if (event.reason === SpeechSDK.CancellationReason.Error) {
      onError(event.errorDetails || "Speech recognition error");
    }
    recognizer.stopContinuousRecognitionAsync();
  };
  
  recognizer.sessionStopped = () => {
    recognizer.stopContinuousRecognitionAsync();
    if (finalText) {
      onFinalResult(finalText.trim());
    } else {
      onError("No speech detected");
    }
  };
  
  const start = () => {
    finalText = '';
    recognizer.startContinuousRecognitionAsync();
  };
  
  const stop = () => {
    recognizer.stopContinuousRecognitionAsync();
    if (finalText) {
      onFinalResult(finalText.trim());
    } else {
      onError("No speech detected");
    }
  };
  
  return { start, stop, recognizer };
};

/**
 * Press and hold speech recognition
 * @returns Object with start and stop methods
 */
export const createPressHoldRecognition = () => {
  let recognizer: SpeechSDK.SpeechRecognizer | null = null;
  let recognizedText = '';
  
  const start = (): Promise<void> => {
    return new Promise((resolve) => {
      recognizedText = ''; // Reset text at the start
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(SPEECH_API_KEY, SPEECH_REGION);
      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
      
      // For ongoing recognition (not final)
      recognizer.recognizing = (_, event) => {
        if (event.result.reason === SpeechSDK.ResultReason.RecognizingSpeech) {
          // Just update with latest interim result rather than accumulating
          recognizedText = event.result.text;
        }
      };
      
      // For final recognition segments
      recognizer.recognized = (_, event) => {
        if (event.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          // Replace "Nurse:" if it's being repeated at the beginning of segments
          const newText = event.result.text.replace(/^Nurse:\s*/i, '');
          recognizedText = recognizedText ? `${recognizedText}?` : newText;
        }
      };
      
      recognizer.startContinuousRecognitionAsync(() => {
        resolve();
      });
    });
  };
  
  const stop = (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!recognizer) {
        reject(new Error("Recognition not started"));
        return;
      }
      
      recognizer.stopContinuousRecognitionAsync(
        () => {
          if (recognizedText.trim()) {
            let finalText = recognizedText.trim();
            finalText = finalText.replace(/Nurse:\s*Nurse:\s*/i, 'Nurse: ');
            resolve(finalText);
          } else {
            reject(new Error("No speech detected. Please try again."));
          }
          recognizer?.close();
          recognizer = null;
          recognizedText = '';
        },
        (err) => {
          reject(new Error("Speech recognition failed: " + err));
          recognizer?.close();
          recognizer = null;
          recognizedText = '';
        }
      );
    });
  };
  
  return { start, stop };
};

/**
 * Synthesize speech from text
 * @param text Text to speak
 * @param patientProfile Patient profile with voice settings
 * @param onStart Callback for when speech starts
 * @param onComplete Callback for when speech completes
 * @param onError Callback for when speech fails
 */
export const speakText = (
  text: string,
  patientProfile: PatientProfile,
  onStart: () => void,
  onComplete: () => void,
  onError: (error: string) => void
): void => {
  if (!text) return;
  
  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(SPEECH_API_KEY, SPEECH_REGION);
  speechConfig.speechSynthesisVoiceName = patientProfile.voiceName;
  
  const ssmlText = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
    <voice name="${patientProfile.voiceName}">
      <mstts:express-as style="${patientProfile.voiceStyle}">
        ${text}
      </mstts:express-as>
    </voice>
  </speak>`;
  
  // Call the start callback
  onStart();
  
  const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
  synthesizer.speakSsmlAsync(ssmlText, result => {
    if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
      // Estimate speech duration based on word count
      // With a minimum of 1.5 seconds and an additional 0.5s buffer
      const wordCount = text.split(' ').length;
      const estimatedDuration = Math.max(1.5, wordCount * 0.3) + 0.5;
      
      // Keep the speaking image active until audio finishes playing
      setTimeout(() => {
        onComplete();
      }, estimatedDuration * 1000);
    } else {
      onError(result.errorDetails || "Speech synthesis failed");
    }
    synthesizer.close();
  });
}; 