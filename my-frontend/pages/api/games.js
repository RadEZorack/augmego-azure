// pages/api/games.js

export default function handler(req, res) {
    const games = [
        { id: 1, name: 'Game 1' },
        { id: 2, name: 'Game 2' },
    ];
    res.status(200).json(games);
}
