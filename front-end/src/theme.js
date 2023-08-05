import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#2B3947",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#FFFFFF",
      dark: "#BDBDBD",
    },
  },
});

export default theme;

{/* <Timeline
  sx={{
    "& .MuiTimelineContent-root": {
      pt: "0px !important",
    },
  }}
>
  <TimelineItem>
    <TimelineSeparator>
      <RadioButtonCheckedIcon
        variant="outlined"
        sx={{ color: theme.palette.secondary.dark }}
      />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>Eat</TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineSeparator>
      <RadioButtonCheckedIcon
        variant="outlined"
        sx={{ color: theme.palette.secondary.dark }}
      />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>Code</TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineSeparator>
      <RadioButtonCheckedIcon
        variant="outlined"
        sx={{ color: theme.palette.secondary.dark }}
      />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>Sleep</TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineSeparator>
      <RadioButtonCheckedIcon
        variant="outlined"
        sx={{ color: theme.palette.secondary.dark }}
      />
      <TimelineConnector />
    </TimelineSeparator>
    <TimelineContent>Sleep</TimelineContent>
  </TimelineItem>
  <TimelineItem>
    <TimelineSeparator>
      <RadioButtonCheckedIcon
        sx={{ color: theme.palette.secondary.dark }}
        variant="outlined"
      />
    </TimelineSeparator>
    <TimelineContent>Repeat</TimelineContent>
  </TimelineItem>
</Timeline>; */}
