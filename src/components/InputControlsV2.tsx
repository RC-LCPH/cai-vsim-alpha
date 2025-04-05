// Version 2: Click-to-start-stop implementation with "SPEAK"/"STOP" toggle
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  inputContainerStyles,
  inputControlsStyles,
  micButtonStyles,
  orTextStyles,
  textFieldStyles,
  sendButtonStyles
} from '../styles/muiStyles';

interface InputControlsProps {
  textInput: string;
  setTextInput: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  handleTextSubmit: () => Promise<void>;
  handleMicStart: () => void;
  handleMicStop: () => void;
  isRecording: boolean;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const InputControlsV2: React.FC<InputControlsProps> = ({ 
  textInput, 
  setTextInput, 
  isLoading, 
  handleTextSubmit, 
  handleMicStart,
  handleMicStop,
  isRecording,
  handleKeyPress 
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Handle toggle between start/stop recording
  const handleMicClick = () => {
    if (isRecording) {
      handleMicStop();
    } else {
      handleMicStart();
    }
  };
  
  // Custom styles for the mic button in recording state
  const recordingMicButtonStyles = {
    ...micButtonStyles,
    backgroundColor: isRecording ? 'red' : undefined,
    '&:hover': {
      backgroundColor: isRecording ? '#c50000' : undefined,
    },
  };
  
  return (
    <Box sx={inputContainerStyles}>
      <Box sx={inputControlsStyles}>
        <TextField
          placeholder="Type your question"
          variant="outlined"
          fullWidth
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading || isRecording}
          size="small"
          className="text-input"
          sx={textFieldStyles}
        />
        
        <Button 
          variant="contained" 
          color={isRecording ? "error" : "primary"} 
          onClick={handleMicClick}
          disabled={isLoading && !isRecording}
          startIcon={isRecording ? <StopIcon /> : <MicIcon />}
          sx={recordingMicButtonStyles}
          size={isSmallScreen ? "small" : "medium"}
        >
          {isRecording ? (isSmallScreen ? 'Stop' : 'STOP') : (isSmallScreen ? 'Speak' : 'SPEAK')}
        </Button>
        
        <Typography variant="body2" sx={orTextStyles}>OR</Typography>
        
        <IconButton 
          color="primary" 
          onClick={handleTextSubmit}
          disabled={isLoading || !textInput.trim() || isRecording}
          sx={sendButtonStyles}
          size={isSmallScreen ? "small" : "medium"}
        >
          {isLoading ? <CircularProgress size={isSmallScreen ? 14 : 18} /> : <SendIcon fontSize={isSmallScreen ? "small" : "medium"} />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default InputControlsV2; 