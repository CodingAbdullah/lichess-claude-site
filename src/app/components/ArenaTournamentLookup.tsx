'use client';

import { useState } from 'react';

interface ArenaTournament {
  id: string;
  fullName: string;
  perf: { icon: string; name: string };
  clock: { limit: number; increment: number };
  minutes: number;
  createdBy: string;
  system: string;
  secondsToStart?: number;
  secondsToFinish?: number;
  isStarted: boolean;
  isFinished: boolean;
  isPaused: boolean;
  variant: { key: string; short: string; name: string };
  rated: boolean;
  hasChat: boolean;
  description?: string;
  position?: { eco: string; name: string; wikiPath: string; fen: string };
  startsAt?: string;
  finishesAt?: string;
  status: number;
  perf_name?: string;
  nbPlayers: number;
  duels: Array<{
    id: string;
    p: [
      { n: string; r: number; k?: number },
      { n: string; r: number; k?: number }
    ];
  }>;
  standing?: {
    page: number;
    players: Array<{
      name: string;
      title?: string;
      patron?: boolean;
      rank: number;
      rating: number;
      score: number;
      sheet: {
        scores: string;
        total: number;
        fire: boolean;
      };
    }>;
  };
  featured?: {
    id: string;
    fen: string;
    color: string;
    lastMove: string;
    white: { name: string; title?: string; rating: number };
    black: { name: string; title?: string; rating: number };
  };
  podium?: Array<{
    name: string;
    title?: string;
    patron?: boolean;
    rank: number;
    rating: number;
    score: number;
    nb: { game: number; berserk: number; win: number };
    performance: number;
  }>;
  pairings?: Array<{
    id: string;
    status: number;
    user1: string;
    user2: string;
    winner?: string;
    turn?: string;
  }>;
  stats: {
    games: number;
    moves: number;
    whiteWins: number;
    blackWins: number;
    draws: number;
    berserks: number;
    averageRating: number;
  };
}

