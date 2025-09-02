'use client';

import { useState } from 'react';

interface Clock {
  limit: number;
  increment: number;
}

interface Variant {
  key: string;
  short: string;
  name: string;
}

interface Perf {
  key: string;
  name: string;
  position: number;
  icon: string;
}

interface Winner {
  name: string;
  flair?: string;
  id: string;
}

interface Tournament {
  id: string;
  createdBy: string;
  system: string;
  minutes: number;
  clock: Clock;
  rated: boolean;
  fullName: string;
  nbPlayers: number;
  variant: Variant;
  startsAt: number;
  finishesAt: number;
  status: number;
  perf: Perf;
  teamMember: string;
  winner?: Winner;
}

interface FilterOptions {
  max: string;
  status: string;
  createdBy: string;
  name: string;
}

export default function TeamArenaTournaments() {
  const [teamId, setTeamId] = useState('');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    max: '50',
    status: '',
    createdBy: '',
    name: ''
  });

  const fetchTournaments = async () => {
    if (!teamId.trim()) {
      setError('Please enter a team ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (filters.max) params.append('max', filters.max);
      if (filters.status) params.append('status', filters.status);
      if (filters.createdBy) params.append('createdBy', filters.createdBy);
      if (filters.name) params.append('name', filters.name);

      const response = await fetch(`/api/lichess/team/${encodeURIComponent(teamId.trim())}/arena?${params.toString()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Team not found. Please check the team ID.');
        }
        throw new Error('Failed to fetch team arena tournaments');
      }

      const data = await response.json();
      setTournaments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team arena tournaments');
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTournaments();
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      max: '50',
      status: '',
      createdBy: '',
      name: ''
    });
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 10: return 'Created';
      case 20: return 'Started';
      case 30: return 'Finished';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 10: return 'text-blue-400';
      case 20: return 'text-green-400';
      case 30: return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const formatTimeControl = (clock: Clock) => {
    const minutes = Math.floor(clock.limit / 60);
    return `${minutes}+${clock.increment}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Search Form */}
      <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl mr-2">🏆</span>
          <h3 className="text-2xl font-bold">Team Arena Tournaments</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team ID */}
          <div>
            <label htmlFor="teamId" className="block text-sm font-semibold mb-2 text-amber-200">
              Team ID *
            </label>
            <input
              type="text"
              id="teamId"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full px-4 py-3 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50 font-medium"
              placeholder="Enter team ID (e.g., lichess-swiss, coders)..."
              required
            />
          </div>

          {/* Filters */}
          <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-amber-200">Filter Options</h4>
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-1 bg-amber-600/40 hover:bg-amber-600/60 rounded text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="max" className="block text-sm font-semibold mb-2 text-amber-200">
                  Max Results
                </label>
                <select
                  id="max"
                  value={filters.max}
                  onChange={(e) => handleFilterChange('max', e.target.value)}
                  className="w-full px-3 py-2 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 text-amber-50"
                >
                  <option value="10">10 tournaments</option>
                  <option value="25">25 tournaments</option>
                  <option value="50">50 tournaments</option>
                  <option value="100">100 tournaments</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-semibold mb-2 text-amber-200">
                  Tournament Status
                </label>
                <select
                  id="status"
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 text-amber-50"
                >
                  <option value="">All Statuses</option>
                  <option value="created">Created</option>
                  <option value="started">Started</option>
                  <option value="finished">Finished</option>
                </select>
              </div>

              <div>
                <label htmlFor="createdBy" className="block text-sm font-semibold mb-2 text-amber-200">
                  Created By (Username)
                </label>
                <input
                  type="text"
                  id="createdBy"
                  value={filters.createdBy}
                  onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                  className="w-full px-3 py-2 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50"
                  placeholder="Filter by creator username..."
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-semibold mb-2 text-amber-200">
                  Tournament Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="w-full px-3 py-2 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50"
                  placeholder="Filter by tournament name..."
                />
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-800 disabled:to-amber-900 px-4 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-amber-500 flex items-center justify-center"
          >
            <span className="text-xl mr-2">
              {loading ? '⏳' : '🏆'}
            </span>
            {loading ? 'Loading Tournaments...' : 'Get Arena Tournaments'}
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

      {tournaments.length > 0 && (
        <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-3xl mr-2">🏆</span>
              <h3 className="text-2xl font-bold">Arena Tournaments</h3>
              <span className="ml-4 bg-amber-600/40 px-3 py-1 rounded-full text-sm font-semibold">
                {tournaments.length} tournaments
              </span>
            </div>
          </div>
          
          {/* Tournament List */}
          <div className="space-y-4">
            {tournaments.map((tournament) => (
              <div key={tournament.id} className="bg-amber-700/30 rounded-lg p-5 border border-amber-600/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Tournament Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-amber-100 mb-2">{tournament.fullName}</h4>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(tournament.status)} bg-amber-600/20`}>
                            {getStatusText(tournament.status)}
                          </span>
                          <span className="px-2 py-1 bg-amber-600/20 text-amber-200 rounded text-xs font-semibold">
                            {tournament.perf.name}
                          </span>
                          <span className="px-2 py-1 bg-amber-600/20 text-amber-200 rounded text-xs font-semibold">
                            {tournament.variant.name}
                          </span>
                          {tournament.rated ? (
                            <span className="px-2 py-1 bg-green-600/20 text-green-300 rounded text-xs font-semibold">Rated</span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-600/20 text-yellow-300 rounded text-xs font-semibold">Casual</span>
                          )}
                        </div>
                        <div className="text-amber-300 text-sm">
                          Created by: <span className="font-semibold">@{tournament.createdBy}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-amber-600/20 rounded p-2 border border-amber-500/30">
                        <div className="text-amber-300">Players</div>
                        <div className="text-amber-100 font-semibold">{tournament.nbPlayers}</div>
                      </div>
                      <div className="bg-amber-600/20 rounded p-2 border border-amber-500/30">
                        <div className="text-amber-300">Time Control</div>
                        <div className="text-amber-100 font-semibold">{formatTimeControl(tournament.clock)}</div>
                      </div>
                      <div className="bg-amber-600/20 rounded p-2 border border-amber-500/30">
                        <div className="text-amber-300">Duration</div>
                        <div className="text-amber-100 font-semibold">{formatDuration(tournament.minutes)}</div>
                      </div>
                      <div className="bg-amber-600/20 rounded p-2 border border-amber-500/30">
                        <div className="text-amber-300">System</div>
                        <div className="text-amber-100 font-semibold capitalize">{tournament.system}</div>
                      </div>
                    </div>
                  </div>

                  {/* Tournament Details */}
                  <div className="space-y-3">
                    <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                      <div className="text-amber-200 font-semibold mb-2 text-sm">Schedule</div>
                      <div className="space-y-1 text-xs">
                        <div>
                          <span className="text-amber-300">Starts:</span>
                          <div className="text-amber-100">{formatTimestamp(tournament.startsAt)}</div>
                        </div>
                        <div>
                          <span className="text-amber-300">Ends:</span>
                          <div className="text-amber-100">{formatTimestamp(tournament.finishesAt)}</div>
                        </div>
                      </div>
                    </div>

                    {tournament.winner && (
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <div className="text-amber-200 font-semibold mb-2 text-sm flex items-center">
                          <span className="mr-1">🏆</span>
                          Winner
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-100 font-semibold">{tournament.winner.name}</span>
                          {tournament.winner.flair && <span>🏅</span>}
                        </div>
                        <div className="text-amber-400 text-xs">@{tournament.winner.id}</div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <a
                        href={`https://lichess.org/tournament/${tournament.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm text-center"
                      >
                        View
                      </a>
                      {tournament.status === 10 && (
                        <a
                          href={`https://lichess.org/tournament/${tournament.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-2 px-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm text-center"
                        >
                          Join
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tournaments.length === 0 && !loading && !error && teamId && (
        <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600 text-center">
          <span className="text-4xl mb-4 block">🏆</span>
          <p className="text-amber-300 text-lg mb-2">No arena tournaments found</p>
          <p className="text-amber-400">This team may not have any arena tournaments matching your filters</p>
        </div>
      )}
    </div>
  );
}