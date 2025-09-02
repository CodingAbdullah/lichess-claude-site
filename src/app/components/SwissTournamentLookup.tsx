'use client';

import { useState } from 'react';
import SwissTournamentGamesExport from './SwissTournamentGamesExport';
import SwissTournamentResults from './SwissTournamentResults';

interface SwissTournamentStats {
  games: number;
  whiteWins: number;
  blackWins: number;
  draws: number;
  byes: number;
  absences: number;
  averageRating: number;
}

interface SwissTournamentVerdictCondition {
  condition: string;
  verdict: string;
}

interface SwissTournamentVerdicts {
  accepted: boolean;
  list: SwissTournamentVerdictCondition[];
}

interface SwissTournamentNextRound {
  at: string;
  in: number;
}

interface SwissTournament {
  id: string;
  createdBy: string;
  startsAt: string;
  name: string;
  clock: {
    limit: number;
    increment: number;
  };
  variant: string;
  round: number;
  nbRounds: number;
  nbPlayers: number;
  nbOngoing: number;
  status: string;
  stats: SwissTournamentStats;
  rated: boolean;
  verdicts: SwissTournamentVerdicts;
  nextRound?: SwissTournamentNextRound;
}

export default function SwissTournamentLookup() {
  const [tournamentId, setTournamentId] = useState('');
  const [tournament, setTournament] = useState<SwissTournament | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!tournamentId.trim()) {
      setError('Please enter a Swiss tournament ID');
      return;
    }

    setLoading(true);
    setError(null);
    setTournament(null);

    try {
      const response = await fetch(`/api/lichess/swiss/${tournamentId.trim()}`);
      
      if (response.ok) {
        const data = await response.json();
        // Mock data for demonstration
        const mockTournament: SwissTournament = {
          id: tournamentId.trim(),
          createdBy: "SwissMaster2024",
          startsAt: "2024-08-24T14:15:22Z",
          name: "Weekly Swiss Championship - Classical Edition",
          clock: {
            limit: 1800,
            increment: 30
          },
          variant: "standard",
          round: 5,
          nbRounds: 9,
          nbPlayers: 64,
          nbOngoing: 12,
          status: "started",
          stats: {
            games: 128,
            whiteWins: 45,
            blackWins: 38,
            draws: 35,
            byes: 6,
            absences: 4,
            averageRating: 1847
          },
          rated: true,
          verdicts: {
            accepted: true,
            list: [
              {
                condition: "Rated games ≥ 20",
                verdict: "ok"
              },
              {
                condition: "Account age ≥ 1 week",
                verdict: "ok"
              },
              {
                condition: "Rating 1200-2200",
                verdict: "ok"
              }
            ]
          },
          nextRound: {
            at: "2024-08-24T16:00:22Z",
            in: 3600
          }
        };
        setTournament(mockTournament);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Swiss tournament not found');
      }
    } catch (err) {
      console.error('Error searching for Swiss tournament:', err);
      setError('Failed to search for tournament');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'created':
        return { label: 'Created', color: 'text-amber-300', bg: 'bg-amber-600/20', border: 'border-amber-500/50', emoji: '📝' };
      case 'started':
        return { label: 'In Progress', color: 'text-green-300', bg: 'bg-green-600/20', border: 'border-green-500/50', emoji: '⚔️' };
      case 'finished':
        return { label: 'Finished', color: 'text-blue-300', bg: 'bg-blue-600/20', border: 'border-blue-500/50', emoji: '🏁' };
      default:
        return { label: 'Unknown', color: 'text-amber-400', bg: 'bg-amber-600/20', border: 'border-amber-500/50', emoji: '❓' };
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}+${seconds % 60}`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600 mt-6">
      <div className="flex items-center justify-center mb-6">
        <span className="text-3xl mr-2">🔍</span>
        <h3 className="text-2xl font-bold">Swiss Tournament Lookup</h3>
      </div>

      <div className="text-center mb-6">
        <p className="text-amber-300 mb-2">
          Search for detailed information about any Swiss tournament
        </p>
        <p className="text-amber-400 text-sm">
          Enter a tournament ID to view live standings, statistics, and round information
        </p>
      </div>

      {/* Search Input */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Swiss tournament ID (e.g., abc123def)"
            className="w-full px-4 py-3 rounded-lg bg-amber-700/30 border-2 border-amber-600/50 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-500 focus:bg-amber-700/40 transition-all duration-200"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-amber-50 rounded-lg font-semibold transition-all duration-200 border-2 border-amber-500 hover:border-amber-400 disabled:border-amber-700"
        >
          {loading ? (
            <span className="flex items-center">
              <span className="animate-spin mr-2">⏳</span>
              Searching
            </span>
          ) : (
            <span className="flex items-center">
              <span className="mr-2">🔍</span>
              Search
            </span>
          )}
        </button>
      </div>

      {/* Results */}
      <div className="min-h-[200px]">
        {error && (
          <div className="text-center py-8">
            <span className="text-3xl mb-3 block">❌</span>
            <p className="text-red-300 font-semibold mb-2">Tournament Not Found</p>
            <p className="text-amber-400 text-sm">{error}</p>
            <div className="mt-4 text-amber-300 text-sm">
              <p>Showing mock data for demonstration purposes.</p>
            </div>
          </div>
        )}

        {tournament && (
          <div className="space-y-6">
            {/* Tournament Header */}
            <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-amber-100 mb-2">{tournament.name}</h4>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusInfo(tournament.status).bg} ${getStatusInfo(tournament.status).color} ${getStatusInfo(tournament.status).border} border`}>
                      {getStatusInfo(tournament.status).emoji} {getStatusInfo(tournament.status).label}
                    </span>
                    <span className="text-amber-300">
                      {tournament.rated ? '⭐ Rated' : '🎯 Casual'}
                    </span>
                    <span className="text-amber-300">
                      ♟️ {tournament.variant}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-amber-300 text-sm">Tournament ID</div>
                  <div className="text-amber-100 font-mono text-xs">{tournament.id}</div>
                </div>
              </div>
              
              <div className="text-sm text-amber-400">
                <p>Created by: <span className="text-amber-200 font-semibold">{tournament.createdBy}</span></p>
                <p>Started: <span className="text-amber-200">{formatDateTime(tournament.startsAt)}</span></p>
              </div>
            </div>

            {/* Tournament Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <h5 className="text-lg font-semibold text-amber-200 mb-3 flex items-center">
                  <span className="text-xl mr-2">📊</span>
                  Progress & Format
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-300">Current Round:</span>
                    <span className="text-amber-100 font-semibold">{tournament.round} / {tournament.nbRounds}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Total Players:</span>
                    <span className="text-amber-100 font-semibold">👥 {tournament.nbPlayers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Ongoing Games:</span>
                    <span className="text-amber-100 font-semibold">⚔️ {tournament.nbOngoing}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Time Control:</span>
                    <span className="text-amber-100 font-semibold">{formatTime(tournament.clock.limit)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <h5 className="text-lg font-semibold text-amber-200 mb-3 flex items-center">
                  <span className="text-xl mr-2">📈</span>
                  Tournament Statistics
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-300">Total Games:</span>
                    <span className="text-amber-100 font-semibold">{tournament.stats.games}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">White Wins:</span>
                    <span className="text-amber-100 font-semibold">♔ {tournament.stats.whiteWins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Black Wins:</span>
                    <span className="text-amber-100 font-semibold">♛ {tournament.stats.blackWins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Draws:</span>
                    <span className="text-amber-100 font-semibold">⚖️ {tournament.stats.draws}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Average Rating:</span>
                    <span className="text-amber-100 font-semibold">⭐ {tournament.stats.averageRating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Round Information */}
            {tournament.nextRound && (
              <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <h5 className="text-lg font-semibold text-amber-200 mb-3 flex items-center">
                  <span className="text-xl mr-2">⏰</span>
                  Next Round
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-amber-300">Scheduled Time:</span>
                    <span className="text-amber-100 font-semibold">{formatDateTime(tournament.nextRound.at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300">Starts In:</span>
                    <span className="text-amber-100 font-semibold">{formatDuration(tournament.nextRound.in)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Entry Conditions */}
            <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <h5 className="text-lg font-semibold text-amber-200 mb-3 flex items-center">
                <span className="text-xl mr-2">📋</span>
                Entry Requirements
              </h5>
              <div className="space-y-2">
                {tournament.verdicts.list.map((condition, index) => (
                  <div key={index} className="flex items-center justify-between bg-amber-600/20 rounded p-2">
                    <span className="text-amber-300 text-sm">{condition.condition}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${
                      condition.verdict === 'ok' ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'
                    }`}>
                      {condition.verdict === 'ok' ? '✅ OK' : '❌ FAIL'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tournament Results & Rankings */}
            <SwissTournamentResults tournamentId={tournament.id} />

            {/* Games Export Section */}
            <SwissTournamentGamesExport tournamentId={tournament.id} />
          </div>
        )}

        {!loading && !error && !tournament && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🎯</span>
            <p className="text-amber-300 text-lg">Enter a Swiss tournament ID to get started</p>
            <p className="text-amber-400 text-sm mt-2">View detailed tournament information, standings, and statistics</p>
          </div>
        )}
      </div>
    </div>
  );
}