export default function ArenaTournamentLookup() {
  const [tournamentId, setTournamentId] = useState('');
  const [tournament, setTournament] = useState<ArenaTournament | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTournament = async (id: string) => {
    if (!id.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/lichess/tournament/${id}`);
      
      if (!response.ok) {
        throw new Error('Tournament not found');
      }

      const data = await response.json();
      setTournament(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournament');
      setTournament(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTournament(tournamentId);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusText = (tournament: ArenaTournament) => {
    if (tournament.isFinished) return 'Finished';
    if (tournament.isStarted && tournament.isPaused) return 'Paused';
    if (tournament.isStarted) return 'In Progress';
    return 'Not Started';
  };

  const getStatusColor = (tournament: ArenaTournament) => {
    if (tournament.isFinished) return 'text-amber-300';
    if (tournament.isStarted && tournament.isPaused) return 'text-yellow-400';
    if (tournament.isStarted) return 'text-green-400';
    return 'text-blue-400';
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl mr-2">🔍</span>
          <h3 className="text-2xl font-bold">Arena Tournament Lookup</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-800 disabled:to-amber-900 px-4 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-amber-500 flex items-center justify-center"
          >
            <span className="text-xl mr-2">
              {loading ? '⏳' : '🎯'}
            </span>
            {loading ? 'Searching...' : 'Search Tournament'}
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

      {tournament && (
        <div className="space-y-6">
          {/* Tournament Header */}
          <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl mr-3">🏆</span>
                <h2 className="text-3xl font-bold text-amber-100">{tournament.fullName}</h2>
                <span className="text-4xl ml-3">🏆</span>
              </div>
              
              <div className="flex items-center justify-center space-x-6 text-amber-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">⚔️</span>
                  <span className="font-semibold">{tournament.variant.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">⏱️</span>
                  <span className="font-semibold">{tournament.clock.limit / 60}+{tournament.clock.increment}</span>
                </div>
                <div className={`flex items-center ${getStatusColor(tournament)}`}>
                  <span className="text-2xl mr-2">📊</span>
                  <span className="font-semibold">{getStatusText(tournament)}</span>
                </div>
              </div>

              {tournament.description && (
                <p className="text-amber-200 mt-4 italic bg-amber-700/30 rounded-lg p-3 border border-amber-600/50">
                  "{tournament.description}"
                </p>
              )}
            </div>

            {/* Tournament Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-3xl font-bold text-amber-100">{tournament.nbPlayers}</div>
                <div className="text-amber-300 font-semibold">Players</div>
              </div>
              <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="text-3xl mb-2">🎮</div>
                <div className="text-3xl font-bold text-amber-100">{tournament.stats.games}</div>
                <div className="text-amber-300 font-semibold">Games</div>
              </div>
              <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="text-3xl mb-2">⏰</div>
                <div className="text-3xl font-bold text-amber-100">{tournament.minutes}</div>
                <div className="text-amber-300 font-semibold">Minutes</div>
              </div>
              <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="text-3xl mb-2">📈</div>
                <div className="text-3xl font-bold text-amber-100">{Math.round(tournament.stats.averageRating)}</div>
                <div className="text-amber-300 font-semibold">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Podium */}
          {tournament.podium && tournament.podium.length > 0 && (
            <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
              <div className="flex items-center justify-center mb-6">
                <span className="text-3xl mr-2">🥇</span>
                <h3 className="text-2xl font-bold">Podium</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tournament.podium.slice(0, 3).map((player, index) => (
                  <div key={player.name} className={`text-center rounded-lg p-6 border ${
                    index === 0 ? 'bg-yellow-600/20 border-yellow-500' :
                    index === 1 ? 'bg-gray-600/20 border-gray-400' :
                    'bg-amber-600/20 border-amber-500'
                  }`}>
                    <div className="text-6xl mb-3">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="text-xl font-bold text-amber-100 mb-2">
                      {player.title && <span className="text-purple-300">{player.title} </span>}
                      {player.name}
                      {player.patron && <span className="text-yellow-400"> ♔</span>}
                    </div>
                    <div className="text-2xl font-bold text-green-400 mb-2">{player.score} pts</div>
                    <div className="text-amber-300">Rating: {player.rating}</div>
                    <div className="text-amber-300">Performance: {player.performance}</div>
                    <div className="text-sm text-amber-400 mt-2">
                      {player.nb.game} games • {player.nb.win} wins • {player.nb.berserk} berserks
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Players Standings */}
          {tournament.standing && (
            <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
              <div className="flex items-center justify-center mb-6">
                <span className="text-3xl mr-2">📊</span>
                <h3 className="text-2xl font-bold">Standings</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-amber-600/50">
                      <th className="text-left py-3 px-4 font-semibold text-amber-200">Rank</th>
                      <th className="text-left py-3 px-4 font-semibold text-amber-200">Player</th>
                      <th className="text-right py-3 px-4 font-semibold text-amber-200">Rating</th>
                      <th className="text-right py-3 px-4 font-semibold text-amber-200">Score</th>
                      <th className="text-right py-3 px-4 font-semibold text-amber-200">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tournament.standing.players.slice(0, 10).map((player) => (
                      <tr key={player.name} className="border-b border-amber-700/30 hover:bg-amber-700/20">
                        <td className="py-2 px-4 text-amber-100 font-bold">#{player.rank}</td>
                        <td className="py-2 px-4">
                          <div className="flex items-center">
                            {player.title && <span className="text-purple-300 text-xs mr-1">{player.title}</span>}
                            <span className="text-amber-100 font-medium">{player.name}</span>
                            {player.patron && <span className="text-yellow-400 ml-1">♔</span>}
                          </div>
                        </td>
                        <td className="py-2 px-4 text-right text-amber-200">{player.rating}</td>
                        <td className="py-2 px-4 text-right text-green-400 font-bold">{player.score}</td>
                        <td className="py-2 px-4 text-right text-amber-300">{player.sheet.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tournament Statistics */}
          <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
            <div className="flex items-center justify-center mb-6">
              <span className="text-3xl mr-2">📈</span>
              <h3 className="text-2xl font-bold">Statistics</h3>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-amber-100">{tournament.stats.moves.toLocaleString()}</div>
                <div className="text-amber-300 font-semibold text-sm">Moves</div>
              </div>
              <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="text-2xl mb-2">⚪</div>
                <div className="text-2xl font-bold text-amber-100">{tournament.stats.whiteWins}</div>
                <div className="text-amber-300 font-semibold text-sm">White Wins</div>
              </div>
              <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="text-2xl mb-2">⚫</div>
                <div className="text-2xl font-bold text-amber-100">{tournament.stats.blackWins}</div>
                <div className="text-amber-300 font-semibold text-sm">Black Wins</div>
              </div>
              <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="text-2xl mb-2">🤝</div>
                <div className="text-2xl font-bold text-amber-100">{tournament.stats.draws}</div>
                <div className="text-amber-300 font-semibold text-sm">Draws</div>
              </div>
              <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="text-2xl mb-2">💥</div>
                <div className="text-2xl font-bold text-amber-100">{tournament.stats.berserks}</div>
                <div className="text-amber-300 font-semibold text-sm">Berserks</div>
              </div>
              <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="text-2xl mb-2">👑</div>
                <div className="text-2xl font-bold text-amber-100">{tournament.rated ? 'Yes' : 'No'}</div>
                <div className="text-amber-300 font-semibold text-sm">Rated</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}