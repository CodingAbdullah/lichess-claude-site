'use client';

import { useState } from 'react';

interface Player {
  user: {
    name: string;
    flair?: string;
    id: string;
  };
  score: number;
}

interface Team {
  id: string;
  score: number;
  players: Player[];
}

export default function TournamentTeamStandings() {
  const [tournamentId, setTournamentId] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTeamStandings = async () => {
    if (!tournamentId.trim()) {
      setError('Please enter a tournament ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/lichess/tournament/${encodeURIComponent(tournamentId.trim())}/teams`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Tournament not found. Please check the tournament ID.');
        }
        throw new Error('Failed to fetch tournament team standings');
      }

      const data = await response.json();
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournament team standings');
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeamStandings();
  };

  const formatScore = (score: number) => {
    return score.toLocaleString();
  };

  const getRankPosition = (index: number) => {
    const position = index + 1;
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `#${position}`;
  };

  const getRankColor = (index: number) => {
    if (index === 0) return 'from-yellow-600 to-yellow-700 border-yellow-500';
    if (index === 1) return 'from-gray-400 to-gray-500 border-gray-400';
    if (index === 2) return 'from-orange-600 to-orange-700 border-orange-500';
    return 'from-amber-700 to-amber-800 border-amber-600';
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl mr-2">🏅</span>
          <h3 className="text-2xl font-bold">Tournament Team Battle Standings</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="tournamentId" className="block text-sm font-semibold mb-2 text-amber-200">
              Tournament ID *
            </label>
            <input
              type="text"
              id="tournamentId"
              value={tournamentId}
              onChange={(e) => setTournamentId(e.target.value)}
              className="w-full px-4 py-3 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50 font-medium"
              placeholder="Enter tournament ID (e.g., wBKCIBvG)..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-800 disabled:to-amber-900 px-4 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-amber-500 flex items-center justify-center"
          >
            <span className="text-xl mr-2">
              {loading ? '⏳' : '🏅'}
            </span>
            {loading ? 'Loading Standings...' : 'Get Team Battle Standings'}
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

      {teams.length > 0 && (
        <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-3xl mr-2">🏅</span>
              <h3 className="text-2xl font-bold">Team Battle Standings</h3>
              <span className="ml-4 bg-amber-600/40 px-3 py-1 rounded-full text-sm font-semibold">
                {teams.length} teams
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {teams.map((team, index) => (
              <div key={team.id} className={`bg-gradient-to-r ${getRankColor(index)} rounded-lg p-5 border-2 shadow-lg`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold">
                          {getRankPosition(index)}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-1">Team {team.id}</h4>
                          <div className="text-white/80 text-lg font-semibold">
                            Total Score: <span className="text-white">{formatScore(team.score)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-lg p-4">
                      <h5 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="mr-2">👥</span>
                        Team Players ({team.players.length})
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {team.players.map((player, playerIndex) => (
                          <div key={player.user.id} className="bg-white/10 rounded p-3 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-white/60 text-sm font-medium">
                                #{playerIndex + 1}
                              </span>
                              <div>
                                <div className="text-white font-semibold flex items-center gap-1">
                                  {player.user.name}
                                  {player.user.flair && <span>🏅</span>}
                                </div>
                                <div className="text-white/60 text-sm">@{player.user.id}</div>
                              </div>
                            </div>
                            <div className="text-white font-bold">
                              {formatScore(player.score)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="text-white/80 font-semibold mb-2 text-sm">Team Stats</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Total Players:</span>
                          <span className="text-white font-semibold">{team.players.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Average Score:</span>
                          <span className="text-white font-semibold">
                            {team.players.length > 0 ? formatScore(Math.round(team.score / team.players.length)) : 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Top Player:</span>
                          <span className="text-white font-semibold">
                            {team.players.length > 0 
                              ? team.players.reduce((prev, current) => 
                                  prev.score > current.score ? prev : current
                                ).user.name 
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://lichess.org/team/${team.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-white/20 hover:bg-white/30 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-center"
                    >
                      View Team Profile
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {teams.length === 0 && !loading && !error && tournamentId && (
        <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600 text-center">
          <span className="text-4xl mb-4 block">🏅</span>
          <p className="text-amber-300 text-lg mb-2">No team standings found</p>
          <p className="text-amber-400">This tournament may not be a team battle or has no teams</p>
        </div>
      )}
    </div>
  );
}