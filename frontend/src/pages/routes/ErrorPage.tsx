import { Box, Typography, Container } from '@mui/material';

export default function ErrorPage() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
        zIndex: 9999,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="error">
          Oops! Something went wrong.
        </Typography>
        <Typography variant="h6" color="text.secondary">
          We're working to fix it. Please try again later.
        </Typography>
      </Container>
    </Box>
  );
}
