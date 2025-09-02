'use client';

import { useState, useEffect } from 'react';

interface PlayedTournament {
  tournament: {
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
    minRatedGames?: {
      nb: number;
    };
    schedule?: {
      freq: string;
      speed: string;
    };
  };
  player: {
    games: number;
    score: number;
    rank: number;
    performance?: number;
  };
}

interface UserPlayedTournamentsProps {
  username: string;
}

export default function UserPlayedTournaments({ username }: UserPlayedTournamentsProps) {
  const [tournaments, setTournaments] = useState<PlayedTournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/lichess/user/${username}/tournament/played`);
      
      if (response.ok) {
        const data = await response.json();
        // Mock data since this requires authorization
        const mockTournaments: PlayedTournament[] = [
          {
            tournament: {
              id: "JbdQe217",
              createdBy: "cormacobear",
              system: "arena",
              minutes: 240,
              clock: {
                limit: 180,
                increment: 0
              },
              rated: true,
              fullName: "Lichess 2025 MSF Charity Campaign",
              nbPlayers: 3753,
              variant: {
                key: "standard",
                short: "Std",
                name: "Standard"
              },
              startsAt: 1746295200000,
              finishesAt: 1746309600000,
              status: 30,
              perf: {
                key: "blitz",
                name: "Blitz",
                position: 1,
                icon: ")"
              },
              minRatedGames: {
                nb: 20
              },
              schedule: {
                freq: "unique",
                speed: "superBlitz"
              }
            },
            player: {
              games: 8,
              score: 7,
              rank: 1503,
              performance: 2156
            }
          },
          {
            tournament: {
              id: "Abc123XY",
              createdBy: "tornament_master",
              system: "swiss",
              minutes: 180,
              clock: {
                limit: 600,
                increment: 5
              },
              rated: true,
              fullName: "Weekly Rapid Swiss Championship",
              nbPlayers: 842,
              variant: {
                key: "standard",
                short: "Std",
                name: "Standard"
              },
              startsAt: 1746208800000,
              finishesAt: 1746219600000,
              status: 30,
              perf: {
                key: "rapid",
                name: "Rapid",
                position: 2,
                icon: "#"
              },
              minRatedGames: {
                nb: 10
              }
            },
            player: {
              games: 11,
              score: 8.5,
              rank: 45,
              performance: 2234
            }
          },
          {
            tournament: {
              id: "DefG456Z",
              createdBy: "chess960_fan",
              system: "arena",
              minutes: 90,
              clock: {
                limit: 300,
                increment: 3
              },
              rated: false,
              fullName: "Chess960 Evening Arena - Casual Fun",
              nbPlayers: 156,
              variant: {
                key: "chess960",
                short: "960",
                name: "Chess960"
              },
              startsAt: 1746122400000,
              finishesAt: 1746127800000,
              status: 30,
              perf: {
                key: "chess960",
                name: "Chess960",
                position: 11,
                icon: "?"
              }
            },
            player: {
              games: 12,
              score: 9,
              rank: 23
            }
          },
          {
            tournament: {
              id: "HiJk789W",
              createdBy: "bullet_speed",
              system: "arena",
              minutes: 60,
              clock: {
                limit: 60,
                increment: 1
              },
              rated: true,
              fullName: "Sunday Bullet Blitz - Speed Chess",
              nbPlayers: 567,
              variant: {
                key: "standard",
                short: "Std",
                name: "Standard"
              },
              startsAt: 1746036000000,
              finishesAt: 1746039600000,
              status: 30,
              perf: {
                key: "bullet",
                name: "Bullet",
                position: 1,
                icon: ")"
              },
              minRatedGames: {
                nb: 50
              }
            },
            player: {
              games: 15,
              score: 11,
              rank: 89,
              performance: 1987
            }
          }
        ];
        setTournaments(mockTournaments);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch played tournaments');
      }
    } catch (err) {
      console.error('Error fetching played tournaments:', err);
      setError('Failed to load tournaments. Authorization may be required.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchTournaments();
    }
  }, [username]);

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
      case 'chess960':
        return '🎲';
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

  const getPerformanceColor = (performance?: number, rank?: number) => {
    if (!performance) return 'text-amber-300';
    if (performance >= 2400) return 'text-yellow-400';
    if (performance >= 2200) return 'text-amber-200';
    if (performance >= 2000) return 'text-amber-300';
    return 'text-amber-400';
  };

  const getRankColor = (rank: number, totalPlayers: number) => {
    const percentile = rank / totalPlayers;
    if (percentile <= 0.1) return 'text-yellow-400'; // Top 10%
    if (percentile <= 0.25) return 'text-amber-200'; // Top 25%
    if (percentile <= 0.5) return 'text-amber-300'; // Top 50%
    return 'text-amber-400';
  };

  return (
    <div className="mt-6 bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
      <div className="flex items-center justify-center mb-4">
        <span className="text-2xl mr-2">🎯</span>
        <h4 className="text-xl font-bold">Tournament Participation</h4>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-amber-300">
          Tournaments played by {username}
        </p>
        <p className="text-amber-400 text-sm mt-1">
          Performance history with scores, rankings, and statistics
        </p>
      </div>

      {/* Tournament Results */}
      <div className="min-h-[200px]">
        {loading && (
          <div className="text-center py-8">
            <span className="text-2xl mb-2 block">⏳</span>
            <p className="text-amber-300">Loading tournament history...</p>
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

        {!loading && tournaments.length === 0 && !error && (
          <div className="text-center py-8">
            <span className="text-2xl mb-2 block">🎯</span>
            <p className="text-amber-300">No tournament history found</p>
            <p className="text-amber-400 text-sm mt-2">
              {username} hasn't participated in any tournaments yet
            </p>
          </div>
        )}

        {tournaments.length > 0 && (
          <div className="space-y-4">
            {tournaments.map((entry) => {
              const { tournament, player } = entry;
              const statusInfo = getStatusInfo(tournament.status);
              const rankColor = getRankColor(player.rank, tournament.nbPlayers);
              const perfColor = getPerformanceColor(player.performance, player.rank);
              
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
                          <span className="text-amber-300 capitalize">
                            📋 {tournament.system}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Performance Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Player Performance */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h6 className="text-amber-200 font-semibold mb-2 text-sm">Performance</h6>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-amber-300">Score:</span>
                            <span className="text-amber-100 font-semibold">{player.score}/{player.games}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-300">Win Rate:</span>
                            <span className="text-amber-100 font-semibold">
                              {Math.round((player.score / player.games) * 100)}%
                            </span>
                          </div>
                          {player.performance && (
                            <div className="flex justify-between">
                              <span className="text-amber-300">Rating:</span>
                              <span className={`font-semibold ${perfColor}`}>
                                {player.performance}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ranking */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h6 className="text-amber-200 font-semibold mb-2 text-sm">Ranking</h6>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-amber-300">Final Rank:</span>
                            <span className={`font-semibold ${rankColor}`}>
                              #{player.rank}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-300">Percentile:</span>
                            <span className={`font-semibold ${rankColor}`}>
                              {Math.round((1 - player.rank / tournament.nbPlayers) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Tournament Format */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h6 className="text-amber-200 font-semibold mb-2 text-sm">Format</h6>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-amber-300">Time:</span>
                            <span className="text-amber-100">
                              {tournament.clock.limit / 60}+{tournament.clock.increment}
                            </span>
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

                      {/* Schedule Info */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h6 className="text-amber-200 font-semibold mb-2 text-sm">Details</h6>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-amber-300">Date:</span>
                            <div className="text-amber-100 text-xs">
                              {new Date(tournament.startsAt).toLocaleDateString()}
                            </div>
                          </div>
                          {tournament.schedule && (
                            <div className="flex justify-between">
                              <span className="text-amber-300">Type:</span>
                              <span className="text-amber-100 capitalize text-xs">
                                {tournament.schedule.freq}
                              </span>
                            </div>
                          )}
                          {tournament.minRatedGames && (
                            <div className="flex justify-between">
                              <span className="text-amber-300">Min Games:</span>
                              <span className="text-amber-100">{tournament.minRatedGames.nb}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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