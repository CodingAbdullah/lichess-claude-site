'use client';

import { useState } from 'react';

interface FidePlayer {
  id: number;
  name: string;
  federation?: string;
  year?: number;
  title?: string;
  standard?: number;
  rapid?: number;
  blitz?: number;
}

export default function FidePlayerSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FidePlayer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch(`/api/lichess/fide/player?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Search failed');
        setResults([]);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again later.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
      <div className="flex items-center justify-center mb-6">
        <span className="text-3xl mr-2">🏆</span>
        <h2 className="text-2xl font-bold">FIDE Player Search</h2>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-amber-300 text-lg">
          Search for FIDE-rated chess players worldwide
        </p>
        <p className="text-amber-400 text-sm mt-2">
          Find official ratings, titles, and federation information
        </p>
      </div>

      {/* Search Interface */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search FIDE players (e.g., Magnus Carlsen, Ding Liren)"
              className="w-full px-4 py-3 rounded-lg bg-amber-700/30 border border-amber-600/50 text-amber-100 placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-700 disabled:to-amber-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-amber-500"
          >
            🔍 {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {/* Search Tips */}
        <div className="mt-4 text-center">
          <p className="text-amber-400 text-sm">
            💡 Try searching: "Magnus Carlsen", "Ding Liren", "Ju Wenjun", or any FIDE player name
          </p>
        </div>
      </div>

      {/* Results Container */}
      <div className="min-h-[100px]">
        {loading && (
          <div className="text-center py-8">
            <span className="text-2xl mb-2 block">⏳</span>
            <p className="text-amber-300">Searching FIDE database...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <span className="text-2xl mb-2 block">❌</span>
            <p className="text-red-300">Search failed</p>
            <p className="text-amber-400 text-sm mt-2">{error}</p>
          </div>
        )}

        {searched && !loading && !error && results.length === 0 && (
          <div className="text-center py-8">
            <span className="text-2xl mb-2 block">🔍</span>
            <p className="text-amber-300">No FIDE players found for &quot;{query}&quot;</p>
            <p className="text-amber-400 text-sm mt-2">Try a different search term or check spelling</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((player) => (
              <div key={player.id} className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="text-center space-y-3">
                  <div className="mb-3">
                    <h5 className="text-lg font-bold text-amber-100">{player.name}</h5>
                    {player.title && (
                      <span className="inline-block mt-1 px-2 py-1 bg-amber-600/40 text-amber-100 text-xs rounded">
                        {player.title}
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-amber-300">FIDE ID:</span>
                      <div className="text-amber-100 font-medium">{player.id}</div>
                    </div>
                    <div>
                      <span className="text-amber-300">Federation:</span>
                      <div className="text-amber-100 font-medium">{player.federation || 'N/A'}</div>
                    </div>
                  </div>
                  
                  {player.year && (
                    <div className="text-sm">
                      <span className="text-amber-300">Birth Year:</span>
                      <span className="text-amber-100 font-medium ml-2">{player.year}</span>
                    </div>
                  )}
                  
                  {(player.standard || player.rapid || player.blitz) ? (
                    <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                      <h6 className="text-amber-200 font-semibold mb-2 text-center">FIDE Ratings</h6>
                      <div className="space-y-2">
                        {player.standard && (
                          <div className="flex items-center justify-between">
                            <span className="text-amber-300 flex items-center">
                              <span className="mr-1">⬛</span>
                              Standard
                            </span>
                            <span className="text-amber-100 font-semibold">{player.standard}</span>
                          </div>
                        )}
                        {player.rapid && (
                          <div className="flex items-center justify-between">
                            <span className="text-amber-300 flex items-center">
                              <span className="mr-1">🏃</span>
                              Rapid
                            </span>
                            <span className="text-amber-100 font-semibold">{player.rapid}</span>
                          </div>
                        )}
                        {player.blitz && (
                          <div className="flex items-center justify-between">
                            <span className="text-amber-300 flex items-center">
                              <span className="mr-1">⚡</span>
                              Blitz
                            </span>
                            <span className="text-amber-100 font-semibold">{player.blitz}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <span className="text-amber-400 text-sm">No ratings available</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!searched && !loading && (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">🏆</span>
            <p className="text-amber-300">Enter a player name to search FIDE database</p>
            <p className="text-amber-400 text-sm mt-2">Search for world champions, grandmasters, and chess professionals</p>
          </div>
        )}
      </div>
    </div>
  );
}