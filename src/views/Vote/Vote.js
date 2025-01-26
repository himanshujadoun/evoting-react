import React, { useState, useEffect } from 'react';
import { HTTP_GET, HTTP_POST } from '../../https';
import './vote.css';

const Vote = () => {
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/getParties`; // Use environment variable for API base URL
        const response = await HTTP_GET(url);
        setParties(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching parties: ' + error.message);
        setLoading(false);
      }
    };

    fetchParties();
  }, []);

  const handleVote = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const url = `${process.env.REACT_APP_API_BASE_URL}/vote`; // Use environment variable for API base URL
      const response = await HTTP_POST(url, { userId, partyId: selectedParty });
      setMessage(response.data.message);
    } catch (error) {
      setError('Error submitting vote: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1>Vote</h1>
      {loading && <p>Loading parties...</p>}
      {error && <p className="error-message">{error}</p>}
      <div>
        {parties.map((party) => (
          <div key={party.id} className="party-card">
            <h2>{party.name}</h2>
            <p>{party.candidate_name}</p>
            <img src={`data:image/jpeg;base64,${party.image}`} alt={party.name} />
            <button
              onClick={() => setSelectedParty(party.id)}
              disabled={selectedParty === party.id}
            >
              {selectedParty === party.id ? 'Selected' : `Vote for ${party.name}`}
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleVote} disabled={!selectedParty || loading}>
        Submit Vote
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Vote;
