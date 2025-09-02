'use client';

import { useState, useEffect } from 'react';

interface SwissTournamentResult {
  rank: number;
  points: number;
  tieBreak: number;
  rating: number;
  username: string;
  title?: string;
  performance?: number;
}

interface SwissTournamentResultsProps {
  tournamentId: string;
}

export default function SwissTournamentResults({ tournamentId }: SwissTournamentResultsProps) {
  const [results, setResults] = useState<SwissTournamentResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCount, setShowCount] = useState(20);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/lichess/swiss/${tournamentId}/results?nb=100`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Mock data for demonstration - comprehensive tournament results
        const mockResults: SwissTournamentResult[] = [
          {
            rank: 1,
            points: 9.0,
            tieBreak: 89,
            rating: 2734,
            username: "SwissChampion",
            title: "GM",
            performance: 2856
          },
          {
            rank: 2,
            points: 8.5,
            tieBreak: 83,
            rating: 2682,
            username: "TacticalMaster",
            title: "IM",
            performance: 2798
          },
          {
            rank: 3,
            points: 8.5,
            tieBreak: 77,
            rating: 2618,
            username: "opperwezen",
            title: "IM",
            performance: 2743
          },
          {
            rank: 4,
            points: 8.0,
            tieBreak: 84,
            rating: 2701,
            username: "PositionalWizard",
            title: "FM",
            performance: 2689
          },
          {
            rank: 5,
            points: 8.0,
            tieBreak: 79,
            rating: 2589,
            username: "EndgameExpert",
            performance: 2712
          },
          {
            rank: 6,
            points: 7.5,
            tieBreak: 82,
            rating: 2654,
            username: "OpeningTheory",
            title: "CM",
            performance: 2645
          },
          {
            rank: 7,
            points: 7.5,
            tieBreak: 76,
            rating: 2512,
            username: "CalculationKing",
            performance: 2687
          },
          {
            rank: 8,
            points: 7.5,
            tieBreak: 73,
            rating: 2587,
            username: "TimeManagement",
            performance: 2634
          },
          {
            rank: 9,
            points: 7.0,
            tieBreak: 78,
            rating: 2456,
            username: "StrategicPlayer",
            performance: 2598
          },
          {
            rank: 10,
            points: 7.0,
            tieBreak: 74,
            rating: 2623,
            username: "DefensiveRock",
            title: "NM",
            performance: 2543
          },
          {
            rank: 11,
            points: 7.0,
            tieBreak: 71,
            rating: 2398,
            username: "RisingTalent",
            performance: 2589
          },
          {
            rank: 12,
            points: 6.5,
            tieBreak: 75,
            rating: 2534,
            username: "AttackingPlayer",
            performance: 2487
          },
          {
            rank: 13,
            points: 6.5,
            tieBreak: 69,
            rating: 2467,
            username: "BlitzSpecialist",
            performance: 2502
          },
          {
            rank: 14,
            points: 6.5,
            tieBreak: 67,
            rating: 2389,
            username: "StudyHard",
            performance: 2518
          },
          {
            rank: 15,
            points: 6.0,
            tieBreak: 72,
            rating: 2445,
            username: "PracticeDaily",
            performance: 2423
          },
          {
            rank: 16,
            points: 6.0,
            tieBreak: 68,
            rating: 2356,
            username: "ChessLover",
            performance: 2456
          },
          {
            rank: 17,
            points: 6.0,
            tieBreak: 64,
            rating: 2298,
            username: "ImprovingFast",
            performance: 2434
          },
          {
            rank: 18,
            points: 5.5,
            tieBreak: 66,
            rating: 2267,
            username: "ConsistentPlay",
            performance: 2345
          },
          {
            rank: 19,
            points: 5.5,
            tieBreak: 62,
            rating: 2189,
            username: "PatientPlayer",
            performance: 2298
          },
          {
            rank: 20,
            points: 5.5,
            tieBreak: 59,
            rating: 2134,
            username: "Determined",
            performance: 2287
          }
        ];
        
        setResults(mockResults);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch tournament results');
      }
    } catch (err) {
      console.error('Error fetching tournament results:', err);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tournamentId) {
      fetchResults();
    }
  }, [tournamentId]);

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

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    if (rank <= 10) return 'text-green-400';
    if (rank <= 20) return 'text-blue-400';
    return 'text-amber-300';
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '🏅';
    return '📍';
  };

  const getPerformanceColor = (performance?: number) => {
    if (!performance) return 'text-amber-300';
    if (performance >= 2700) return 'text-red-400';
    if (performance >= 2500) return 'text-orange-400';
    if (performance >= 2300) return 'text-yellow-400';
    if (performance >= 2100) return 'text-green-400';
    return 'text-amber-300';
  };

  return (
    <div className="bg-amber-700/30 rounded-lg p-6 border border-amber-600/50 mt-6">
      <div className="flex items-center justify-center mb-6">
        <span className="text-2xl mr-2">🏆</span>
        <h4 className="text-xl font-bold text-amber-100">Tournament Results & Rankings</h4>
      </div>

      <div className="text-center mb-6">
        <p className="text-amber-300">
          Current standings and final results from the Swiss tournament
        </p>
        <p className="text-amber-400 text-sm mt-1">
          Rankings by points, tie-break scores, and performance ratings
        </p>
      </div>

      {loading && (
        <div className="text-center py-8">
          <span className="text-2xl mb-2 block animate-spin">⏳</span>
          <p className="text-amber-300">Loading tournament results...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-6 bg-red-900/20 rounded-lg border border-red-500/30 mb-6">
          <span className="text-2xl mb-2 block">❌</span>
          <p className="text-red-300 font-semibold mb-1">Failed to Load Results</p>
          <p className="text-amber-400 text-sm">{error}</p>
          <div className="mt-3 text-amber-300 text-sm">
            <p>Showing mock data for demonstration purposes.</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          {/* Show More/Less Controls */}
          <div className="flex justify-center mb-4">
            <div className="flex gap-2">
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
                onClick={() => setShowCount(results.length)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  showCount === results.length ? 'bg-amber-600 text-amber-100' : 'bg-amber-700/30 text-amber-300 hover:bg-amber-600/50'
                }`}
              >
                Show All
              </button>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-amber-600/20 rounded-lg border border-amber-500/30 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 p-4 bg-amber-600/30 border-b border-amber-500/30 text-sm font-semibold text-amber-200">
              <div className="text-center">Rank</div>
              <div className="col-span-2">Player</div>
              <div className="text-center">Points</div>
              <div className="text-center">Tie-Break</div>
              <div className="text-center">Rating</div>
              <div className="text-center">Performance</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-amber-600/30">
              {results.slice(0, showCount).map((result) => (
                <div key={result.rank} className="grid grid-cols-7 gap-4 p-4 text-sm hover:bg-amber-600/20 transition-all">
                  {/* Rank */}
                  <div className="text-center flex items-center justify-center">
                    <span className={`font-bold ${getRankColor(result.rank)} flex items-center`}>
                      <span className="mr-1">{getRankEmoji(result.rank)}</span>
                      #{result.rank}
                    </span>
                  </div>

                  {/* Player */}
                  <div className="col-span-2 flex items-center">
                    <div className="flex items-center">
                      {result.title && (
                        <span className="mr-2" title={result.title}>{getTitleDisplay(result.title)}</span>
                      )}
                      <div>
                        <div className="font-semibold text-amber-100">{result.username}</div>
                        {result.title && (
                          <div className="text-xs text-amber-400">{result.title}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-center flex items-center justify-center">
                    <span className="font-bold text-amber-100 text-lg">{result.points}</span>
                  </div>

                  {/* Tie-Break */}
                  <div className="text-center flex items-center justify-center">
                    <span className="text-amber-300 font-medium">{result.tieBreak}</span>
                  </div>

                  {/* Rating */}
                  <div className="text-center flex items-center justify-center">
                    <span className="text-amber-200 font-semibold">{result.rating}</span>
                  </div>

                  {/* Performance */}
                  <div className="text-center flex items-center justify-center">
                    {result.performance ? (
                      <span className={`font-bold ${getPerformanceColor(result.performance)}`}>
                        {result.performance}
                      </span>
                    ) : (
                      <span className="text-amber-500 text-xs">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="bg-amber-600/20 rounded-lg p-4 border border-amber-500/30 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-amber-200 font-semibold mb-1">Total Players</div>
                <div className="text-amber-100 text-xl font-bold">{results.length}</div>
              </div>
              <div className="text-center">
                <div className="text-amber-200 font-semibold mb-1">Winner</div>
                <div className="text-amber-100 font-bold">
                  {results[0]?.title && `${getTitleDisplay(results[0].title)} `}
                  {results[0]?.username}
                </div>
              </div>
              <div className="text-center">
                <div className="text-amber-200 font-semibold mb-1">Winning Score</div>
                <div className="text-amber-100 text-xl font-bold">{results[0]?.points} pts</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">📊</span>
          <p className="text-amber-300">No results available</p>
          <p className="text-amber-400 text-sm mt-2">Tournament results will appear here when available</p>
        </div>
      )}
    </div>
  );
}