// Version 1: Original implementation with basic "Speak" button
import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
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
  handleMicClick: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const InputControlsV1: React.FC<InputControlsProps> = ({ 
  textInput, 
  setTextInput, 
  isLoading, 
  handleTextSubmit, 
  handleMicClick, 
  handleKeyPress 
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
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
          disabled={isLoading}
          size="small"
          className="text-input"
          sx={textFieldStyles}
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleMicClick}
          disabled={isLoading}
          startIcon={<MicIcon />}
          sx={micButtonStyles}
          size={isSmallScreen ? "small" : "medium"}
        >
          {isLoading ? (isSmallScreen ? 'Listening...' : 'Listening...') : (isSmallScreen ? 'Speak' : 'SPEAK')}
        </Button>
        
        <Typography variant="body2" sx={orTextStyles}>OR</Typography>
        
        <IconButton 
          color="primary" 
          onClick={handleTextSubmit}
          disabled={isLoading || !textInput.trim()}
          sx={sendButtonStyles}
          size={isSmallScreen ? "small" : "medium"}
        >
          {isLoading ? <CircularProgress size={isSmallScreen ? 14 : 18} /> : <SendIcon fontSize={isSmallScreen ? "small" : "medium"} />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default InputControlsV1; 