// Version 3: Press and hold to speak implementation
import React, { useState } from 'react';
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
  handleMicStart: () => void;
  handleMicStop: () => Promise<void>;
  isProcessing: boolean;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const InputControlsV3: React.FC<InputControlsProps> = ({ 
  textInput, 
  setTextInput, 
  isLoading, 
  handleTextSubmit, 
  handleMicStart,
  handleMicStop,
  isProcessing,
  handleKeyPress 
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isHolding, setIsHolding] = useState(false);
  
  // Handle mouse events for press-and-hold
  const handleMouseDown = () => {
    setIsHolding(true);
    handleMicStart();
  };
  
  const handleMouseUp = async () => {
    if (isHolding) {
      setIsHolding(false);
      await handleMicStop();
    }
  };
  
  // Handle touch events for mobile devices
  const handleTouchStart = () => {
    setIsHolding(true);
    handleMicStart();
  };
  
  const handleTouchEnd = async () => {
    if (isHolding) {
      setIsHolding(false);
      await handleMicStop();
    }
  };
  
  // Custom styles for the mic button in processing/holding state
  const pressHoldMicButtonStyles = {
    ...micButtonStyles,
    backgroundColor: isHolding ? '#888888' : undefined,
    '&:hover': {
      backgroundColor: isHolding ? '#777777' : undefined,
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
          disabled={isLoading || isHolding}
          size="small"
          className="text-input"
          sx={textFieldStyles}
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={isLoading || isProcessing}
          startIcon={<MicIcon />}
          sx={pressHoldMicButtonStyles}
          size={isSmallScreen ? "small" : "medium"}
        >
          {isHolding ? (isSmallScreen ? 'Processing...' : 'PROCESSING SPEECH') : 
           (isSmallScreen ? 'Press & hold' : 'PRESS & HOLD TO SPEAK')}
        </Button>
        
        <Typography variant="body2" sx={orTextStyles}>OR</Typography>
        
        <IconButton 
          color="primary" 
          onClick={handleTextSubmit}
          disabled={isLoading || !textInput.trim() || isHolding}
          sx={sendButtonStyles}
          size={isSmallScreen ? "small" : "medium"}
        >
          {isLoading ? <CircularProgress size={isSmallScreen ? 14 : 18} /> : <SendIcon fontSize={isSmallScreen ? "small" : "medium"} />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default InputControlsV3; 