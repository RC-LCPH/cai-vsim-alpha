import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import {
  userMessageBoxStyles,
  patientMessageBoxStyles,
  messageTextStyles,
  conversationContainerStyles
} from '../styles/muiStyles';

// Message component for user input
const UserMessage = ({ content }: { content: string }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={userMessageBoxStyles}>
      <Typography 
        variant={isSmallScreen ? "caption" : "subtitle2"} 
        fontWeight="bold"
      >
        Nurse:
      </Typography>
      <Typography variant="body2" sx={messageTextStyles}>
        {content}
      </Typography>
    </Box>
  );
};

// Message component for patient response
const PatientMessage = ({ content, patientName }: { content: string, patientName: string }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={patientMessageBoxStyles}>
      <Typography 
        variant={isSmallScreen ? "caption" : "subtitle2"} 
        fontWeight="bold"
      >
        Patient {patientName}:
      </Typography>
      <Typography variant="body2" sx={messageTextStyles}>
        {content}
      </Typography>
    </Box>
  );
};

interface ConversationBubblesProps {
  conversationHistory: Array<{role: string, content: string}>;
  showPatientResponse: boolean;
  patientName: string;
}

const ConversationBubbles: React.FC<ConversationBubblesProps> = ({ 
  conversationHistory, 
  showPatientResponse, 
  patientName 
}) => {
  if (conversationHistory.length === 0) {
    return null;
  }

  return (
    <Box sx={conversationContainerStyles}>
      {/* Always show the user's input immediately */}
      <UserMessage content={conversationHistory[0].content} />
      
      {/* Only show patient response after delay (controlled by state) */}
      {conversationHistory.length >= 2 && showPatientResponse && (
        <PatientMessage 
          content={conversationHistory[1].content} 
          patientName={patientName} 
        />
      )}
    </Box>
  );
};

export default ConversationBubbles; 