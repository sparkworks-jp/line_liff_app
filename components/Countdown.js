import Countdown from 'react-countdown';

const CountdownTimer = ({ deadline }) => (
  <Typography
    component="span"
    sx={{
      marginLeft: "8px",
      color: "error.main",
      fontSize: '1rem',
    }}
  >
    <Countdown 
      date={deadline}
      renderer={({ hours, minutes, seconds }) => (
        <span>{`${hours}:${minutes}:${seconds}`}</span>
      )}
    />
  </Typography>
);