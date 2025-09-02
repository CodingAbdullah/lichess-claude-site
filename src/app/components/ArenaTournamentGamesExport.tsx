'use client';

import { useState } from 'react';

interface ExportOptions {
  moves: boolean;
  pgnInJson: boolean;
  tags: boolean;
  clocks: boolean;
  evals: boolean;
  accuracy: boolean;
  opening: boolean;
  division: boolean;
}

interface GameData {
  id: string;
  rated: boolean;
  variant: string;
  speed: string;
  perf: string;
  createdAt: number;
  lastMoveAt: number;
  status: string;
  players: {
    white: { user: { name: string; title?: string }; rating: number; ratingDiff?: number };
    black: { user: { name: string; title?: string }; rating: number; ratingDiff?: number };
  };
  winner?: string;
  opening?: { eco: string; name: string; ply: number };
  moves?: string;
  pgn?: string;
  clock?: { initial: number; increment: number };
  analysis?: any[];
  accuracy?: { white: number; black: number };
  division?: { middle?: number; end?: number };
}

export default function ArenaTournamentGamesExport() {
  const [tournamentId, setTournamentId] = useState('');
  const [playerFilter, setPlayerFilter] = useState('');
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    moves: true,
    pgnInJson: true,
    tags: true,
    clocks: true,
    evals: true,
    accuracy: true,
    opening: true,
    division: true,
  });
  const [games, setGames] = useState<GameData[]>([]);
  const [rawData, setRawData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchGames = async (id: string, player: string, options: ExportOptions) => {
    if (!id.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      if (player) params.append('player', player);
      Object.entries(options).forEach(([key, value]) => {
        params.append(key, value.toString());
      });

      const response = await fetch(`/api/lichess/tournament/${id}/games?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Tournament games not found');
      }

      const data = await response.json();
      setRawData(data);
      setGames(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tournament games');
      setGames([]);
      setRawData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGames(tournamentId, playerFilter, exportOptions);
  };

  const handleOptionChange = (option: keyof ExportOptions) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const selectAllOptions = () => {
    setExportOptions({
      moves: true,
      pgnInJson: true,
      tags: true,
      clocks: true,
      evals: true,
      accuracy: true,
      opening: true,
      division: true,
    });
  };

  const clearAllOptions = () => {
    setExportOptions({
      moves: false,
      pgnInJson: false,
      tags: false,
      clocks: false,
      evals: false,
      accuracy: false,
      opening: false,
      division: false,
    });
  };

  const downloadJSON = () => {
    if (!rawData) return;
    const blob = new Blob([JSON.stringify(rawData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arena_tournament_${tournamentId}_games.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getGameResult = (game: GameData, perspective: 'white' | 'black') => {
    if (!game.winner) return '½-½';
    return game.winner === perspective ? '1-0' : '0-1';
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Search Form */}
      <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl mr-2">📥</span>
          <h3 className="text-2xl font-bold">Arena Tournament Games Export</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tournament ID and Player Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Enter tournament ID..."
                required
              />
            </div>
            
            <div>
              <label htmlFor="playerFilter" className="block text-sm font-semibold mb-2 text-amber-200">
                Player Filter (Optional)
              </label>
              <input
                type="text"
                id="playerFilter"
                value={playerFilter}
                onChange={(e) => setPlayerFilter(e.target.value)}
                className="w-full px-4 py-3 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50 font-medium"
                placeholder="Filter by username..."
              />
            </div>
          </div>
          
          {/* Export Options */}
          <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-amber-200">Export Options</h4>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={selectAllOptions}
                  className="px-3 py-1 bg-amber-600/40 hover:bg-amber-600/60 rounded text-sm font-medium transition-colors"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={clearAllOptions}
                  className="px-3 py-1 bg-amber-600/40 hover:bg-amber-600/60 rounded text-sm font-medium transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <label className="flex items-center space-x-2 text-amber-200">
                <input
                  type="checkbox"
                  checked={exportOptions.moves}
                  onChange={() => handleOptionChange('moves')}
                  className="rounded focus:ring-amber-400"
                />
                <div>
                  <span className="text-sm font-medium">PGN Moves</span>
                  <div className="text-xs text-amber-300">Include game moves</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 text-amber-200">
                <input
                  type="checkbox"
                  checked={exportOptions.pgnInJson}
                  onChange={() => handleOptionChange('pgnInJson')}
                  className="rounded focus:ring-amber-400"
                />
                <div>
                  <span className="text-sm font-medium">PGN in JSON</span>
                  <div className="text-xs text-amber-300">Full PGN in response</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 text-amber-200">
                <input
                  type="checkbox"
                  checked={exportOptions.tags}
                  onChange={() => handleOptionChange('tags')}
                  className="rounded focus:ring-amber-400"
                />
                <div>
                  <span className="text-sm font-medium">PGN Tags</span>
                  <div className="text-xs text-amber-300">Include metadata tags</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 text-amber-200">
                <input
                  type="checkbox"
                  checked={exportOptions.clocks}
                  onChange={() => handleOptionChange('clocks')}
                  className="rounded focus:ring-amber-400"
                />
                <div>
                  <span className="text-sm font-medium">Clock Data</span>
                  <div className="text-xs text-amber-300">Time remaining info</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 text-amber-200">
                <input
                  type="checkbox"
                  checked={exportOptions.evals}
                  onChange={() => handleOptionChange('evals')}
                  className="rounded focus:ring-amber-400"
                />
                <div>
                  <span className="text-sm font-medium">Evaluations</span>
                  <div className="text-xs text-amber-300">Engine analysis</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 text-amber-200">
                <input
                  type="checkbox"
                  checked={exportOptions.accuracy}
                  onChange={() => handleOptionChange('accuracy')}
                  className="rounded focus:ring-amber-400"
                />
                <div>
                  <span className="text-sm font-medium">Accuracy</span>
                  <div className="text-xs text-amber-300">Move accuracy %</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 text-amber-200">
                <input
                  type="checkbox"
                  checked={exportOptions.opening}
                  onChange={() => handleOptionChange('opening')}
                  className="rounded focus:ring-amber-400"
                />
                <div>
                  <span className="text-sm font-medium">Opening Info</span>
                  <div className="text-xs text-amber-300">Opening names/ECO</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 text-amber-200">
                <input
                  type="checkbox"
                  checked={exportOptions.division}
                  onChange={() => handleOptionChange('division')}
                  className="rounded focus:ring-amber-400"
                />
                <div>
                  <span className="text-sm font-medium">Game Phases</span>
                  <div className="text-xs text-amber-300">Middle/endgame plies</div>
                </div>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-800 disabled:to-amber-900 px-4 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-amber-500 flex items-center justify-center"
          >
            <span className="text-xl mr-2">
              {loading ? '⏳' : '📥'}
            </span>
            {loading ? 'Exporting Games...' : 'Export Tournament Games'}
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

      {games.length > 0 && (
        <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-3xl mr-2">🎮</span>
              <h3 className="text-2xl font-bold">Tournament Games</h3>
              <span className="ml-4 bg-amber-600/40 px-3 py-1 rounded-full text-sm font-semibold">
                {games.length} games
              </span>
            </div>
            <button
              onClick={downloadJSON}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              <span className="text-lg mr-2">💾</span>
              Download JSON
            </button>
          </div>
          
          {/* Export Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-2xl font-bold text-amber-100">{games.length}</div>
              <div className="text-amber-300 font-semibold text-sm">Total Games</div>
            </div>
            <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <div className="text-2xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-amber-100">
                {games.filter(g => g.winner).length}
              </div>
              <div className="text-amber-300 font-semibold text-sm">Decisive Games</div>
            </div>
            <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <div className="text-2xl mb-2">🤝</div>
              <div className="text-2xl font-bold text-amber-100">
                {games.filter(g => !g.winner).length}
              </div>
              <div className="text-amber-300 font-semibold text-sm">Draws</div>
            </div>
            <div className="text-center bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <div className="text-2xl mb-2">⭐</div>
              <div className="text-2xl font-bold text-amber-100">
                {games.filter(g => g.rated).length}
              </div>
              <div className="text-amber-300 font-semibold text-sm">Rated Games</div>
            </div>
          </div>
          
          {/* Games List */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {games.slice(0, 20).map((game) => (
              <div key={game.id} className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">♟️</span>
                    <div>
                      <h4 className="font-semibold text-amber-100">Game #{game.id}</h4>
                      <div className="text-sm text-amber-300">
                        {game.variant} • {game.speed} • {formatTimestamp(game.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${game.rated ? 'text-green-400' : 'text-yellow-400'}`}>
                      {game.rated ? 'Rated' : 'Casual'}
                    </div>
                    <div className="text-sm text-amber-300">{game.status}</div>
                  </div>
                </div>
                
                {/* Players */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">♔</span>
                        <div>
                          <div className="font-semibold text-amber-100">
                            {game.players.white.user.title && <span className="text-purple-300">{game.players.white.user.title} </span>}
                            {game.players.white.user.name}
                          </div>
                          <div className="text-sm text-amber-300">White • {game.players.white.rating}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${game.winner === 'white' ? 'text-green-400' : game.winner === 'black' ? 'text-red-400' : 'text-yellow-400'}`}>
                          {getGameResult(game, 'white')}
                        </div>
                        {game.players.white.ratingDiff && (
                          <div className={`text-xs ${game.players.white.ratingDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {game.players.white.ratingDiff > 0 ? '+' : ''}{game.players.white.ratingDiff}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">♛</span>
                        <div>
                          <div className="font-semibold text-amber-100">
                            {game.players.black.user.title && <span className="text-purple-300">{game.players.black.user.title} </span>}
                            {game.players.black.user.name}
                          </div>
                          <div className="text-sm text-amber-300">Black • {game.players.black.rating}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${game.winner === 'black' ? 'text-green-400' : game.winner === 'white' ? 'text-red-400' : 'text-yellow-400'}`}>
                          {getGameResult(game, 'black')}
                        </div>
                        {game.players.black.ratingDiff && (
                          <div className={`text-xs ${game.players.black.ratingDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {game.players.black.ratingDiff > 0 ? '+' : ''}{game.players.black.ratingDiff}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {game.opening && (
                    <div className="flex items-center text-amber-300">
                      <span className="mr-1">📚</span>
                      {game.opening.name} ({game.opening.eco})
                    </div>
                  )}
                  {game.clock && (
                    <div className="flex items-center text-amber-300">
                      <span className="mr-1">⏰</span>
                      {Math.floor(game.clock.initial / 60)}+{game.clock.increment}
                    </div>
                  )}
                  {game.accuracy && (
                    <div className="flex items-center text-amber-300">
                      <span className="mr-1">🎯</span>
                      Accuracy: {game.accuracy.white}%/{game.accuracy.black}%
                    </div>
                  )}
                </div>
                
                {/* PGN Preview */}
                {exportOptions.pgnInJson && game.pgn && (
                  <div className="mt-3 bg-amber-800/50 rounded p-2">
                    <div className="text-xs text-amber-300 mb-1">PGN Preview:</div>
                    <div className="text-xs text-amber-200 font-mono max-h-20 overflow-y-auto">
                      {game.pgn.substring(0, 200)}{game.pgn.length > 200 ? '...' : ''}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {games.length > 20 && (
              <div className="text-center py-4 text-amber-300">
                <p>Showing first 20 games. Download JSON for complete data.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}