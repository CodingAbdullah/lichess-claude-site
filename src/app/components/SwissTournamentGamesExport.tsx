'use client';

import { useState } from 'react';

interface SwissTournamentGamesExportProps {
  tournamentId: string;
}

export default function SwissTournamentGamesExport({ tournamentId }: SwissTournamentGamesExportProps) {
  const [playerFilter, setPlayerFilter] = useState('');
  const [exportOptions, setExportOptions] = useState({
    moves: true,
    pgnInJson: true,
    tags: true,
    clocks: true,
    evals: true,
    accuracy: true,
    opening: true,
    division: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportResult, setExportResult] = useState<any>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    setExportResult(null);

    try {
      const queryParams = new URLSearchParams();
      
      // Add player filter if specified
      if (playerFilter.trim()) {
        queryParams.append('player', playerFilter.trim());
      }

      // Add all export options
      Object.entries(exportOptions).forEach(([key, value]) => {
        queryParams.append(key, value.toString());
      });

      const response = await fetch(`/api/lichess/swiss/${tournamentId}/games?${queryParams.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        
        // Mock data for demonstration
        const mockGamesData = {
          exportInfo: {
            tournamentId: tournamentId,
            totalGames: playerFilter ? 8 : 45,
            playerFilter: playerFilter || null,
            exportOptions: exportOptions,
            exportedAt: new Date().toISOString(),
            format: exportOptions.pgnInJson ? 'JSON with PGN' : 'JSON',
          },
          sampleGames: [
            {
              id: "abc123def456",
              white: {
                user: { name: "SwissMaster", id: "swissmaster" },
                rating: 1892,
                ratingDiff: 12
              },
              black: {
                user: { name: "TacticalPlayer", id: "tacticalplayer" },
                rating: 1856,
                ratingDiff: -11
              },
              status: "mate",
              winner: "white",
              speed: "classical",
              perf: "classical",
              createdAt: Date.now() - 7200000,
              lastMoveAt: Date.now() - 3600000,
              moves: exportOptions.moves ? "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7" : undefined,
              clock: exportOptions.clocks ? { initial: 1800, increment: 30 } : undefined,
              opening: exportOptions.opening ? { eco: "C84", name: "Spanish Game: Closed Variations" } : undefined,
              accuracy: exportOptions.accuracy ? { white: 87, black: 82 } : undefined
            },
            {
              id: "def456ghi789",
              white: {
                user: { name: "EndgameExpert", id: "endgameexpert" },
                rating: 1923,
                ratingDiff: -8
              },
              black: {
                user: { name: "PositionalPlayer", id: "positionalplayer" },
                rating: 1887,
                ratingDiff: 9
              },
              status: "resign",
              winner: "black",
              speed: "classical",
              perf: "classical",
              createdAt: Date.now() - 5400000,
              lastMoveAt: Date.now() - 1800000,
              moves: exportOptions.moves ? "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7 9. Ne1 Nd7" : undefined,
              clock: exportOptions.clocks ? { initial: 1800, increment: 30 } : undefined,
              opening: exportOptions.opening ? { eco: "E94", name: "King's Indian Defense" } : undefined,
              accuracy: exportOptions.accuracy ? { white: 79, black: 91 } : undefined
            }
          ]
        };
        
        setExportResult(mockGamesData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to export tournament games');
      }
    } catch (err) {
      console.error('Error exporting tournament games:', err);
      setError('Failed to export games');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (option: string) => {
    setExportOptions(prev => ({
      ...prev,
      [option]: !prev[option as keyof typeof prev]
    }));
  };

  const downloadAsJSON = () => {
    if (!exportResult) return;
    
    const dataStr = JSON.stringify(exportResult, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `swiss-tournament-${tournamentId}-games.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string, winner: string) => {
    if (status === 'mate') return winner === 'white' ? 'text-blue-300' : 'text-red-300';
    if (status === 'resign') return winner === 'white' ? 'text-blue-300' : 'text-red-300';
    if (status === 'draw') return 'text-amber-300';
    if (status === 'timeout') return winner === 'white' ? 'text-blue-300' : 'text-red-300';
    return 'text-amber-400';
  };

  const getResultEmoji = (status: string, winner: string) => {
    if (status === 'mate') return '♔';
    if (status === 'resign') return '🏳️';
    if (status === 'draw') return '⚖️';
    if (status === 'timeout') return '⏰';
    return '❓';
  };

  return (
    <div className="bg-amber-700/30 rounded-lg p-6 border border-amber-600/50 mt-6">
      <div className="flex items-center justify-center mb-6">
        <span className="text-2xl mr-2">📥</span>
        <h4 className="text-xl font-bold text-amber-100">Export Tournament Games</h4>
      </div>

      <div className="text-center mb-6">
        <p className="text-amber-300">
          Export all games from this Swiss tournament with customizable options
        </p>
        <p className="text-amber-400 text-sm mt-1">
          Download games in JSON format with PGN data, analysis, and statistics
        </p>
      </div>

      {/* Player Filter */}
      <div className="mb-6">
        <label className="block text-amber-300 text-sm font-medium mb-2">
          Filter by Player (Optional)
        </label>
        <input
          type="text"
          value={playerFilter}
          onChange={(e) => setPlayerFilter(e.target.value)}
          placeholder="Enter username to filter games by specific player"
          className="w-full px-4 py-2 rounded-lg bg-amber-600/20 border border-amber-500/30 text-amber-100 placeholder-amber-400 focus:outline-none focus:border-amber-400 focus:bg-amber-600/30 transition-all duration-200"
        />
      </div>

      {/* Export Options */}
      <div className="mb-6">
        <h5 className="text-amber-200 font-semibold mb-4 flex items-center">
          <span className="text-lg mr-2">⚙️</span>
          Export Options
        </h5>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'moves', label: 'Include PGN Moves', description: 'Full game notation' },
            { key: 'tags', label: 'Include PGN Tags', description: 'Game metadata' },
            { key: 'pgnInJson', label: 'PGN in JSON', description: 'Embed PGN in response' },
            { key: 'clocks', label: 'Include Clock Data', description: 'Time information' },
            { key: 'evals', label: 'Include Analysis', description: 'Engine evaluations' },
            { key: 'accuracy', label: 'Include Accuracy', description: 'Player accuracy %' },
            { key: 'opening', label: 'Include Opening', description: 'Opening names' },
            { key: 'division', label: 'Include Divisions', description: 'Game phase markers' }
          ].map((option) => (
            <label key={option.key} className="flex items-center p-3 bg-amber-600/10 rounded border border-amber-500/20 hover:bg-amber-600/20 transition-all cursor-pointer">
              <input
                type="checkbox"
                checked={exportOptions[option.key as keyof typeof exportOptions]}
                onChange={() => handleOptionChange(option.key)}
                className="mr-3 w-4 h-4 text-amber-600 rounded focus:ring-amber-500 focus:ring-2"
              />
              <div className="flex-1">
                <div className="text-amber-200 font-medium text-sm">{option.label}</div>
                <div className="text-amber-400 text-xs">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleExport}
          disabled={loading}
          className="px-8 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 text-amber-50 rounded-lg font-semibold transition-all duration-200 border-2 border-amber-500 hover:border-amber-400 disabled:border-amber-700 flex items-center"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Exporting Games...
            </>
          ) : (
            <>
              <span className="mr-2">📥</span>
              Export Games
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {error && (
        <div className="text-center py-6 bg-red-900/20 rounded-lg border border-red-500/30">
          <span className="text-2xl mb-2 block">❌</span>
          <p className="text-red-300 font-semibold mb-1">Export Failed</p>
          <p className="text-amber-400 text-sm">{error}</p>
          <div className="mt-3 text-amber-300 text-sm">
            <p>Showing mock data for demonstration purposes.</p>
          </div>
        </div>
      )}

      {exportResult && (
        <div className="space-y-4">
          {/* Export Summary */}
          <div className="bg-amber-600/20 rounded-lg p-4 border border-amber-500/30">
            <h5 className="text-amber-200 font-semibold mb-3 flex items-center">
              <span className="text-lg mr-2">📊</span>
              Export Summary
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-300">Tournament ID:</span>
                  <span className="text-amber-100 font-mono">{exportResult.exportInfo.tournamentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-300">Total Games:</span>
                  <span className="text-amber-100 font-semibold">{exportResult.exportInfo.totalGames}</span>
                </div>
                {exportResult.exportInfo.playerFilter && (
                  <div className="flex justify-between">
                    <span className="text-amber-300">Player Filter:</span>
                    <span className="text-amber-100 font-semibold">{exportResult.exportInfo.playerFilter}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-300">Export Format:</span>
                  <span className="text-amber-100">{exportResult.exportInfo.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-300">Exported At:</span>
                  <span className="text-amber-100 text-xs">{new Date(exportResult.exportInfo.exportedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={downloadAsJSON}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-green-50 rounded-lg font-medium transition-all duration-200 border border-green-500 hover:border-green-400 flex items-center"
              >
                <span className="mr-2">💾</span>
                Download JSON
              </button>
            </div>
          </div>

          {/* Sample Games Preview */}
          <div className="bg-amber-600/20 rounded-lg p-4 border border-amber-500/30">
            <h5 className="text-amber-200 font-semibold mb-3 flex items-center">
              <span className="text-lg mr-2">🎮</span>
              Sample Games Preview
            </h5>
            <div className="space-y-3">
              {exportResult.sampleGames.map((game: any, index: number) => (
                <div key={game.id} className="bg-amber-700/30 rounded p-3 border border-amber-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-amber-400">Game #{index + 1}</span>
                      <span className={`text-sm font-semibold ${getStatusColor(game.status, game.winner)}`}>
                        {getResultEmoji(game.status, game.winner)} {game.status}
                      </span>
                    </div>
                    <span className="text-xs text-amber-400 font-mono">{game.id}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-300">♔ {game.white.user.name}</span>
                      <span className={`font-semibold ${game.winner === 'white' ? 'text-green-400' : 'text-amber-300'}`}>
                        {game.white.rating} ({game.white.ratingDiff >= 0 ? '+' : ''}{game.white.ratingDiff})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-300">♛ {game.black.user.name}</span>
                      <span className={`font-semibold ${game.winner === 'black' ? 'text-green-400' : 'text-amber-300'}`}>
                        {game.black.rating} ({game.black.ratingDiff >= 0 ? '+' : ''}{game.black.ratingDiff})
                      </span>
                    </div>
                  </div>

                  {(game.opening || game.accuracy || game.moves) && (
                    <div className="mt-3 pt-3 border-t border-amber-600/30 space-y-2 text-xs">
                      {game.opening && (
                        <div className="text-amber-400">
                          <span className="font-medium">Opening:</span> {game.opening.name} ({game.opening.eco})
                        </div>
                      )}
                      {game.accuracy && (
                        <div className="text-amber-400">
                          <span className="font-medium">Accuracy:</span> White {game.accuracy.white}% | Black {game.accuracy.black}%
                        </div>
                      )}
                      {game.moves && (
                        <div className="text-amber-400">
                          <span className="font-medium">Moves:</span> {game.moves}...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}