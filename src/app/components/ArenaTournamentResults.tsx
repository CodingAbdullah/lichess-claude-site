'use client';

import { useState } from 'react';

interface TournamentResult {
  rank: number;
  score: number;
  rating: number;
  username: string;
  title?: string;
  flair?: string;
  performance: number;
  sheet?: {
    scores: string;
  };
}

export default function ArenaTournamentResults() {
  const [tournamentId, setTournamentId] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('50');
  const [includeSheet, setIncludeSheet] = useState(true);
  const [results, setResults] = useState<TournamentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchResults = async (id: string, nb: string, sheet: boolean) => {
    if (!id.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (nb) params.append('nb', nb);
      params.append('sheet', sheet.toString());

      const response = await fetch(`/api/lichess/tournament/${id}/results?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Tournament results not found');
      }

      const data = await response.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournament results');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(tournamentId, maxPlayers, includeSheet);
  };

  const getPerformanceColor = (performance: number, rating: number) => {
    const diff = performance - rating;
    if (diff >= 200) return 'text-purple-400';
    if (diff >= 100) return 'text-green-400';
    if (diff >= 50) return 'text-yellow-400';
    if (diff >= 0) return 'text-amber-300';
    if (diff >= -50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '🏆';
    if (rank <= 20) return '🎖️';
    return '📍';
  };

  const parseScoreSheet = (scores?: string) => {
    if (!scores) return { wins: 0, draws: 0, losses: 0, berserks: 0 };
    
    let wins = 0, draws = 0, losses = 0, berserks = 0;
    
    for (let i = 0; i < scores.length; i++) {
      const char = scores[i];
      if (char === '2') wins++;
      else if (char === '1') draws++;
      else if (char === '0') losses++;
      else if (char === '3' || char === '4' || char === '5') {
        wins++;
        berserks++;
      }
    }
    
    return { wins, draws, losses, berserks };
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Search Form */}
      <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl mr-2">📊</span>
          <h3 className="text-2xl font-bold">Arena Tournament Results</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tournamentId" className="block text-sm font-semibold mb-2 text-amber-200">
                Tournament ID
              </label>
              <input
                type="text"
                id="tournamentId"
                value={tournamentId}
                onChange={(e) => setTournamentId(e.target.value)}
                className="w-full px-4 py-3 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50 font-medium"
                placeholder="Enter tournament ID..."
                required
              />
            </div>
            
            <div>
              <label htmlFor="maxPlayers" className="block text-sm font-semibold mb-2 text-amber-200">
                Max Players to Show
              </label>
              <select
                id="maxPlayers"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                className="w-full px-4 py-3 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 text-amber-50 font-medium"
              >
                <option value="10">Top 10</option>
                <option value="25">Top 25</option>
                <option value="50">Top 50</option>
                <option value="100">Top 100</option>
                <option value="">All Players</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <label className="flex items-center text-amber-200">
              <input
                type="checkbox"
                checked={includeSheet}
                onChange={(e) => setIncludeSheet(e.target.checked)}
                className="mr-2 rounded focus:ring-amber-400"
              />
              <span className="text-sm font-medium">Include detailed score sheets (slower loading)</span>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-800 disabled:to-amber-900 px-4 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-amber-500 flex items-center justify-center"
          >
            <span className="text-xl mr-2">
              {loading ? '⏳' : '🎯'}
            </span>
            {loading ? 'Loading Results...' : 'Get Tournament Results'}
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-gradient-to-br from-red-800 to-red-900 border-4 border-red-600 rounded-2xl p-4 text-center shadow-2xl">
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl mr-2">⚠️</span>
            <p className="text-red-200 font-semibold">{error}</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
          <div className="flex items-center justify-center mb-6">
            <span className="text-3xl mr-2">🏆</span>
            <h3 className="text-2xl font-bold">Tournament Leaderboard</h3>
            <span className="ml-4 bg-amber-600/40 px-3 py-1 rounded-full text-sm font-semibold">
              {results.length} players
            </span>
          </div>
          
          {/* Top 3 Podium */}
          {results.length >= 3 && (
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <span className="text-2xl mr-2">🥇</span>
                <h4 className="text-xl font-bold">Top 3 Finishers</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.slice(0, 3).map((player, index) => {
                  const stats = parseScoreSheet(player.sheet?.scores);
                  return (
                    <div key={player.username} className={`text-center rounded-lg p-6 border ${
                      index === 0 ? 'bg-yellow-600/20 border-yellow-500' :
                      index === 1 ? 'bg-gray-600/20 border-gray-400' :
                      'bg-amber-600/20 border-amber-500'
                    }`}>
                      <div className="text-6xl mb-3">{getRankMedal(player.rank)}</div>
                      <div className="text-xl font-bold text-amber-100 mb-2">
                        {player.title && <span className="text-purple-300">{player.title} </span>}
                        {player.username}
                      </div>
                      <div className="text-2xl font-bold text-green-400 mb-2">{player.score} pts</div>
                      <div className="text-amber-300 mb-2">Rating: {player.rating}</div>
                      <div className={`text-lg font-semibold mb-3 ${getPerformanceColor(player.performance, player.rating)}`}>
                        Performance: {player.performance}
                      </div>
                      {includeSheet && player.sheet && (
                        <div className="text-sm text-amber-400 space-y-1">
                          <div>🏆 {stats.wins} wins • 🤝 {stats.draws} draws • 💔 {stats.losses} losses</div>
                          {stats.berserks > 0 && <div>💥 {stats.berserks} berserks</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Full Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-600/50">
                  <th className="text-left py-3 px-4 font-semibold text-amber-200">Rank</th>
                  <th className="text-left py-3 px-4 font-semibold text-amber-200">Player</th>
                  <th className="text-right py-3 px-4 font-semibold text-amber-200">Score</th>
                  <th className="text-right py-3 px-4 font-semibold text-amber-200">Rating</th>
                  <th className="text-right py-3 px-4 font-semibold text-amber-200">Performance</th>
                  {includeSheet && <th className="text-center py-3 px-4 font-semibold text-amber-200">Games</th>}
                </tr>
              </thead>
              <tbody>
                {results.map((player) => {
                  const stats = parseScoreSheet(player.sheet?.scores);
                  return (
                    <tr key={player.username} className="border-b border-amber-700/30 hover:bg-amber-700/20">
                      <td className="py-3 px-4 text-amber-100 font-bold">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getRankMedal(player.rank)}</span>
                          #{player.rank}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {player.title && <span className="text-purple-300 text-xs mr-1">{player.title}</span>}
                          <span className="text-amber-100 font-medium">{player.username}</span>
                          {player.flair && (
                            <span className="ml-2 text-xs text-amber-400">✨ {player.flair}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-green-400 font-bold">{player.score}</td>
                      <td className="py-3 px-4 text-right text-amber-200">{player.rating}</td>
                      <td className={`py-3 px-4 text-right font-bold ${getPerformanceColor(player.performance, player.rating)}`}>
                        {player.performance}
                        <div className="text-xs text-amber-400">
                          {player.performance > player.rating ? '+' : ''}{player.performance - player.rating}
                        </div>
                      </td>
                      {includeSheet && (
                        <td className="py-3 px-4 text-center">
                          <div className="text-xs text-amber-300 space-y-1">
                            <div>🏆{stats.wins} 🤝{stats.draws} 💔{stats.losses}</div>
                            {stats.berserks > 0 && <div>💥{stats.berserks}</div>}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Summary Statistics */}
          {results.length > 0 && (
            <div className="mt-6 pt-6 border-t border-amber-600/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="text-2xl font-bold text-amber-100">
                    {Math.max(...results.map(r => r.score))}
                  </div>
                  <div className="text-amber-300 font-semibold text-sm">Highest Score</div>
                </div>
                <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                  <div className="text-2xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-amber-100">
                    {Math.round(results.reduce((sum, r) => sum + r.rating, 0) / results.length)}
                  </div>
                  <div className="text-amber-300 font-semibold text-sm">Avg Rating</div>
                </div>
                <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="text-2xl font-bold text-amber-100">
                    {Math.round(results.reduce((sum, r) => sum + r.performance, 0) / results.length)}
                  </div>
                  <div className="text-amber-300 font-semibold text-sm">Avg Performance</div>
                </div>
                <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                  <div className="text-2xl mb-2">👑</div>
                  <div className="text-2xl font-bold text-amber-100">
                    {results.filter(r => r.title).length}
                  </div>
                  <div className="text-amber-300 font-semibold text-sm">Titled Players</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}