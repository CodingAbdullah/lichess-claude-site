'use client';

import { useState, useEffect } from 'react';
import LichessNavbar from '../components/LichessNavbar';

interface UserStats {
  id: string;
  username: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    country?: string;
    bio?: string;
  };
  perfs: {
    [key: string]: {
      rating: number;
      rd: number;
      prog: number;
      games: number;
    };
  };
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
  };
}

interface RecentGames {
  id: string;
  rated: boolean;
  variant: string;
  speed: string;
  perf: string;
  createdAt: number;
  lastMoveAt: number;
  status: string;
  players: {
    white: { user: { name: string }; rating: number };
    black: { user: { name: string }; rating: number };
  };
  winner?: string;
}

export default function LichessProfilePage() {
  const [username, setUsername] = useState('');
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentGames, setRecentGames] = useState<RecentGames[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserData = async (user: string) => {
    if (!user.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const [userRes, gamesRes] = await Promise.all([
        fetch(`https://lichess.org/api/user/${user}`),
        fetch(`https://lichess.org/api/games/user/${user}?max=10&pgnInJson=false`)
      ]);

      if (!userRes.ok) {
        throw new Error('User not found');
      }

      const userData = await userRes.json();
      setUserStats(userData);

      if (gamesRes.ok) {
        const gamesText = await gamesRes.text();
        const games = gamesText.split('\n\n').filter(g => g.trim()).slice(0, 5);
        setRecentGames(games.map((game, index) => ({
          id: `game-${index}`,
          rated: true,
          variant: 'standard',
          speed: 'blitz',
          perf: 'blitz',
          createdAt: Date.now(),
          lastMoveAt: Date.now(),
          status: 'mate',
          players: {
            white: { user: { name: 'Player1' }, rating: 1500 },
            black: { user: { name: 'Player2' }, rating: 1500 }
          }
        })));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      setUserStats(null);
      setRecentGames([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUserData(username);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    return `${hours}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 2400) return 'text-purple-300';
    if (rating >= 2200) return 'text-red-300';
    if (rating >= 2000) return 'text-orange-300';
    if (rating >= 1800) return 'text-yellow-300';
    if (rating >= 1600) return 'text-green-300';
    if (rating >= 1400) return 'text-blue-300';
    return 'text-amber-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Navigation */}
      <LichessNavbar />
      
      {/* Chess Board Pattern Background */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-conic-gradient(#8b4513 0% 25%, #d4a574 25% 50%)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <span className="text-6xl mr-4">♟️</span>
            <h1 className="text-5xl font-bold text-amber-900 drop-shadow-lg">Lichess Profile Lookup</h1>
            <span className="text-6xl ml-4">♟️</span>
          </div>
          <p className="text-xl text-amber-800">Search for any Lichess user's profile and statistics</p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-semibold mb-2 text-amber-200 flex items-center">
                <span className="text-xl mr-2">🔍</span>
                Lichess Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50 font-medium"
                placeholder="Enter username..."
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
              {loading ? 'Searching...' : 'Search Profile'}
            </button>
          </form>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-gradient-to-br from-red-800 to-red-900 border-4 border-red-600 rounded-2xl p-4 text-center shadow-2xl">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl mr-2">⚠️</span>
                <p className="text-red-200 font-semibold">{error}</p>
              </div>
            </div>
          </div>
        )}

        {userStats && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* User Info */}
            <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-3">👑</span>
                  <h2 className="text-4xl font-bold text-amber-100">{userStats.username}</h2>
                  <span className="text-4xl ml-3">👑</span>
                </div>
                {userStats.profile?.firstName && userStats.profile?.lastName && (
                  <p className="text-xl text-amber-200 mb-2">
                    {userStats.profile.firstName} {userStats.profile.lastName}
                  </p>
                )}
                {userStats.profile?.country && (
                  <p className="text-amber-300 flex items-center justify-center">
                    <span className="mr-2">🌍</span>
                    {userStats.profile.country}
                  </p>
                )}
                {userStats.profile?.bio && (
                  <p className="text-amber-200 mt-4 italic bg-amber-700/30 rounded-lg p-3 border border-amber-600/50">
                    "{userStats.profile.bio}"
                  </p>
                )}
              </div>

              {/* Overall Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                  <div className="text-3xl mb-2">🎯</div>
                  <div className="text-3xl font-bold text-amber-100">{userStats.count.all}</div>
                  <div className="text-amber-300 font-semibold">Total Games</div>
                </div>
                <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-3xl font-bold text-green-400">{userStats.count.win}</div>
                  <div className="text-amber-300 font-semibold">Wins</div>
                </div>
                <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                  <div className="text-3xl mb-2">💔</div>
                  <div className="text-3xl font-bold text-red-400">{userStats.count.loss}</div>
                  <div className="text-amber-300 font-semibold">Losses</div>
                </div>
                <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                  <div className="text-3xl mb-2">🤝</div>
                  <div className="text-3xl font-bold text-yellow-400">{userStats.count.draw}</div>
                  <div className="text-amber-300 font-semibold">Draws</div>
                </div>
              </div>

              <div className="mt-6 text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-2">⏱️</span>
                  <p className="text-amber-200 text-lg font-semibold">
                    Total Play Time: {formatTime(userStats.playTime.total)}
                  </p>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
              <div className="flex items-center justify-center mb-6">
                <span className="text-3xl mr-2">📊</span>
                <h3 className="text-2xl font-bold">Ratings</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(userStats.perfs)
                  .filter(([_, perf]) => perf.games > 0)
                  .map(([variant, perf]) => (
                    <div key={variant} className="bg-amber-700/30 rounded-lg p-4 text-center border border-amber-600/50">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-2xl mr-2">
                          {variant === 'bullet' ? '•' : 
                           variant === 'ultraBullet' ? '💥' : 
                           variant === 'blitz' ? '⚔️' : 
                           variant === 'rapid' ? '🏃' : 
                           variant === 'classical' ? '⬛' : 
                           variant === 'correspondence' ? '📬' : '♞'}
                        </span>
                        <h4 className="font-semibold capitalize text-amber-200">{variant}</h4>
                      </div>
                      <div className={`text-3xl font-bold mb-2 ${getPerformanceColor(perf.rating).replace('text-', 'text-')}`}>
                        {perf.rating}
                      </div>
                      <div className="text-sm text-amber-300 mb-1">
                        🎮 {perf.games} games • 📈 RD: {perf.rd}
                      </div>
                      {perf.prog !== 0 && (
                        <div className={`text-sm font-semibold flex items-center justify-center ${perf.prog > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <span className="mr-1">{perf.prog > 0 ? '📈' : '📉'}</span>
                          {perf.prog > 0 ? '+' : ''}{perf.prog}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {/* Win Rate Analysis */}
            <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
              <div className="flex items-center justify-center mb-6">
                <span className="text-3xl mr-2">📈</span>
                <h3 className="text-2xl font-bold">Performance Analysis</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center bg-amber-700/30 rounded-lg p-6 border border-amber-600/50">
                  <div className="text-4xl mb-3">🏆</div>
                  <div className="text-4xl font-bold text-green-400 mb-2">
                    {((userStats.count.win / userStats.count.all) * 100).toFixed(1)}%
                  </div>
                  <div className="text-amber-300 font-semibold">Win Rate</div>
                </div>
                <div className="text-center bg-amber-700/30 rounded-lg p-6 border border-amber-600/50">
                  <div className="text-4xl mb-3">🤝</div>
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    {((userStats.count.draw / userStats.count.all) * 100).toFixed(1)}%
                  </div>
                  <div className="text-amber-300 font-semibold">Draw Rate</div>
                </div>
                <div className="text-center bg-amber-700/30 rounded-lg p-6 border border-amber-600/50">
                  <div className="text-4xl mb-3">⭐</div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {((userStats.count.rated / userStats.count.all) * 100).toFixed(1)}%
                  </div>
                  <div className="text-amber-300 font-semibold">Rated Games</div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <a 
            href="/stats" 
            className="inline-flex items-center bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-amber-500"
          >
            <span className="text-2xl mr-2">📊</span>
            View General Lichess Stats
          </a>
        </div>
      </div>
    </div>
  );
}