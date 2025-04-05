import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';

// Import assets
import backgroundImage from './assets/images/screenshot.png';
import button1Image from './assets/images/button1.png';
import button2Image from './assets/images/button2stop.png';
import button3Image from './assets/images/button3press_hold.png';
import logoImage from './assets/images/Laerdal_logo.png';

// Import theme
import theme from './styles/theme';

// Import styles
import {
  mainContainerStyles,
  logoContainerStyles,
  logoImageStyles,
  titleContainerStyles,
  titleTextStyles,
  contentContainerStyles,
  leftSideStyles,
  screenshotImageStyles,
  disclaimerTextStyles,
  rightSideStyles,
  optionContainerStyles,
  cardStyles,
  cardMediaStyles,
  smallCardMediaStyles,
  stopButtonMediaStyles,
  descriptionTextStyles,
  cardContentStyles,
  cardTitleStyles,
  cardDescriptionStyles,
  gridContainerStyles
} from './styles/landingPageStyles';

const LandingPage: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={mainContainerStyles}>
        {/* Logo at top left */}
        <Box sx={logoContainerStyles}>
          <Box
            component="img"
            src={logoImage}
            alt="Logo"
            sx={logoImageStyles}
          />
        </Box>

        {/* Title positioned at top right */}
        <Box sx={titleContainerStyles}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={titleTextStyles}
          >
            CAI in vSim prototype (alpha)
          </Typography>
        </Box>

        {/* Main content container - moved down with marginTop */}
        <Box sx={contentContainerStyles}>
          {/* Left side with screenshot */}
          <Box sx={leftSideStyles}>
            {/* Screenshot in left */}
            <Box
              component="img"
              src={backgroundImage}
              alt="Application Screenshot"
              sx={screenshotImageStyles}
            />
            <Typography variant="body2" color="text.secondary" sx={disclaimerTextStyles}>
              [Disclaimer: This is a prototype and not a real application. 
              It includes static images instead fo the animated simulation of the patient that the real application has.
              The only interactable elements are the speech controls for the speak interaction with the virtual patient.]
            </Typography>
          </Box>
          
          {/* Right side with option cards */}
          <Box sx={rightSideStyles}>
            
            {/* Content container */}
            <Box sx={optionContainerStyles}>
              
              <Typography variant="body1" paragraph sx={descriptionTextStyles}>
                With this prototype you can verbally interact with a virtual patient, you can ask questions about 
                symptoms and pain to practice your communication and assessment skills.
              </Typography>
              
              <Typography variant="body1" paragraph sx={descriptionTextStyles}>
                Select what type of button style you want to use to control the speak interaction:
              </Typography>
              
              <Grid container sx={gridContainerStyles}>
                {/* Option 1: Basic Speak Button */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={cardStyles}
                    component={Link}
                    to="/app/1"
                  >
                    <CardMedia
                      component="img"
                      sx={cardMediaStyles}
                      image={button1Image}
                      alt="Simple speak button"
                    />
                    <CardContent sx={cardContentStyles}>
                      <Typography gutterBottom variant="body2" component="div" sx={cardTitleStyles}>
                        Mic Speak
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={cardDescriptionStyles}>
                        Click to speak, when you stop speaking the speech ends
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Option 2: Toggle Button with Start/Stop */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={cardStyles}
                    component={Link}
                    to="/app/2"
                  >
                    <CardMedia
                      component="img"
                      sx={smallCardMediaStyles}
                      image={button1Image}
                      alt="Simple speak button"
                    />
                    <CardMedia
                      component="img"
                      sx={stopButtonMediaStyles}
                      image={button2Image}
                      alt="Stop button"
                    />
                    <CardContent sx={cardContentStyles}>
                      <Typography gutterBottom variant="body2" component="div" sx={cardTitleStyles}>
                        Speak / Stop
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={cardDescriptionStyles}>
                        Click to start speaking, click again to stop
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                {/* Option 3: Press and Hold Button */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card 
                    sx={cardStyles}
                    component={Link}
                    to="/app/3"
                  >
                    <CardMedia
                      component="img"
                      sx={cardMediaStyles}
                      image={button3Image}
                      alt="Press and hold button"
                    />
                    <CardContent sx={cardContentStyles}>
                      <Typography gutterBottom variant="body2" component="div" sx={cardTitleStyles}>
                        Press & Hold
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={cardDescriptionStyles}>
                        Press and hold while speaking, release when done
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage; 