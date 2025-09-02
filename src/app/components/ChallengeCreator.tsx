'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface ChallengeParams {
  rated: boolean;
  clockLimit?: number;
  clockIncrement?: number;
  days?: number;
  color: 'random' | 'white' | 'black';
  variant: string;
  fen?: string;
}

export default function ChallengeCreator() {
  const [username, setUsername] = useState('');
  const [gameType, setGameType] = useState<'realtime' | 'correspondence'>('realtime');
  const [challengeParams, setChallengeParams] = useState<ChallengeParams>({
    rated: false,
    clockLimit: 300,
    clockIncrement: 3,
    color: 'random',
    variant: 'standard',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time control presets
  const timePresets = [
    { name: 'Bullet 1+0', limit: 60, increment: 0 },
    { name: 'Bullet 1+1', limit: 60, increment: 1 },
    { name: 'Bullet 2+1', limit: 120, increment: 1 },
    { name: 'Blitz 3+0', limit: 180, increment: 0 },
    { name: 'Blitz 3+2', limit: 180, increment: 2 },
    { name: 'Blitz 5+0', limit: 300, increment: 0 },
    { name: 'Blitz 5+3', limit: 300, increment: 3 },
    { name: 'Rapid 10+0', limit: 600, increment: 0 },
    { name: 'Rapid 15+10', limit: 900, increment: 10 },
    { name: 'Classical 30+0', limit: 1800, increment: 0 },
    { name: 'Classical 90+30', limit: 5400, increment: 30 },
  ];

  const variants = [
    { key: 'standard', name: 'Standard', icon: '♞' },
    { key: 'chess960', name: 'Chess960', icon: '🎲' },
    { key: 'crazyhouse', name: 'Crazyhouse', icon: '🏠' },
    { key: 'antichess', name: 'Antichess', icon: '🔄' },
    { key: 'atomic', name: 'Atomic', icon: '💣' },
    { key: 'horde', name: 'Horde', icon: '👥' },
    { key: 'kingOfTheHill', name: 'King of the Hill', icon: '👑' },
    { key: 'racingKings', name: 'Racing Kings', icon: '🏁' },
    { key: 'threeCheck', name: 'Three-check', icon: '✅' },
    { key: 'fromPosition', name: 'From Position', icon: '📋' },
  ];

  const correspondenceDays = [1, 2, 3, 5, 7, 10, 14];

  const handleTimePreset = (preset: typeof timePresets[0]) => {
    setChallengeParams(prev => ({
      ...prev,
      clockLimit: preset.limit,
      clockIncrement: preset.increment,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const challengeData = {
        username: username.trim(),
        rated: challengeParams.rated,
        color: challengeParams.color,
        variant: challengeParams.variant,
        ...(gameType === 'realtime' 
          ? { clockLimit: challengeParams.clockLimit, clockIncrement: challengeParams.clockIncrement }
          : { days: challengeParams.days }
        ),
        ...(challengeParams.variant === 'fromPosition' && challengeParams.fen ? { fen: challengeParams.fen } : {}),
      };

      const response = await fetch('/api/lichess/challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(challengeData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message, {
          description: data.lichessUrl ? 'Click to view challenge on Lichess' : undefined,
          action: data.lichessUrl ? {
            label: 'View Challenge',
            onClick: () => window.open(data.lichessUrl, '_blank')
          } : undefined,
        });
        
        // Reset form
        setUsername('');
        setChallengeParams({
          rated: false,
          clockLimit: 300,
          clockIncrement: 3,
          color: 'random',
          variant: 'standard',
        });
      } else {
        toast.error(data.error || 'Failed to send challenge');
      }
    } catch (error) {
      toast.error('Failed to send challenge');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
        <div className="flex items-center justify-center mb-6">
          <span className="text-3xl mr-2">⚔️</span>
          <h3 className="text-2xl font-bold">Challenge Abdullah</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
            <h4 className="text-lg font-semibold text-amber-200 mb-4">Your Lichess Username</h4>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50 font-medium"
              placeholder="Enter your Lichess username..."
              required
            />
          </div>

          {/* Game Type */}
          <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
            <h4 className="text-lg font-semibold text-amber-200 mb-4">Game Type</h4>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="gameType"
                  value="realtime"
                  checked={gameType === 'realtime'}
                  onChange={(e) => setGameType(e.target.value as 'realtime')}
                  className="text-amber-500"
                />
                <div>
                  <span className="font-medium">Realtime</span>
                  <div className="text-sm text-amber-300">Games with time controls</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="gameType"
                  value="correspondence"
                  checked={gameType === 'correspondence'}
                  onChange={(e) => setGameType(e.target.value as 'correspondence')}
                  className="text-amber-500"
                />
                <div>
                  <span className="font-medium">Correspondence</span>
                  <div className="text-sm text-amber-300">Days per move</div>
                </div>
              </label>
            </div>
          </div>

          {/* Time Control */}
          {gameType === 'realtime' ? (
            <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <h4 className="text-lg font-semibold text-amber-200 mb-4">Time Control</h4>
              
              {/* Presets */}
              <div className="mb-4">
                <div className="text-sm text-amber-300 mb-2">Quick Select:</div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {timePresets.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleTimePreset(preset)}
                      className={`p-2 text-sm rounded transition-colors ${
                        challengeParams.clockLimit === preset.limit && challengeParams.clockIncrement === preset.increment
                          ? 'bg-amber-600 text-white'
                          : 'bg-amber-600/30 hover:bg-amber-600/50 text-amber-200'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Custom Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-2">Initial Time (seconds)</label>
                  <input
                    type="number"
                    min="0"
                    max="10800"
                    step="15"
                    value={challengeParams.clockLimit || ''}
                    onChange={(e) => setChallengeParams(prev => ({ ...prev, clockLimit: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-amber-700/30 border border-amber-600/50 rounded text-amber-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-amber-200 mb-2">Increment (seconds)</label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={challengeParams.clockIncrement || ''}
                    onChange={(e) => setChallengeParams(prev => ({ ...prev, clockIncrement: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-amber-700/30 border border-amber-600/50 rounded text-amber-50"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <h4 className="text-lg font-semibold text-amber-200 mb-4">Days Per Move</h4>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {correspondenceDays.map((days) => (
                  <label key={days} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="days"
                      value={days}
                      checked={challengeParams.days === days}
                      onChange={() => setChallengeParams(prev => ({ ...prev, days }))}
                      className="text-amber-500"
                    />
                    <span>{days} day{days > 1 ? 's' : ''}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Game Options */}
          <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
            <h4 className="text-lg font-semibold text-amber-200 mb-4">Game Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Rated */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={challengeParams.rated}
                    onChange={(e) => setChallengeParams(prev => ({ ...prev, rated: e.target.checked }))}
                    className="rounded text-amber-500"
                  />
                  <div>
                    <span className="font-medium">Rated Game</span>
                    <div className="text-sm text-amber-300">Affects player ratings</div>
                  </div>
                </label>
              </div>
              
              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">Your Color</label>
                <select
                  value={challengeParams.color}
                  onChange={(e) => setChallengeParams(prev => ({ ...prev, color: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-amber-700/30 border border-amber-600/50 rounded text-amber-50"
                >
                  <option value="random">🎲 Random</option>
                  <option value="white">♔ White</option>
                  <option value="black">♛ Black</option>
                </select>
              </div>
              
              {/* Variant */}
              <div>
                <label className="block text-sm font-medium text-amber-200 mb-2">Game Variant</label>
                <select
                  value={challengeParams.variant}
                  onChange={(e) => setChallengeParams(prev => ({ ...prev, variant: e.target.value }))}
                  className="w-full px-3 py-2 bg-amber-700/30 border border-amber-600/50 rounded text-amber-50"
                >
                  {variants.map((variant) => (
                    <option key={variant.key} value={variant.key}>
                      {variant.icon} {variant.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Custom Position (if fromPosition variant) */}
          {challengeParams.variant === 'fromPosition' && (
            <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
              <h4 className="text-lg font-semibold text-amber-200 mb-4">Custom Starting Position (FEN)</h4>
              <input
                type="text"
                value={challengeParams.fen || ''}
                onChange={(e) => setChallengeParams(prev => ({ ...prev, fen: e.target.value }))}
                className="w-full px-4 py-3 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50 font-mono text-sm"
                placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
              />
              <div className="text-xs text-amber-400 mt-1">
                Enter the position in FEN (Forsyth-Edwards Notation) format
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-800 disabled:to-amber-900 px-6 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-amber-500 flex items-center justify-center"
          >
            <span className="text-2xl mr-3">
              {isSubmitting ? '⏳' : '⚔️'}
            </span>
            {isSubmitting ? 'Sending Challenge...' : 'Challenge Abdullah'}
          </button>
        </form>
      </div>
  );
}