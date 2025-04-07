import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParties, submitVote } from './voteController';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Box,
} from '@mui/material';
import './vote.css'; // Optional: Keep custom CSS if needed for additional styling

const Vote = () => {
  const dispatch = useDispatch();
  const { parties, loading, error, message } = useSelector((state) => state.vote);
  const [selectedParty, setSelectedParty] = useState(null);
  const [voteError, setVoteError] = useState(''); // State to hold vote error message

  useEffect(() => {
    dispatch(fetchParties()); // Fetch parties when the component mounts
  }, [dispatch]);

  const handleVote = async () => {
    const userId = sessionStorage.getItem('userId'); // Retrieve userId from sessionStorage
    console.log('userId:', userId); // Debugging
    console.log('selectedParty:', selectedParty); // Debugging

    if (userId && selectedParty) {
      try {
        const response = await dispatch(submitVote({ userId, partyId: selectedParty })).unwrap();
        console.log('response:', response); // Debugging
        if (response.message === "You have already voted!") {
          alert("You have already cast your vote!"); // Show an alert popup
          setVoteError("You have already cast your vote!"); // Display vote error message
        } else {
          setVoteError(''); // Clear any previous vote error message
        }
      } catch (error) {
        console.error('Vote submission error:', error); // Debugging
        if (error.response?.status === 9999) {
          setVoteError("You have already cast your vote!"); // Handle custom status code 9999
          alert("You have already cast your vote!"); // Show an alert popup
        } else if (error.response?.status === 400) {
          setVoteError(error.response.data.message || "You Already Voted!"); // Handle 400 status error
          alert(error.response.data.message || "You Already Voted!"); // Show an alert popup for 400 status
        } else {
          setVoteError("You Already Voted!"); // Handle general errors
          alert('You Already Voted!');
        }
      }
    } else {
      alert('Please select a party to vote and make sure you are logged in.');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('userId'); // Remove userId from sessionStorage
    window.location.href = '/login';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" align="center" gutterBottom color="primary">
        Cast Your Vote
      </Typography>
      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ my: 2 }}>
          {message}
        </Alert>
      )}
      {voteError && (
        <Alert severity="error" sx={{ my: 2 }}>
          {voteError}
        </Alert>
      )}
      <Grid container spacing={3} justifyContent="center">
        {parties.map((party) => (
          <Grid item xs={12} sm={6} md={4} key={party.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)' },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={`data:image/jpeg;base64,${party.image}`}
                alt={party.name}
                sx={{ objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <RadioGroup
                  value={selectedParty}
                  onChange={(e) => setSelectedParty(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <FormControlLabel
                    value={party.id}
                    control={<Radio />}
                    label={
                      <Typography variant="h6" component="span">
                        {party.name}
                      </Typography>
                    }
                  />
                </RadioGroup>
                <Typography variant="body2" color="text.secondary">
                  Candidate: {party.candidate_name || 'Not Available'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleVote}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Submitting...' : 'Submit Vote'}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={logout}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Vote;