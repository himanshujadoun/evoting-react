import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParties, submitVote } from './voteController'; // Import actions
import './vote.css';

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
          setVoteError("You have already cast your vote!"); // Display vote error message in red text
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
    <div className="container">
      <h1>Cast Your Vote</h1>
      {loading && <p>Loading parties...</p>}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      {voteError && <p className="vote-error">{voteError}</p>} {/* Display vote error message */}
      <div id="partyList">
        {parties.map((party) => (
          <div key={party.id} className="party-card">
            <input 
              type="radio" 
              name="party" 
              value={party.id} 
              id={`party${party.id}`} 
              onChange={() => setSelectedParty(party.id)}
            />
            <label htmlFor={`party${party.id}`}>
              <h2>{party.name}</h2>
              <p>Candidate: {party.candidate_name || 'Not Available'}</p>
              <img src={`data:image/jpeg;base64,${party.image}`} alt={party.name} width="200" />
            </label>
          </div>
        ))}
      </div>
      <button onClick={handleVote} disabled={loading}>Submit Vote</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Vote;
