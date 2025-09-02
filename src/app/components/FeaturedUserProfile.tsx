'use client';

import { useState } from 'react';
import UserCreatedTournaments from './UserCreatedTournaments';
import UserPlayedTournaments from './UserPlayedTournaments';
import UserTeams from './UserTeams';

interface UserProfile {
  id: string;
  username: string;
  perfs: {
    [key: string]: {
      games: number;
      rating: number;
      rd: number;
      prog: number;
    };
  };
  flair?: string;
  createdAt: number;
  profile?: {
    location?: string;
    cfcRating?: number;
    fideRating?: number;
    uscfRating?: number;
    bio?: string;
    links?: string;
    flag?: string;
  };
  seenAt: number;
  playTime: {
    total: number;
    tv: number;
  };
  count: {
    all: number;
    rated: number;
    ai: number;
    draw: number;
    drawH: number;
    loss: number;
    lossH: number;
    win: number;
    winH: number;
    bookmark: number;
    playing: number;
    import: number;
    me: number;
  };
  streamer?: {
    twitch?: {
      channel: string;
    };
  };
  followable: boolean;
  following: boolean;
  blocking: boolean;
}

interface RatingHistory {
  name: string;
  points: [number, number, number, number][]; // [year, month, day, rating]
}

interface UserActivity {
  interval: {
    start: number;
    end: number;
  };
  games?: {
    [variant: string]: {
      win: number;
      loss: number;
      draw: number;
      rp: {
        before: number;
        after: number;
      };
    };
  };
  puzzles?: {
    score: {
      win: number;
      loss: number;
      draw: number;
      rp: {
        before: number;
        after: number;
      };
    };
  };
  follows?: {
    in?: {
      ids: string[];
    };
  };
}

interface PerformanceStats {
  user: {
    name: string;
  };
  perf: {
    glicko: {
      rating: number;
      deviation: number;
    };
    nb: number;
    progress: number;
  };
  rank: number;
  percentile: number;
  stat: {
    count: {
      berserk: number;
      win: number;
      all: number;
      seconds: number;
      opAvg: number;
      draw: number;
      tour: number;
      disconnects: number;
      rated: number;
      loss: number;
    };
    resultStreak: {
      win: {
        cur: { v: number };
        max: { v: number };
      };
      loss: {
        cur: { v: number };
        max: { v: number };
      };
    };
    perfType: {
      key: string;
      name: string;
    };
    playStreak: {
      nb: {
        cur: { v: number };
        max: { v: number };
      };
      time: {
        cur: { v: number };
        max: { v: number };
      };
    };
  };
}

