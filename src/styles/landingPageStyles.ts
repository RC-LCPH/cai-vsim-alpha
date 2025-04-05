import { SxProps, Theme } from '@mui/material/styles';

// Main container styles
export const mainContainerStyles: SxProps<Theme> = {
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: { xs: 2, sm: 4, md: 6, lg: 8 }
};

// Logo container styles
export const logoContainerStyles: SxProps<Theme> = {
  position: 'absolute',
  top: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
  left: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
  paddingLeft: { xs: 2, sm: 3, md: 4 },
  zIndex: 10
};

// Logo image styles
export const logoImageStyles: SxProps<Theme> = {
  width: { xs: '7.5rem', sm: '9.375rem', md: '11.25rem' },
  height: 'auto',
  borderRadius: '1.875rem',
  marginLeft: { xs: 3, sm: 5, md: 8 },
  marginTop: { xs: 2, sm: 3, md: 4 }
};

// Title container styles
export const titleContainerStyles: SxProps<Theme> = {
  position: 'absolute',
  top: { xs: '2.5rem', sm: '3rem', md: '3.75rem', lg: '4.125rem' },
  right: { xs: '1rem', sm: '1.5rem', md: '2rem', lg: '3rem' },
  zIndex: 10
};

// Title text styles
export const titleTextStyles: SxProps<Theme> = {
  textAlign: 'right',
  paddingRight: { xs: 2, sm: 4, md: 6, lg: 8 },
  fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.25rem', lg: '2.75rem' }
};

// Content container styles
export const contentContainerStyles: SxProps<Theme> = {
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  flex: 1,
  position: 'relative',
  marginTop: { xs: '3rem', sm: '3.75rem', md: '4.5rem', lg: '5rem' },
  gap: { xs: 3, sm: 4, md: 5 }
};

// Left side container styles
export const leftSideStyles: SxProps<Theme> = {
  width: { xs: '100%', md: '50%' },
  display: 'flex',
  flexDirection: 'column',
  padding: { xs: 2, sm: 3 },
  paddingTop: { xs: 6, sm: 8, md: 10, lg: 12 },
  paddingLeft: { xs: 2, sm: 4, md: 6, lg: 8 },
  alignSelf: 'flex-start'
};

// Screenshot image styles
export const screenshotImageStyles: SxProps<Theme> = {
  width: '100%',
  height: 'auto',
  border: '0.2rem solid #ccc',
  objectFit: 'contain'
};

// Disclaimer text styles
export const disclaimerTextStyles: SxProps<Theme> = {
  mt: 2,
  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem', lg: '1.1rem' }
};

// Right side container styles
export const rightSideStyles: SxProps<Theme> = {
  width: { xs: '100%', md: '50%' },
  display: 'flex',
  flexDirection: 'column',
  padding: { xs: 2, sm: 4, md: 6, lg: 9 },
  paddingTop: { xs: 2, sm: 3, md: 0 },
  alignSelf: 'flex-start',
};

// Option container styles
export const optionContainerStyles: SxProps<Theme> = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  padding: { xs: 2, sm: 3, md: 4, lg: 6 },
  borderRadius: 2,
  boxShadow: 3,
  width: { xs: '100%', md: '110%', lg: '120%' },
  marginLeft: { md: '-5%', lg: '-10%' },
  marginTop: { xs: '-0.15rem', sm: '-0.25rem', md: '-0.5rem', lg: '-1rem' }
};

// Card styles
export const cardStyles: SxProps<Theme> = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  marginRight: { xs: 0, sm: 1, md: 1, lg: 2 },
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: 3
  }
};

// Card media styles for standard buttons
export const cardMediaStyles: SxProps<Theme> = {
  height: 'auto',
  objectFit: 'contain',
  padding: { xs: 1, sm: 1.5, md: 2 },
  maxHeight: { xs: '7.5rem', sm: '9rem', md: '10rem', lg: '11.25rem' }
};

// Card media styles for smaller buttons
export const smallCardMediaStyles: SxProps<Theme> = {
  height: 'auto',
  objectFit: 'contain',
  padding: { xs: 1, sm: 1.5, md: 2 },
  maxHeight: { xs: '4rem', sm: '5rem', md: '5.5rem', lg: '6.25rem' }
};

// Card media styles for stop button
export const stopButtonMediaStyles: SxProps<Theme> = {
  height: 'auto',
  objectFit: 'contain',
  marginTop: { xs: -2, sm: -3, md: -4 },
  padding: { xs: 1.2, sm: 1.6, md: 2, lg: 2.2 },
  borderRadius: 3,
  maxHeight: { xs: '4rem', sm: '5rem', md: '5.5rem', lg: '6.25rem' }
};

// Description typography styles
export const descriptionTextStyles: SxProps<Theme> = {
  mb: { xs: 2, sm: 3 },
  fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
};

// Card content styles
export const cardContentStyles: SxProps<Theme> = {
  flexGrow: 1,
  padding: { xs: 1.5, sm: 2 },
  '&:last-child': { paddingBottom: { xs: 1.5, sm: 2 } }
};

// Card title typography styles
export const cardTitleStyles: SxProps<Theme> = {
  fontSize: { xs: '0.5rem', sm: '0.75rem', md: '1rem' },
  marginTop: { xs: '-0.15rem', sm: '-0.25rem', md: '-0.5rem' }
};

// Card description typography styles
export const cardDescriptionStyles: SxProps<Theme> = {
  fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' }
};

// Grid container spacing
export const gridContainerStyles: SxProps<Theme> = {
  spacing: { xs: 2, sm: 2, md: 3 }
}; 