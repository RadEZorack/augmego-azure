// pages/index.js

import React, { useEffect, useState } from 'react';
import api from '../lib/api';

const HomePage = () => {
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await api.get('/games');
                setGames(response.data);
            } catch (error) {
                console.error('Error fetching games:', error);
            }
        };

        fetchGames();
    }, []);

    return (
        <div>
            <h1>Welcome to Augmego</h1>
            <p>This is the front page of the game.</p>
            <a href="/game">Enter the Game</a>
            <h2>Recent Games</h2>
            <ul>
                {games.map(game => (
                    <li key={game.id}>{game.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
