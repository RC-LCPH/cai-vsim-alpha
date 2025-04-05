import { SxProps, Theme } from '@mui/material/styles';

// Root container styles
export const containerStyles = {
  width: '100%',
  height: '100%',
  padding: { xs: '0.625rem', sm: '0.9375rem', md: '1.25rem' },
  position: 'relative',
  zIndex: 1,
} as const;

// User message box styles
export const userMessageBoxStyles: SxProps<Theme> = {
  backgroundColor: 'rgba(227, 242, 253, 0.8)', // Light blue
  p: { xs: 0.75, sm: 1, md: 1.5 },
  borderRadius: { xs: 1.5, sm: 2 },
  maxWidth: { xs: '12.5rem', sm: '15.625rem', md: '18.75rem' },
  width: 'calc(100% - 5rem)',
  marginBottom: { xs: '0.5rem', sm: '0.75rem', md: '1rem' },
  alignSelf: 'flex-end',
  marginRight: { xs: '0.625rem', sm: '1.25rem', md: '1.875rem' },
  boxShadow: '0 0.0625rem 0.1875rem rgba(0,0,0,0.1)',
};

// Patient message box styles
export const patientMessageBoxStyles: SxProps<Theme> = {
  backgroundColor: 'rgba(241, 248, 233, 0.8)', // Light green
  p: { xs: 0.75, sm: 1, md: 1.5 },
  borderRadius: { xs: 1.5, sm: 2 },
  maxWidth: { xs: '12.5rem', sm: '15.625rem', md: '18.75rem' },
  width: 'calc(100% - 5rem)',
  marginTop: { xs: '0.25rem', sm: '0.3rem', md: '0.4rem' },
  alignSelf: 'flex-end',
  marginRight: { xs: '0.625rem', sm: '1.25rem', md: '1.875rem' },
  boxShadow: '0 0.0625rem 0.1875rem rgba(0,0,0,0.1)',
};

// Message text styles
export const messageTextStyles: SxProps<Theme> = {
  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem', lg: '0.85rem' },
  lineHeight: { xs: 1.3, sm: 1.4, md: 1.5 },
  wordBreak: 'break-word',
};

// Conversation container styles
export const conversationContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: { xs: '0.3rem', sm: '0.5rem' }
};

// Input container styles
export const inputContainerStyles: SxProps<Theme> = {
  position: 'fixed',
  bottom: { xs: '0.5rem', sm: '0.75rem', md: '0.8rem' },
  left: '50%',
  transform: 'translateX(-50%)',
  width: { xs: '98%', sm: '95%', md: '90%', lg: '85%' },
  maxWidth: '43.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 0.3, sm: 0.5 },
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  p: { xs: 0.5, sm: 0.75, md: 1 },
  borderRadius: { xs: 1.2, sm: 1.2, md: 1.2 },
  boxShadow: '0 -0.125rem 0.625rem rgba(0, 0, 0, 0.1)',
  zIndex: 10,
};

// Input controls layout styles
export const inputControlsStyles: SxProps<Theme> = {
  display: 'flex',
  gap: { xs: 0.3, sm: 0.5, md: 1 },
  alignItems: 'center',
  flexWrap: { xs: 'wrap', sm: 'nowrap' },
};

// Mic button styles
export const micButtonStyles: SxProps<Theme> = {
  height: { xs: '2rem', sm: '2.2rem', md: '2.6rem' },
  minWidth: { xs: '4.375rem', sm: '5.625rem', md: '6.875rem' },
  px: { xs: 0.3, sm: 0.5, md: 1 },
  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
  '& .MuiButton-startIcon': {
    marginRight: { xs: '0.125rem', sm: '0.25rem' },
    '& svg': {
      fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' },
    },
  },
  order: { xs: 2, sm: 1 },
  flexBasis: { xs: '40%', sm: 'auto' },
  m: { xs: '0.2rem 0', sm: 0 },
};

// OR text styles
export const orTextStyles: SxProps<Theme> = {
  mx: { xs: 0.3, sm: 0.5 },
  fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.8rem' },
  display: { xs: 'none', sm: 'block' },
  order: { xs: 3, sm: 2 },
};

// TextField styles
export const textFieldStyles: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    paddingY: 0,
    height: { xs: '1.875rem', sm: '2rem', md: '2.25rem' },
    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
  },
  flexGrow: 1,
  order: { xs: 1, sm: 3 },
  flexBasis: { xs: '100%', sm: 'auto' },
  mb: { xs: '0.2rem', sm: 0 },
};

// Send button styles
export const sendButtonStyles: SxProps<Theme> = {
  height: { xs: '1.875rem', sm: '2rem', md: '2.25rem' },
  width: { xs: '1.875rem', sm: '2rem', md: '2.25rem' },
  order: { xs: 3, sm: 4 },
  flexBasis: { xs: '40%', sm: 'auto' },
  m: { xs: '0.2rem 0', sm: 0 },
  '& svg': {
    fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem' },
  },
};

// Error alert styles
export const errorAlertStyles: SxProps<Theme> = {
  position: 'fixed',
  bottom: { xs: '3rem', sm: '4rem', md: '5rem' },
  left: '50%',
  transform: 'translateX(-50%)',
  width: { xs: '98%', sm: '95%', md: '90%', lg: '85%' },
  maxWidth: '43.75rem',
  py: { xs: 0.2, sm: 0.3, md: 0.5 },
  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.85rem' },
  zIndex: 10,
}; 