export default function FeaturedUserProfile() {
  const [username, setUsername] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [ratingHistory, setRatingHistory] = useState<RatingHistory[]>([]);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);
  const [loadingPerformance, setLoadingPerformance] = useState(false);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showPerformance, setShowPerformance] = useState(false);

  const searchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');
    setUserProfile(null);
    setRatingHistory([]);
    setUserActivity([]);
    setPerformanceStats(null);
    setSelectedVariant('');
    setShowHistory(false);
    setShowActivity(false);
    setShowPerformance(false);

    try {
      const response = await fetch(`/api/lichess/user/${username.trim()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      setUserProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatingHistory = async () => {
    if (!userProfile?.username) return;

    setLoadingHistory(true);
    try {
      // Mock rating history data - in production this would call our API
      const mockHistoryData: RatingHistory[] = [
        {
          name: "Bullet",
          points: [
            [2024, 1, 15, 1450],
            [2024, 2, 3, 1478],
            [2024, 3, 12, 1502],
            [2024, 4, 8, 1489],
            [2025, 1, 22, 1556]
          ]
        },
        {
          name: "Blitz", 
          points: [
            [2024, 1, 20, 1380],
            [2024, 2, 14, 1425],
            [2024, 3, 28, 1467],
            [2024, 5, 15, 1492],
            [2025, 1, 10, 1521]
          ]
        },
        {
          name: "Rapid",
          points: [
            [2024, 2, 5, 1200],
            [2024, 3, 18, 1267],
            [2024, 4, 22, 1289],
            [2024, 6, 10, 1334],
            [2025, 1, 5, 1378]
          ]
        },
        {
          name: "Classical",
          points: [
            [2024, 3, 1, 1150],
            [2024, 4, 15, 1203],
            [2024, 6, 8, 1245],
            [2025, 1, 12, 1287]
          ]
        },
        {
          name: "Puzzles",
          points: [
            [2024, 1, 10, 1800],
            [2024, 2, 20, 1867],
            [2024, 3, 25, 1923],
            [2024, 5, 12, 1978],
            [2025, 1, 8, 2034]
          ]
        }
      ];

      setRatingHistory(mockHistoryData);
      setShowHistory(true);
    } catch (err) {
      console.error('Error fetching rating history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchUserActivity = async () => {
    if (!userProfile?.username) return;

    setLoadingActivity(true);
    try {
      // Mock activity data - in production this would call our API
      const mockActivityData: UserActivity[] = [
        {
          interval: { start: Date.now() - 86400000, end: Date.now() }, // Yesterday to now
          games: {
            blitz: { win: 8, loss: 3, draw: 1, rp: { before: 1520, after: 1545 } },
            rapid: { win: 2, loss: 1, draw: 0, rp: { before: 1380, after: 1390 } }
          },
          puzzles: {
            score: { win: 15, loss: 3, draw: 0, rp: { before: 2020, after: 2035 } }
          },
          follows: {
            in: { ids: ["player1", "player2", "player3"] }
          }
        },
        {
          interval: { start: Date.now() - 172800000, end: Date.now() - 86400000 }, // 2 days ago
          games: {
            blitz: { win: 5, loss: 7, draw: 2, rp: { before: 1535, after: 1520 } },
            bullet: { win: 12, loss: 8, draw: 0, rp: { before: 1650, after: 1670 } }
          },
          follows: {
            in: { ids: ["player4", "player5"] }
          }
        },
        {
          interval: { start: Date.now() - 259200000, end: Date.now() - 172800000 }, // 3 days ago
          puzzles: {
            score: { win: 8, loss: 2, draw: 0, rp: { before: 2000, after: 2020 } }
          },
          follows: {
            in: { ids: ["player6", "player7", "player8", "player9"] }
          }
        },
        {
          interval: { start: Date.now() - 345600000, end: Date.now() - 259200000 }, // 4 days ago
          games: {
            classical: { win: 1, loss: 2, draw: 1, rp: { before: 1300, after: 1285 } },
            rapid: { win: 3, loss: 2, draw: 0, rp: { before: 1370, after: 1380 } }
          }
        },
        {
          interval: { start: Date.now() - 432000000, end: Date.now() - 345600000 }, // 5 days ago
          games: {
            blitz: { win: 15, loss: 5, draw: 3, rp: { before: 1510, after: 1535 } }
          },
          puzzles: {
            score: { win: 20, loss: 5, draw: 0, rp: { before: 1980, after: 2000 } }
          }
        }
      ];

      setUserActivity(mockActivityData);
      setShowActivity(true);
    } catch (err) {
      console.error('Error fetching user activity:', err);
    } finally {
      setLoadingActivity(false);
    }
  };

  const fetchPerformanceStats = async (variant: string) => {
    if (!userProfile?.username) return;

    setLoadingPerformance(true);
    setSelectedVariant(variant);
    
    try {
      // Mock performance stats data - in production this would call our API
      const mockPerformanceData: PerformanceStats = {
        user: {
          name: userProfile.username
        },
        perf: {
          glicko: {
            rating: userProfile.perfs[variant]?.rating || 1500,
            deviation: Math.floor(Math.random() * 100) + 50
          },
          nb: userProfile.perfs[variant]?.games || 100,
          progress: userProfile.perfs[variant]?.prog || 0
        },
        rank: Math.floor(Math.random() * 1000) + 1,
        percentile: Math.round(Math.random() * 100 * 10) / 10,
        stat: {
          count: {
            berserk: Math.floor(Math.random() * 50),
            win: Math.floor((userProfile.perfs[variant]?.games || 100) * 0.45),
            all: userProfile.perfs[variant]?.games || 100,
            seconds: Math.floor(Math.random() * 100000) + 50000,
            opAvg: Math.round(Math.random() * 10) / 10,
            draw: Math.floor((userProfile.perfs[variant]?.games || 100) * 0.1),
            tour: Math.floor(Math.random() * 20),
            disconnects: Math.floor(Math.random() * 10),
            rated: Math.floor((userProfile.perfs[variant]?.games || 100) * 0.8),
            loss: Math.floor((userProfile.perfs[variant]?.games || 100) * 0.45)
          },
          resultStreak: {
            win: {
              cur: { v: Math.floor(Math.random() * 3) },
              max: { v: Math.floor(Math.random() * 10) + 3 }
            },
            loss: {
              cur: { v: Math.floor(Math.random() * 2) },
              max: { v: Math.floor(Math.random() * 5) + 1 }
            }
          },
          perfType: {
            key: variant,
            name: variant.charAt(0).toUpperCase() + variant.slice(1)
          },
          playStreak: {
            nb: {
              cur: { v: Math.floor(Math.random() * 5) },
              max: { v: Math.floor(Math.random() * 20) + 5 }
            },
            time: {
              cur: { v: Math.floor(Math.random() * 1000) },
              max: { v: Math.floor(Math.random() * 5000) + 1000 }
            }
          }
        }
      };

      setPerformanceStats(mockPerformanceData);
      setShowPerformance(true);
    } catch (err) {
      console.error('Error fetching performance stats:', err);
    } finally {
      setLoadingPerformance(false);
    }
  };

  return (
    <div className="mt-6 border-t-2 border-amber-600/50 pt-6">
      <div className="flex items-center justify-center mb-4">
        <span className="text-2xl mr-2">⭐</span>
        <h3 className="text-xl font-bold">Search User Profile</h3>
      </div>

      {/* Search Form */}
      <form onSubmit={searchUser} className="mb-6">
        <div className="flex gap-3 max-w-md mx-auto">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Lichess username..."
            className="flex-1 px-4 py-2 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50 font-medium"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-800 disabled:to-amber-900 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-amber-500 flex items-center"
          >
            {loading ? '⏳' : '🔍'}
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="bg-gradient-to-br from-red-800 to-red-900 border-4 border-red-600 rounded-2xl p-4 text-center shadow-2xl mb-6">
          <div className="flex items-center justify-center mb-2">
            <span className="text-3xl mr-2">❌</span>
            <p className="text-red-200 font-semibold">{error}</p>
          </div>
        </div>
      )}

      {/* User Profile Display */}
      {userProfile && (
        <div className="space-y-6">
          {/* User Header */}
          <div className="bg-amber-600/20 rounded-lg p-4 border border-amber-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="text-xl font-bold text-amber-100 mr-2">{userProfile.username}</h4>
                    {userProfile.profile?.flag && (
                      <span className="text-lg mr-2">🏳️</span>
                    )}
                  </div>
                  <div className="text-sm text-amber-300">
                    @{userProfile.id} • Joined {new Date(userProfile.createdAt).toLocaleDateString()}
                  </div>
                  {userProfile.profile?.location && (
                    <div className="text-sm text-amber-400 flex items-center">
                      <span className="mr-1">📍</span>
                      {userProfile.profile.location}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-amber-400">
                  Last seen: {new Date(userProfile.seenAt).toLocaleDateString()}
                </div>
                {userProfile.streamer?.twitch && (
                  <div className="mt-1">
                    <span className="text-purple-400 text-xs">📺 Streamer</span>
                  </div>
                )}
              </div>
            </div>
            
            {userProfile.profile?.bio && (
              <div className="bg-amber-700/20 rounded p-3 mb-3">
                <p className="text-amber-200 text-sm italic">"{userProfile.profile.bio}"</p>
              </div>
            )}
          </div>

          {/* Game Statistics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-amber-600/20 rounded-lg p-3 text-center border border-amber-500/30">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-lg font-bold text-amber-100">{userProfile.count.all}</div>
              <div className="text-xs text-amber-300">Total Games</div>
            </div>
            <div className="bg-amber-600/20 rounded-lg p-3 text-center border border-amber-500/30">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-lg font-bold text-green-400">{userProfile.count.win}</div>
              <div className="text-xs text-amber-300">Wins</div>
            </div>
            <div className="bg-amber-600/20 rounded-lg p-3 text-center border border-amber-500/30">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-lg font-bold text-blue-400">
                {Math.round((userProfile.count.win / userProfile.count.all) * 100)}%
              </div>
              <div className="text-xs text-amber-300">Win Rate</div>
            </div>
            <div className="bg-amber-600/20 rounded-lg p-3 text-center border border-amber-500/30">
              <div className="text-2xl mb-1">⏱️</div>
              <div className="text-lg font-bold text-amber-100">
                {Math.round(userProfile.playTime.total / 3600)}h
              </div>
              <div className="text-xs text-amber-300">Play Time</div>
            </div>
          </div>

          {/* Performance Ratings Grid */}
          <div className="bg-amber-600/20 rounded-lg p-4 border border-amber-500/30">
            <h5 className="text-lg font-semibold text-amber-200 mb-3 flex items-center">
              <span className="text-xl mr-2">⭐</span>
              Performance Ratings
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(userProfile.perfs)
                .filter(([_, perf]) => perf.games > 0)
                .map(([variant, perf]) => (
                  <button
                    key={variant} 
                    onClick={() => fetchPerformanceStats(variant)}
                    disabled={loadingPerformance && selectedVariant === variant}
                    className="bg-amber-700/30 rounded p-3 text-center hover:bg-amber-600/40 transition-all duration-200 border-2 border-transparent hover:border-amber-500/50 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <div className="text-lg mb-1">
                      {loadingPerformance && selectedVariant === variant ? '⏳' :
                       variant === 'bullet' ? '•' : 
                       variant === 'blitz' ? '⚔️' : 
                       variant === 'rapid' ? '🏃' : 
                       variant === 'classical' ? '⬛' : 
                       variant === 'correspondence' ? '📬' : 
                       variant === 'chess960' ? '🎲' : 
                       variant === 'puzzle' ? '🧩' : '♞'}
                    </div>
                    <div className="text-sm font-semibold text-amber-200 mb-1 capitalize">
                      {variant}
                    </div>
                    <div className="text-lg font-bold text-amber-100">{perf.rating}</div>
                    <div className="text-xs text-amber-400">{perf.games} games</div>
                    <div className={`text-xs ${perf.prog >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {perf.prog >= 0 ? '+' : ''}{perf.prog}
                    </div>
                    <div className="text-xs text-amber-500 mt-1 opacity-75">
                      Click for details
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Federation Ratings & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(userProfile.profile?.fideRating || userProfile.profile?.uscfRating || userProfile.profile?.cfcRating) && (
              <div className="bg-amber-600/20 rounded-lg p-4 border border-amber-500/30">
                <h5 className="text-md font-semibold text-amber-200 mb-3 flex items-center">
                  <span className="text-lg mr-2">🏅</span>
                  Federation Ratings
                </h5>
                <div className="space-y-2 text-sm">
                  {userProfile.profile?.fideRating && (
                    <div className="flex justify-between">
                      <span className="text-amber-300">FIDE:</span>
                      <span className="text-amber-100 font-semibold">{userProfile.profile.fideRating}</span>
                    </div>
                  )}
                  {userProfile.profile?.uscfRating && (
                    <div className="flex justify-between">
                      <span className="text-amber-300">USCF:</span>
                      <span className="text-amber-100 font-semibold">{userProfile.profile.uscfRating}</span>
                    </div>
                  )}
                  {userProfile.profile?.cfcRating && (
                    <div className="flex justify-between">
                      <span className="text-amber-300">CFC:</span>
                      <span className="text-amber-100 font-semibold">{userProfile.profile.cfcRating}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {userProfile.profile?.links && (
              <div className="bg-amber-600/20 rounded-lg p-4 border border-amber-500/30">
                <h5 className="text-md font-semibold text-amber-200 mb-3 flex items-center">
                  <span className="text-lg mr-2">🔗</span>
                  Social Links
                </h5>
                <div className="space-y-2">
                  {userProfile.profile.links.split('\n').slice(0, 3).map((link: string, index: number) => (
                    <a 
                      key={index} 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-xs text-blue-400 hover:text-blue-300 truncate"
                    >
                      🌐 {link}
                    </a>
                  ))}
                  {userProfile.streamer?.twitch && (
                    <a 
                      href={userProfile.streamer.twitch.channel} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-xs text-purple-400 hover:text-purple-300"
                    >
                      📺 Twitch Stream
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={fetchRatingHistory}
              disabled={loadingHistory}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-800 disabled:to-amber-900 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-amber-500 flex items-center"
            >
              {loadingHistory ? '⏳' : '📈'}
              <span className="ml-2">
                {loadingHistory ? 'Loading History...' : 'View Rating History'}
              </span>
            </button>
            
            <button
              onClick={fetchUserActivity}
              disabled={loadingActivity}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-purple-800 disabled:to-purple-900 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-purple-500 flex items-center"
            >
              {loadingActivity ? '⏳' : '📅'}
              <span className="ml-2">
                {loadingActivity ? 'Loading Activity...' : 'View Recent Activity'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Rating History Display */}
      {showHistory && ratingHistory.length > 0 && (
        <div className="mt-6 bg-amber-600/20 rounded-lg p-4 border border-amber-500/30">
          <h5 className="text-lg font-semibold text-amber-200 mb-4 flex items-center">
            <span className="text-xl mr-2">📈</span>
            Rating History
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratingHistory
              .filter(variant => variant.points.length > 0)
              .map((variant) => {
                const latestRating = variant.points[variant.points.length - 1][3];
                const firstRating = variant.points[0][3];
                const ratingChange = latestRating - firstRating;
                const progressPercentage = Math.min(100, Math.max(0, ((latestRating - 800) / (2400 - 800)) * 100));

                return (
                  <div key={variant.name} className="bg-amber-700/30 rounded p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">
                          {variant.name === 'Bullet' ? '•' : 
                           variant.name === 'Blitz' ? '⚔️' : 
                           variant.name === 'Rapid' ? '🏃' : 
                           variant.name === 'Classical' ? '⬛' : 
                           variant.name === 'Puzzles' ? '🧩' : '♞'}
                        </span>
                        <span className="font-semibold text-amber-200">{variant.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-amber-100">{latestRating}</div>
                        <div className={`text-xs ${ratingChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {ratingChange >= 0 ? '+' : ''}{ratingChange}
                        </div>
                      </div>
                    </div>

                    {/* Simple Visual Rating Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-amber-800/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-amber-300 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-amber-400 mt-1">
                        <span>800</span>
                        <span>{latestRating}</span>
                        <span>2400+</span>
                      </div>
                    </div>

                    {/* Rating Timeline */}
                    <div className="space-y-1">
                      <div className="text-xs text-amber-400 mb-2">Recent History:</div>
                      {variant.points.slice(-3).map((point, index) => {
                        const [year, month, day, rating] = point;
                        const date = new Date(year, month - 1, day).toLocaleDateString();
                        return (
                          <div key={index} className="flex justify-between text-xs">
                            <span className="text-amber-300">{date}</span>
                            <span className="text-amber-100 font-medium">{rating}</span>
                          </div>
                        );
                      })}
                      {variant.points.length > 3 && (
                        <div className="text-xs text-amber-500 text-center">
                          ... and {variant.points.length - 3} more data points
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* User Activity Display */}
      {showActivity && userActivity.length > 0 && (
        <div className="mt-6 bg-purple-600/20 rounded-lg p-4 border border-purple-500/30">
          <h5 className="text-lg font-semibold text-purple-200 mb-4 flex items-center">
            <span className="text-xl mr-2">📅</span>
            Recent Activity Timeline
          </h5>
          <div className="space-y-4">
            {userActivity.map((activity, index) => {
              const startDate = new Date(activity.interval.start);
              const endDate = new Date(activity.interval.end);
              const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
              const isToday = daysDiff === 0 && startDate.toDateString() === new Date().toDateString();
              
              return (
                <div key={index} className="bg-purple-700/30 rounded-lg p-4 border border-purple-600/50">
                  {/* Time Period Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">
                        {isToday ? '📍' : daysDiff === 1 ? '🕐' : '📆'}
                      </span>
                      <span className="font-semibold text-purple-100">
                        {isToday ? 'Today' : daysDiff === 1 ? 'Yesterday' : `${daysDiff + 1} days ago`}
                      </span>
                    </div>
                    <span className="text-xs text-purple-300">
                      {startDate.toLocaleDateString()}
                    </span>
                  </div>

                  {/* Games Activity */}
                  {activity.games && Object.keys(activity.games).length > 0 && (
                    <div className="mb-3">
                      <h6 className="text-sm font-semibold text-purple-200 mb-2 flex items-center">
                        <span className="mr-1">🎮</span>
                        Games Played
                      </h6>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(activity.games).map(([variant, stats]) => (
                          <div key={variant} className="bg-purple-600/20 rounded p-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-sm mr-2">
                                {variant === 'bullet' ? '•' : 
                                 variant === 'blitz' ? '⚔️' : 
                                 variant === 'rapid' ? '🏃' : 
                                 variant === 'classical' ? '⬛' : '♞'}
                              </span>
                              <span className="text-sm font-medium text-purple-100 capitalize">{variant}</span>
                            </div>
                            <div className="text-xs text-purple-200">
                              <span className="text-green-400">{stats.win}W</span>
                              <span className="mx-1">-</span>
                              <span className="text-red-400">{stats.loss}L</span>
                              {stats.draw > 0 && (
                                <>
                                  <span className="mx-1">-</span>
                                  <span className="text-yellow-400">{stats.draw}D</span>
                                </>
                              )}
                              <div className={`text-xs ${stats.rp.after >= stats.rp.before ? 'text-green-400' : 'text-red-400'}`}>
                                {stats.rp.before} → {stats.rp.after} 
                                ({stats.rp.after >= stats.rp.before ? '+' : ''}{stats.rp.after - stats.rp.before})
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Puzzles Activity */}
                  {activity.puzzles && (
                    <div className="mb-3">
                      <h6 className="text-sm font-semibold text-purple-200 mb-2 flex items-center">
                        <span className="mr-1">🧩</span>
                        Puzzle Training
                      </h6>
                      <div className="bg-purple-600/20 rounded p-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-sm mr-2">🧩</span>
                          <span className="text-sm font-medium text-purple-100">Puzzles</span>
                        </div>
                        <div className="text-xs text-purple-200">
                          <span className="text-green-400">{activity.puzzles.score.win}W</span>
                          <span className="mx-1">-</span>
                          <span className="text-red-400">{activity.puzzles.score.loss}L</span>
                          <div className={`text-xs ${activity.puzzles.score.rp.after >= activity.puzzles.score.rp.before ? 'text-green-400' : 'text-red-400'}`}>
                            {activity.puzzles.score.rp.before} → {activity.puzzles.score.rp.after}
                            ({activity.puzzles.score.rp.after >= activity.puzzles.score.rp.before ? '+' : ''}{activity.puzzles.score.rp.after - activity.puzzles.score.rp.before})
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Social Activity */}
                  {activity.follows?.in && activity.follows.in.ids.length > 0 && (
                    <div>
                      <h6 className="text-sm font-semibold text-purple-200 mb-2 flex items-center">
                        <span className="mr-1">👥</span>
                        New Followers
                      </h6>
                      <div className="bg-purple-600/20 rounded p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-purple-100">
                            {activity.follows.in.ids.length} new follower{activity.follows.in.ids.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-xs text-purple-300">
                            {activity.follows.in.ids.slice(0, 2).join(', ')}
                            {activity.follows.in.ids.length > 2 && ` +${activity.follows.in.ids.length - 2} more`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Performance Stats Display */}
      {showPerformance && performanceStats && (
        <div className="mt-6 bg-green-600/20 rounded-lg p-4 border border-green-500/30">
          <h5 className="text-lg font-semibold text-green-200 mb-4 flex items-center">
            <span className="text-xl mr-2">
              {performanceStats.stat.perfType.key === 'bullet' ? '•' : 
               performanceStats.stat.perfType.key === 'blitz' ? '⚔️' : 
               performanceStats.stat.perfType.key === 'rapid' ? '🏃' : 
               performanceStats.stat.perfType.key === 'classical' ? '⬛' : 
               performanceStats.stat.perfType.key === 'correspondence' ? '📬' : 
               performanceStats.stat.perfType.key === 'chess960' ? '🎲' : 
               performanceStats.stat.perfType.key === 'puzzle' ? '🧩' : '♞'}
            </span>
            {performanceStats.stat.perfType.name} Performance Details
          </h5>
          
          {/* Header Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-700/30 rounded-lg p-4 text-center border border-green-600/50">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-green-100">{performanceStats.perf.glicko.rating}</div>
              <div className="text-xs text-green-300">Current Rating</div>
              <div className="text-xs text-green-400">±{Math.round(performanceStats.perf.glicko.deviation)}</div>
            </div>
            <div className="bg-green-700/30 rounded-lg p-4 text-center border border-green-600/50">
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-green-100">#{performanceStats.rank}</div>
              <div className="text-xs text-green-300">Global Rank</div>
              <div className="text-xs text-green-400">{performanceStats.percentile}th percentile</div>
            </div>
            <div className="bg-green-700/30 rounded-lg p-4 text-center border border-green-600/50">
              <div className="text-3xl mb-2">🎮</div>
              <div className="text-2xl font-bold text-green-100">{performanceStats.perf.nb}</div>
              <div className="text-xs text-green-300">Games Played</div>
              <div className={`text-xs ${performanceStats.perf.progress >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {performanceStats.perf.progress >= 0 ? '+' : ''}{performanceStats.perf.progress}
              </div>
            </div>
            <div className="bg-green-700/30 rounded-lg p-4 text-center border border-green-600/50">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-green-100">
                {Math.floor(performanceStats.stat.count.seconds / 3600)}h
              </div>
              <div className="text-xs text-green-300">Time Played</div>
              <div className="text-xs text-green-400">
                {Math.round(performanceStats.stat.count.seconds / performanceStats.stat.count.all)}s avg
              </div>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Game Results */}
            <div className="bg-green-700/20 rounded-lg p-4">
              <h6 className="text-md font-semibold text-green-200 mb-3 flex items-center">
                <span className="mr-2">🏆</span>
                Game Results
              </h6>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-300 flex items-center">
                    <span className="w-3 h-3 bg-green-400 rounded mr-2"></span>
                    Wins
                  </span>
                  <span className="text-green-100 font-semibold">
                    {performanceStats.stat.count.win} ({Math.round((performanceStats.stat.count.win / performanceStats.stat.count.all) * 100)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-300 flex items-center">
                    <span className="w-3 h-3 bg-red-400 rounded mr-2"></span>
                    Losses
                  </span>
                  <span className="text-green-100 font-semibold">
                    {performanceStats.stat.count.loss} ({Math.round((performanceStats.stat.count.loss / performanceStats.stat.count.all) * 100)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-300 flex items-center">
                    <span className="w-3 h-3 bg-yellow-400 rounded mr-2"></span>
                    Draws
                  </span>
                  <span className="text-green-100 font-semibold">
                    {performanceStats.stat.count.draw} ({Math.round((performanceStats.stat.count.draw / performanceStats.stat.count.all) * 100)}%)
                  </span>
                </div>
                <div className="pt-2 border-t border-green-600/50">
                  <div className="flex items-center justify-between">
                    <span className="text-green-300">Rated Games</span>
                    <span className="text-green-100 font-semibold">
                      {performanceStats.stat.count.rated} ({Math.round((performanceStats.stat.count.rated / performanceStats.stat.count.all) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Streaks & Performance */}
            <div className="bg-green-700/20 rounded-lg p-4">
              <h6 className="text-md font-semibold text-green-200 mb-3 flex items-center">
                <span className="mr-2">🔥</span>
                Streaks & Performance
              </h6>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-green-300">Current Win Streak</span>
                  <span className="text-green-100 font-semibold">{performanceStats.stat.resultStreak.win.cur.v}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-300">Best Win Streak</span>
                  <span className="text-green-100 font-semibold">{performanceStats.stat.resultStreak.win.max.v}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-300">Tournament Games</span>
                  <span className="text-green-100 font-semibold">{performanceStats.stat.count.tour}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-300">Berserk Games</span>
                  <span className="text-green-100 font-semibold">{performanceStats.stat.count.berserk}</span>
                </div>
                <div className="pt-2 border-t border-green-600/50">
                  <div className="flex items-center justify-between">
                    <span className="text-green-300">Disconnects</span>
                    <span className={`font-semibold ${performanceStats.stat.count.disconnects > 5 ? 'text-red-400' : 'text-green-100'}`}>
                      {performanceStats.stat.count.disconnects}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Play Streaks */}
          <div className="mt-4 bg-green-700/20 rounded-lg p-4">
            <h6 className="text-md font-semibold text-green-200 mb-3 flex items-center">
              <span className="mr-2">📅</span>
              Play Patterns
            </h6>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-100">{performanceStats.stat.playStreak.nb.cur.v}</div>
                <div className="text-xs text-green-300">Current Session</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-100">{performanceStats.stat.playStreak.nb.max.v}</div>
                <div className="text-xs text-green-300">Longest Session</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-100">
                  {Math.floor(performanceStats.stat.playStreak.time.cur.v / 60)}m
                </div>
                <div className="text-xs text-green-300">Current Time</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-100">
                  {Math.floor(performanceStats.stat.playStreak.time.max.v / 60)}m
                </div>
                <div className="text-xs text-green-300">Max Session Time</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Games Export Section */}
      {userProfile && (
        <div className="mt-6 bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-2">📥</span>
            <h4 className="text-xl font-bold">Export {userProfile.username}'s Games</h4>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-amber-300">
              Download detailed game data with comprehensive analysis and statistics
            </p>
            <p className="text-amber-400 text-sm mt-1">
              Includes PGN moves, clock times, analysis, openings, accuracy ratings, and more
            </p>
          </div>

          {/* Export Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Recent Games */}
            <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <h6 className="text-amber-200 font-semibold mb-2 flex items-center">
                <span className="mr-2">🕒</span>
                Recent Games
              </h6>
              <p className="text-amber-300 text-sm mb-3">Last 50 games with full data</p>
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/lichess/games/user/${userProfile.username}?max=50`);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${userProfile.username}_recent_50_games.json`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } catch (error) {
                    console.error('Export failed:', error);
                  }
                }}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2 px-3 rounded-lg font-medium transition-all duration-300 text-sm"
              >
                Export Recent
              </button>
            </div>

            {/* Rated Games Only */}
            <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <h6 className="text-amber-200 font-semibold mb-2 flex items-center">
                <span className="mr-2">⭐</span>
                Rated Games
              </h6>
              <p className="text-amber-300 text-sm mb-3">Last 100 rated games only</p>
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/lichess/games/user/${userProfile.username}?max=100&rated=true`);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${userProfile.username}_rated_100_games.json`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } catch (error) {
                    console.error('Export failed:', error);
                  }
                }}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2 px-3 rounded-lg font-medium transition-all duration-300 text-sm"
              >
                Export Rated
              </button>
            </div>

            {/* All Games */}
            <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <h6 className="text-amber-200 font-semibold mb-2 flex items-center">
                <span className="mr-2">📊</span>
                Complete History
              </h6>
              <p className="text-amber-300 text-sm mb-3">All games (may be large)</p>
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/lichess/games/user/${userProfile.username}`);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${userProfile.username}_all_games.json`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  } catch (error) {
                    console.error('Export failed:', error);
                  }
                }}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white py-2 px-3 rounded-lg font-medium transition-all duration-300 text-sm"
              >
                Export All
              </button>
            </div>
          </div>

          {/* Data Information */}
          <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
            <h6 className="text-amber-200 font-semibold mb-2 flex items-center">
              <span className="mr-2">📋</span>
              Included Data
            </h6>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="text-amber-300">✓ PGN Moves</div>
              <div className="text-amber-300">✓ Clock Times</div>
              <div className="text-amber-300">✓ Engine Analysis</div>
              <div className="text-amber-300">✓ Accuracy Ratings</div>
              <div className="text-amber-300">✓ Opening Names</div>
              <div className="text-amber-300">✓ Game Divisions</div>
              <div className="text-amber-300">✓ Final Positions</div>
              <div className="text-amber-300">✓ Bookmarked Status</div>
            </div>
            <div className="mt-2 text-xs text-amber-400">
              All exports include comprehensive game metadata and analysis when available.
            </div>
          </div>
        </div>
      )}

      {/* User Created Tournaments Section */}
      {userProfile && (
        <UserCreatedTournaments username={userProfile.username} />
      )}

      {/* User Played Tournaments Section */}
      {userProfile && (
        <UserPlayedTournaments username={userProfile.username} />
      )}

      {/* User Teams Section */}
      {userProfile && (
        <UserTeams username={userProfile.username} />
      )}

      {/* Empty State */}
      {!loading && !error && !userProfile && (
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">🔍</span>
          <p className="text-amber-300">Enter a username to search for a Lichess profile</p>
        </div>
      )}
    </div>
  );
}