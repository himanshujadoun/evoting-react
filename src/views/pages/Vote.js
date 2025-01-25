import React, { useState, useEffect } from 'react';
import { HTTP_GET, HTTP_POST } from '../../https';

const Vote = () => {
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const url = 'http://localhost:5000/getParties';
        const response = await HTTP_GET(url);
        setParties(response.data);
      } catch (error) {
        setMessage('Error fetching parties: ' + error.message);
      }
    };

    fetchParties();
  }, []);

  const handleVote = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const url = 'http://localhost:5000/vote';
      const response = await HTTP_POST(url, { userId, partyId: selectedParty });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error submitting vote: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1>Vote</h1>
      <div>
        {parties.map((party) => (
          <div key={party.id}>
            <h2>{party.name}</h2>
            <p>{party.candidate_name}</p>
            <img src={`data:image/jpeg;base64,${party.image}`} alt={party.name} />
            <button onClick={() => setSelectedParty(party.id)}>Vote for {party.name}</button>
          </div>
        ))}
      </div>
      <button onClick={handleVote}>Submit Vote</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Vote;
