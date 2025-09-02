'use client';

import { useState, useEffect } from 'react';

interface TournamentClock {
  limit: number;
  increment: number;
}

interface TournamentVariant {
  key: string;
  short: string;
  name: string;
}

interface TournamentPerf {
  key: string;
  name: string;
  position: number;
  icon?: string;
}

interface TournamentSchedule {
  freq: string;
  speed: string;
}

interface TournamentWinner {
  name: string;
  title?: string;
  flair?: string;
  patron?: boolean;
  id: string;
}

interface TournamentPosition {
  eco: string;
  name: string;
  fen: string;
  url: string;
}

interface ArenaTournament {
  id: string;
  createdBy: string;
  system: string;
  minutes: number;
  clock: TournamentClock;
  rated: boolean;
  fullName: string;
  nbPlayers: number;
  variant: TournamentVariant;
  startsAt: number;
  finishesAt: number;
  status: number;
  perf: TournamentPerf;
  secondsToStart?: number;
  minRatedGames?: {
    nb: number;
  };
  hasMaxRating?: boolean;
  maxRating?: {
    rating: number;
  };
  schedule?: TournamentSchedule;
  winner?: TournamentWinner;
  position?: TournamentPosition;
}

interface ArenaTournamentsData {
  created: ArenaTournament[];
  started: ArenaTournament[];
  finished: ArenaTournament[];
}

