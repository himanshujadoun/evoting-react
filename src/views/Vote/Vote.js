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
import './vote.css';

const Vote = () => {
  const dispatch = useDispatch();
  const { parties, loading, error, message } = useSelector((state) => state.vote);
  const [selectedParty, setSelectedParty] = useState(null);
  const [voteError, setVoteError] = useState('');

  useEffect(() => {
    dispatch(fetchParties());
  }, [dispatch]);

  const handleVote = async () => {
    const userId = sessionStorage.getItem('userId');

    if (!userId || !selectedParty) {
      setVoteError('Please select a party and ensure you are logged in.');
      return;
    }

    try {
      const response = await dispatch(submitVote({ userId, partyId: selectedParty })).unwrap();

      if (response.message === "You have already voted!") {
        setVoteError(response.message);
      } else {
        setVoteError('');
      }
    } catch (error) {
      const status = error?.response?.status;
      const errorMsg = error?.response?.data?.message || "You have already voted!";

      if (status === 9999 || status === 400) {
        setVoteError(errorMsg);
      } else {
        setVoteError("Something went wrong. Please try again later.");
      }
    }
  };

  const logout = () => {
    sessionStorage.removeItem('userId');
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

      {error && <Alert severity="error" sx={{ my: 2, fontSize: '1.5rem' }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ my: 2, fontSize: '1.5rem' }}>{message}</Alert>}
      {voteError && <Alert severity="error" sx={{ my: 2, fontSize: '1.5rem' }}>{voteError}</Alert>}

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
                    label={<Typography variant="h6" sx={{ fontSize: '1.8rem' }}>{party.name}</Typography>}
                  />
                </RadioGroup>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.3rem' }}>
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
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Submitting...' : 'Submit Vote'}
        </Button>
        <Button variant="contained" color="error" onClick={logout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Vote;