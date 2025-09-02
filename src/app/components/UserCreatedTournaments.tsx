'use client';

import { useState, useEffect } from 'react';

interface Tournament {
  id: string;
  createdBy: string;
  system: string;
  minutes: number;
  clock: {
    limit: number;
    increment: number;
  };
  rated: boolean;
  fullName: string;
  nbPlayers: number;
  variant: {
    key: string;
    short: string;
    name: string;
  };
  startsAt: number;
  finishesAt: number;
  status: number;
  perf: {
    key: string;
    name: string;
    position: number;
    icon: string;
  };
  teamMember?: string;
  winner?: {
    name: string;
    flair?: string;
    id: string;
  };
}

interface UserCreatedTournamentsProps {
  username: string;
}

export default function UserCreatedTournaments({ username }: UserCreatedTournamentsProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string[]>(['10', '20', '30']); // Default to all tournament statuses

  const statusOptions = [
    { value: '10', label: 'Created', color: 'text-amber-300', emoji: '📝' },
    { value: '20', label: 'Started', color: 'text-amber-200', emoji: '🏁' },
    { value: '30', label: 'Finished', color: 'text-amber-100', emoji: '🏆' }
  ];

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);

    try {
      // Only add status parameters if not all statuses are selected
      const statusQuery = selectedStatus.length === 3 ? '' : selectedStatus.map(s => `status=${s}`).join('&');
      const url = statusQuery 
        ? `/api/lichess/user/${username}/tournament/created?${statusQuery}`
        : `/api/lichess/user/${username}/tournament/created`;
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        // Mock data since this requires authorization - showing different tournament statuses
        const allMockTournaments: Tournament[] = [
          {
            id: "AbC123Xy",
            createdBy: username,
            system: "arena",
            minutes: 90,
            clock: {
              limit: 180,
              increment: 2
            },
            rated: true,
            fullName: "Bullet Arena Championship - Saturday Special",
            nbPlayers: 0,
            variant: {
              key: "standard",
              short: "Std",
              name: "Standard"
            },
            startsAt: Date.now() + 3600000, // 1 hour from now
            finishesAt: Date.now() + 9000000, // 2.5 hours from now
            status: 10, // Created
            perf: {
              key: "bullet",
              name: "Bullet",
              position: 1,
              icon: ")"
            }
          },
          {
            id: "DeF456Zw",
            createdBy: username,
            system: "swiss",
            minutes: 180,
            clock: {
              limit: 900,
              increment: 10
            },
            rated: true,
            fullName: "Classical Swiss - Weekly Grind",
            nbPlayers: 24,
            variant: {
              key: "standard",
              short: "Std",
              name: "Standard"
            },
            startsAt: Date.now() - 1800000, // 30 minutes ago
            finishesAt: Date.now() + 7200000, // 2 hours from now
            status: 20, // Started
            perf: {
              key: "classical",
              name: "Classical",
              position: 4,
              icon: "+"
            },
            teamMember: "chess-masters-league"
          },
          {
            id: "NrJaGvHl",
            createdBy: username,
            system: "arena",
            minutes: 60,
            clock: {
              limit: 300,
              increment: 3
            },
            rated: false,
            fullName: "Weekly Blitz Arena - Community Tournament",
            nbPlayers: 13,
            variant: {
              key: "standard",
              short: "Std",
              name: "Standard"
            },
            startsAt: 1747186200000,
            finishesAt: 1747189800000,
            status: 30, // Finished
            perf: {
              key: "blitz",
              name: "Blitz",
              position: 1,
              icon: ")"
            },
            winner: {
              name: "TheChessmaster",
              flair: "activity.trophy",
              id: "thechessmaster"
            }
          },
          {
            id: "MkHbFx9P",
            createdBy: username,
            system: "swiss",
            minutes: 120,
            clock: {
              limit: 600,
              increment: 5
            },
            rated: true,
            fullName: "Rapid Swiss Championship",
            nbPlayers: 28,
            variant: {
              key: "standard",
              short: "Std", 
              name: "Standard"
            },
            startsAt: 1746976800000,
            finishesAt: 1747004400000,
            status: 30, // Finished
            perf: {
              key: "rapid",
              name: "Rapid",
              position: 2,
              icon: "#"
            },
            teamMember: "chess-community-club",
            winner: {
              name: "SwissExpert",
              flair: "nature.mountains",
              id: "swissexpert"
            }
          },
          {
            id: "GhI789Uv",
            createdBy: username,
            system: "arena",
            minutes: 45,
            clock: {
              limit: 420,
              increment: 0
            },
            rated: true,
            fullName: "Chess960 Arena - Fischer Random Special",
            nbPlayers: 19,
            variant: {
              key: "chess960",
              short: "960",
              name: "Chess960"
            },
            startsAt: 1746800000000,
            finishesAt: 1746802700000,
            status: 30, // Finished
            perf: {
              key: "chess960",
              name: "Chess960",
              position: 11,
              icon: "?"
            },
            winner: {
              name: "Fischer960Pro",
              flair: "objects.chess-pawn",
              id: "fischer960pro"
            }
          }
        ];
        
        // Filter tournaments based on selected status
        const mockTournaments = allMockTournaments.filter(tournament => 
          selectedStatus.includes(tournament.status.toString())
        );
        setTournaments(mockTournaments);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch tournaments');
      }
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      setError('Failed to load tournaments. Authorization may be required.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchTournaments();
    }
  }, [username, selectedStatus]);

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 10:
        return { label: 'Created', color: 'text-amber-300', bg: 'bg-amber-600/20', border: 'border-amber-500/50', emoji: '📝' };
      case 20:
        return { label: 'Started', color: 'text-amber-200', bg: 'bg-amber-500/20', border: 'border-amber-400/50', emoji: '🏁' };
      case 30:
        return { label: 'Finished', color: 'text-amber-100', bg: 'bg-amber-500/30', border: 'border-amber-400/60', emoji: '🏆' };
      default:
        return { label: 'Unknown', color: 'text-amber-400', bg: 'bg-amber-600/20', border: 'border-amber-500/50', emoji: '❓' };
    }
  };

  const getPerfIcon = (perfKey: string) => {
    switch (perfKey) {
      case 'bullet':
        return '•';
      case 'blitz':
        return '⚡';
      case 'rapid':
        return '🏃';
      case 'classical':
        return '⬛';
      case 'correspondence':
        return '📮';
      default:
        return '♟️';
    }
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  return (
    <div className="mt-6 bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
      <div className="flex items-center justify-center mb-4">
        <span className="text-2xl mr-2">🏆</span>
        <h4 className="text-xl font-bold">Created Tournaments</h4>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-amber-300">
          Tournaments created by {username}
        </p>
        <p className="text-amber-400 text-sm mt-1">
          Includes arena and swiss system tournaments with detailed results
        </p>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex items-center justify-center mb-3">
          <span className="text-amber-300 text-sm mr-3">Filter by status:</span>
        </div>
        <div className="flex justify-center gap-3 flex-wrap">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                selectedStatus.includes(option.value)
                  ? 'bg-amber-600 text-amber-100 border-amber-500'
                  : 'bg-amber-700/30 text-amber-300 border-amber-600/50 hover:bg-amber-600/50'
              }`}
            >
              <span className="mr-1">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tournament Results */}
      <div className="min-h-[200px]">
        {loading && (
          <div className="text-center py-8">
            <span className="text-2xl mb-2 block">⏳</span>
            <p className="text-amber-300">Loading tournaments...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <span className="text-2xl mb-2 block">🔒</span>
            <p className="text-red-300">Authorization Required</p>
            <p className="text-amber-400 text-sm mt-2">{error}</p>
            <div className="mt-4 text-amber-300 text-sm">
              <p>This endpoint requires OAuth2 authorization.</p>
              <p>Showing mock data for demonstration purposes.</p>
            </div>
          </div>
        )}

        {!loading && !error && tournaments.length === 0 && (
          <div className="text-center py-8">
            <span className="text-2xl mb-2 block">🏆</span>
            <p className="text-amber-300">No tournaments found</p>
            <p className="text-amber-400 text-sm mt-2">
              {username} hasn't created any tournaments with the selected status filters
            </p>
          </div>
        )}

        {tournaments.length > 0 && (
          <div className="space-y-4">
            {tournaments.map((tournament) => {
              const statusInfo = getStatusInfo(tournament.status);
              return (
                <div key={tournament.id} className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                  <div className="space-y-4">
                    {/* Tournament Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-lg font-bold text-amber-100 mb-1">
                          {tournament.fullName}
                        </h5>
                        <div className="flex items-center gap-3 flex-wrap text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border`}>
                            {statusInfo.emoji} {statusInfo.label}
                          </span>
                          <span className="text-amber-300">
                            {getPerfIcon(tournament.perf.key)} {tournament.perf.name}
                          </span>
                          <span className="text-amber-300">
                            {tournament.rated ? '⭐ Rated' : '🎯 Casual'}
                          </span>
                          <span className="text-amber-300">
                            👥 {tournament.nbPlayers} players
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-amber-300">Tournament ID</div>
                        <div className="text-amber-100 font-mono text-xs">{tournament.id}</div>
                      </div>
                    </div>

                    {/* Tournament Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* System & Duration */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h6 className="text-amber-200 font-semibold mb-2 text-sm">Format</h6>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-amber-300">System:</span>
                            <span className="text-amber-100 capitalize">{tournament.system}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-300">Duration:</span>
                            <span className="text-amber-100">{formatDuration(tournament.minutes)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-300">Variant:</span>
                            <span className="text-amber-100">{tournament.variant.name}</span>
                          </div>
                        </div>
                      </div>

                      {/* Time Control */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h6 className="text-amber-200 font-semibold mb-2 text-sm">Time Control</h6>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-amber-300">Base Time:</span>
                            <span className="text-amber-100">{tournament.clock.limit / 60}min</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-300">Increment:</span>
                            <span className="text-amber-100">{tournament.clock.increment}s</span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule & Results */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h6 className="text-amber-200 font-semibold mb-2 text-sm">Schedule & Winner</h6>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-amber-300">Started:</span>
                            <div className="text-amber-100 text-xs">{formatDateTime(tournament.startsAt)}</div>
                          </div>
                          {tournament.winner && (
                            <div>
                              <span className="text-amber-300">Winner:</span>
                              <div className="text-amber-100 font-semibold">🏆 {tournament.winner.name}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Team Information */}
                    {tournament.teamMember && (
                      <div className="pt-3 border-t border-amber-600/50">
                        <div className="flex items-center text-sm">
                          <span className="text-amber-300 mr-2">👥 Team:</span>
                          <span className="text-amber-100 font-medium">{tournament.teamMember}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Authorization Notice */}
      <div className="mt-4 bg-amber-600/20 rounded p-3 border border-amber-500/30">
        <div className="text-center text-xs text-amber-400">
          <p>🔒 This endpoint requires OAuth2 authorization for full functionality.</p>
          <p>Currently displaying mock data for demonstration purposes.</p>
        </div>
      </div>
    </div>
  );
}