export default function ArenaTournaments() {
  const [tournaments, setTournaments] = useState<ArenaTournamentsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'created' | 'started' | 'finished'>('created');
  const [showCount, setShowCount] = useState(10);

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/lichess/tournament');
      
      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch arena tournaments');
      }
    } catch (err) {
      console.error('Error fetching arena tournaments:', err);
      setError('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 10:
        return { label: 'Created', color: 'text-amber-300', bg: 'bg-amber-600/20', border: 'border-amber-500/50', emoji: '📝' };
      case 20:
        return { label: 'In Progress', color: 'text-green-300', bg: 'bg-green-600/20', border: 'border-green-500/50', emoji: '⚔️' };
      case 30:
        return { label: 'Finished', color: 'text-blue-300', bg: 'bg-blue-600/20', border: 'border-blue-500/50', emoji: '🏁' };
      default:
        return { label: 'Unknown', color: 'text-amber-400', bg: 'bg-amber-600/20', border: 'border-amber-500/50', emoji: '❓' };
    }
  };

  const getPerfIcon = (perfKey: string, icon?: string) => {
    if (icon) return icon;
    switch (perfKey) {
      case 'bullet':
        return '•';
      case 'blitz':
        return '⚡';
      case 'rapid':
        return '🏃';
      case 'classical':
        return '⬛';
      case 'ultraBullet':
        return '💥';
      case 'chess960':
        return '🎲';
      case 'crazyhouse':
        return '🎪';
      case 'atomic':
        return '💣';
      case 'antichess':
        return '🔄';
      case 'threeCheck':
        return '✓';
      case 'kingOfTheHill':
        return '👑';
      case 'racingKings':
        return '🏁';
      case 'horde':
        return '⚡';
      default:
        return '♟️';
    }
  };

  const getTitleDisplay = (title?: string) => {
    if (!title) return '';
    const titleMap: { [key: string]: string } = {
      'GM': '👑',
      'IM': '🏆',
      'FM': '🥇',
      'CM': '🥈',
      'NM': '⭐',
      'LM': '🎖️'
    };
    return titleMap[title] || '🎯';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}+${seconds % 60}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatSecondsToTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getTabCount = (tab: 'created' | 'started' | 'finished') => {
    if (!tournaments) return 0;
    return tournaments[tab].length;
  };

  const getCurrentTournaments = () => {
    if (!tournaments) return [];
    return tournaments[activeTab].slice(0, showCount);
  };

  return (
    <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600 mt-6">
      <div className="flex items-center justify-center mb-6">
        <span className="text-3xl mr-2">🏟️</span>
        <h3 className="text-2xl font-bold">Live Arena Tournaments</h3>
      </div>

      <div className="text-center mb-6">
        <p className="text-amber-300">
          Current arena tournaments with real-time status updates
        </p>
        <p className="text-amber-400 text-sm mt-1">
          Fast-paced continuous battles with immediate pairing and live rankings
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <span className="text-2xl mb-2 block animate-spin">⏳</span>
          <p className="text-amber-300">Loading arena tournaments...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-6 bg-red-900/20 rounded-lg border border-red-500/30 mb-6">
          <span className="text-2xl mb-2 block">❌</span>
          <p className="text-red-300 font-semibold mb-1">Failed to Load Tournaments</p>
          <p className="text-amber-400 text-sm">{error}</p>
        </div>
      )}

      {tournaments && (
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-6">
            <div className="bg-amber-700/30 rounded-lg p-1 border border-amber-600/50">
              <div className="flex gap-1">
                {(['created', 'started', 'finished'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 flex items-center gap-2 ${
                      activeTab === tab
                        ? 'bg-amber-600 text-amber-100 shadow-lg'
                        : 'text-amber-300 hover:bg-amber-600/50 hover:text-amber-100'
                    }`}
                  >
                    <span className="text-lg">
                      {tab === 'created' && '📝'}
                      {tab === 'started' && '⚔️'}
                      {tab === 'finished' && '🏁'}
                    </span>
                    <span className="capitalize">{tab}</span>
                    <span className="bg-amber-500/30 px-2 py-1 rounded-full text-xs">
                      {getTabCount(tab)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Show Count Controls */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setShowCount(5)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  showCount === 5 ? 'bg-amber-600 text-amber-100' : 'bg-amber-700/30 text-amber-300 hover:bg-amber-600/50'
                }`}
              >
                Top 5
              </button>
              <button
                onClick={() => setShowCount(10)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  showCount === 10 ? 'bg-amber-600 text-amber-100' : 'bg-amber-700/30 text-amber-300 hover:bg-amber-600/50'
                }`}
              >
                Top 10
              </button>
              <button
                onClick={() => setShowCount(20)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  showCount === 20 ? 'bg-amber-600 text-amber-100' : 'bg-amber-700/30 text-amber-300 hover:bg-amber-600/50'
                }`}
              >
                Top 20
              </button>
              <button
                onClick={() => setShowCount(tournaments[activeTab].length)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  showCount === tournaments[activeTab].length ? 'bg-amber-600 text-amber-100' : 'bg-amber-700/30 text-amber-300 hover:bg-amber-600/50'
                }`}
              >
                Show All
              </button>
            </div>
          </div>

          {/* Tournament Cards */}
          <div className="space-y-4">
            {getCurrentTournaments().map((tournament) => {
              const statusInfo = getStatusInfo(tournament.status);
              return (
                <div key={tournament.id} className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                  <div className="space-y-4">
                    {/* Tournament Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-amber-100 mb-2">{tournament.fullName}</h4>
                        <div className="flex items-center gap-3 flex-wrap text-sm">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border`}>
                            {statusInfo.emoji} {statusInfo.label}
                          </span>
                          <span className="text-amber-300">
                            {getPerfIcon(tournament.perf.key, tournament.perf.icon)} {tournament.perf.name}
                          </span>
                          <span className="text-amber-300">
                            {tournament.rated ? '⭐ Rated' : '🎯 Casual'}
                          </span>
                          <span className="text-amber-300">
                            👥 {tournament.nbPlayers} players
                          </span>
                          <span className="text-amber-300">
                            ♟️ {tournament.variant.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm ml-4">
                        <div className="text-amber-300">Tournament ID</div>
                        <div className="text-amber-100 font-mono text-xs">{tournament.id}</div>
                      </div>
                    </div>

                    {/* Tournament Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Time & Format */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h5 className="text-amber-200 font-semibold mb-2 text-sm">Time & Format</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-amber-300">Time Control:</span>
                            <span className="text-amber-100 font-semibold">{formatTime(tournament.clock.limit)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-300">Duration:</span>
                            <span className="text-amber-100">{formatDuration(tournament.minutes)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-amber-300">System:</span>
                            <span className="text-amber-100 capitalize">{tournament.system}</span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule & Timing */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h5 className="text-amber-200 font-semibold mb-2 text-sm">Schedule & Timing</h5>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-amber-300">Start Time:</span>
                            <div className="text-amber-100 text-xs">{formatDateTime(tournament.startsAt)}</div>
                          </div>
                          {tournament.secondsToStart !== undefined && tournament.secondsToStart > 0 && (
                            <div className="flex justify-between">
                              <span className="text-amber-300">Starts In:</span>
                              <span className="text-amber-100 font-semibold">{formatSecondsToTime(tournament.secondsToStart)}</span>
                            </div>
                          )}
                          {tournament.schedule && (
                            <div className="flex justify-between">
                              <span className="text-amber-300">Frequency:</span>
                              <span className="text-amber-100 capitalize">{tournament.schedule.freq}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Requirements & Winner */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h5 className="text-amber-200 font-semibold mb-2 text-sm">
                          {tournament.winner ? 'Winner & Requirements' : 'Requirements'}
                        </h5>
                        <div className="space-y-1 text-sm">
                          {tournament.winner && (
                            <div>
                              <span className="text-amber-300">Winner:</span>
                              <div className="flex items-center gap-1 mt-1">
                                {tournament.winner.title && (
                                  <span title={tournament.winner.title}>{getTitleDisplay(tournament.winner.title)}</span>
                                )}
                                <span className="text-amber-100 font-semibold">{tournament.winner.name}</span>
                                {tournament.winner.patron && <span className="text-amber-200" title="Patron">💎</span>}
                              </div>
                            </div>
                          )}
                          {tournament.minRatedGames && (
                            <div className="flex justify-between">
                              <span className="text-amber-300">Min Games:</span>
                              <span className="text-amber-100">{tournament.minRatedGames.nb}</span>
                            </div>
                          )}
                          {tournament.hasMaxRating && tournament.maxRating && (
                            <div className="flex justify-between">
                              <span className="text-amber-300">Max Rating:</span>
                              <span className="text-amber-100">≤{tournament.maxRating.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Special Position */}
                    {tournament.position && (
                      <div className="pt-3 border-t border-amber-600/50">
                        <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                          <h5 className="text-amber-200 font-semibold mb-2 text-sm flex items-center">
                            <span className="text-lg mr-2">📋</span>
                            Starting Position
                          </h5>
                          <div className="text-sm">
                            <div className="text-amber-100 font-semibold mb-1">{tournament.position.name}</div>
                            <div className="text-amber-300 text-xs">ECO: {tournament.position.eco}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {tournaments[activeTab].length === 0 && (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">
                {activeTab === 'created' && '📝'}
                {activeTab === 'started' && '⚔️'}
                {activeTab === 'finished' && '🏁'}
              </span>
              <p className="text-amber-300">No {activeTab} tournaments found</p>
              <p className="text-amber-400 text-sm mt-2">Check other tabs for available tournaments</p>
            </div>
          )}
        </div>
      )}

      {!loading && !error && !tournaments && (
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">🏟️</span>
          <p className="text-amber-300">No tournament data available</p>
          <p className="text-amber-400 text-sm mt-2">Please try refreshing the page</p>
        </div>
      )}
    </div>
  );
}