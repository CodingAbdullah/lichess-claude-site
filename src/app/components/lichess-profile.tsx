"use client";

import React, { useEffect, useState } from 'react';
import { LichessData } from '../../utils/types/LichessData';
import { Card, CardContent } from "../../components/ui/card";
import { toast } from 'sonner';

// Lichess Profile custom client component
interface ChallengeParams {
  rated: boolean;
  clockLimit?: number;
  clockIncrement?: number;
  days?: number;
  color: 'random' | 'white' | 'black';
  variant: string;
  fen?: string;
}

export default function LichessProfile() {
  const [lichessData, setLichessData] = useState<LichessData | null>(null);
  const [isError, setIsError] = useState(false);
  
  // Challenge form state
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

  const handleChallengeSubmit = async (e: React.FormEvent) => {
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

  useEffect(() => {
    const fetchLichessData = async () => {
      try {
        const response = await fetch('/api/lichess');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setLichessData(data);
      } 
      catch (error) {
        if (error) {
            setIsError(true);
        }
      }
    };

    fetchLichessData();
  }, []);

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error Loading Lichess Data</h2>
          <p className="text-muted-foreground mt-2">Unable to fetch your profile information.</p>
        </div>
      </div>
    );
  }

  if (!lichessData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary">Loading...</h2>
          <p className="text-muted-foreground mt-2">Fetching your Lichess profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow space-y-8">
        <h1 className="text-4xl font-bold tracking-tighter text-primary text-glow text-center sm:text-left">
          Lichess Profile
        </h1>

        <Card className="glass-card">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">Account</h2>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-medium text-primary">Username:</span>
                <span className="text-muted-foreground">{lichessData.status.id}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-medium text-primary">Status:</span>
                <span className={lichessData.status.online ? 'text-green-500' : 'text-red-500'}>
                  {lichessData.status.online ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-primary mb-4">Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Games Played</div>
                <div className="text-2xl font-bold text-primary">{lichessData.account.count.all}</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Wins</div>
                <div className="text-2xl font-bold text-green-500">{lichessData.account.count.win}</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Draws</div>
                <div className="text-2xl font-bold text-yellow-500">{lichessData.account.count.draw}</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Losses</div>
                <div className="text-2xl font-bold text-red-500">{lichessData.account.count.loss}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Challenge Abdullah Section */}
        <Card className="glass-card matrix-glow border-green-500/30"
          style={{
            boxShadow: '0 0 20px rgba(0, 255, 127, 0.2), 0 8px 32px 0 rgba(0, 0, 0, 0.37)'
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-center mb-6">
              <span className="text-3xl mr-2">⚔️</span>
              <h2 className="text-2xl font-semibold text-green-400" style={{
                textShadow: '0 0 10px rgba(0, 255, 127, 0.8), 0 0 20px rgba(0, 255, 127, 0.6)'
              }}>Challenge Me</h2>
            </div>
            
            <form onSubmit={handleChallengeSubmit} className="space-y-6">
              {/* Username Input */}
              <div className="bg-muted/30 rounded-lg p-4 border border-green-500/30">
                <h4 className="text-lg font-semibold text-green-300 mb-4">Your Lichess Username</h4>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-muted/50 border-2 border-green-500/50 rounded-lg focus:outline-none focus:border-green-400 placeholder-green-400/60 text-foreground font-medium focus:shadow-lg focus:shadow-green-500/20"
                  placeholder="Enter your Lichess username..."
                  required
                />
              </div>

              {/* Game Type */}
              <div className="bg-muted/30 rounded-lg p-4 border border-green-500/30">
                <h4 className="text-lg font-semibold text-green-300 mb-4">Game Type</h4>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gameType"
                      value="realtime"
                      checked={gameType === 'realtime'}
                      onChange={(e) => setGameType(e.target.value as 'realtime')}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <div>
                      <span className="font-medium text-green-200">Realtime</span>
                      <div className="text-sm text-green-400">Games with time controls</div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="gameType"
                      value="correspondence"
                      checked={gameType === 'correspondence'}
                      onChange={(e) => setGameType(e.target.value as 'correspondence')}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <div>
                      <span className="font-medium text-green-200">Correspondence</span>
                      <div className="text-sm text-green-400">Days per move</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Time Control */}
              {gameType === 'realtime' ? (
                <div className="bg-muted/30 rounded-lg p-4 border border-green-500/30">
                  <h4 className="text-lg font-semibold text-green-300 mb-4">Time Control</h4>
                  
                  {/* Presets */}
                  <div className="mb-4">
                    <div className="text-sm text-green-400 mb-2">Quick Select:</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {timePresets.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleTimePreset(preset)}
                          className={`p-2 text-sm rounded transition-all duration-200 ${
                            challengeParams.clockLimit === preset.limit && challengeParams.clockIncrement === preset.increment
                              ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                              : 'bg-green-600/20 hover:bg-green-600/40 text-green-200 border border-green-500/30'
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
                      <label className="block text-sm font-medium text-green-300 mb-2">Initial Time (seconds)</label>
                      <input
                        type="number"
                        min="0"
                        max="10800"
                        step="15"
                        value={challengeParams.clockLimit || ''}
                        onChange={(e) => setChallengeParams(prev => ({ ...prev, clockLimit: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-muted/50 border border-green-500/50 rounded text-foreground focus:border-green-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-green-300 mb-2">Increment (seconds)</label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        value={challengeParams.clockIncrement || ''}
                        onChange={(e) => setChallengeParams(prev => ({ ...prev, clockIncrement: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-muted/50 border border-green-500/50 rounded text-foreground focus:border-green-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 rounded-lg p-4 border border-green-500/30">
                  <h4 className="text-lg font-semibold text-green-300 mb-4">Days Per Move</h4>
                  <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                    {correspondenceDays.map((days) => (
                      <label key={days} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="days"
                          value={days}
                          checked={challengeParams.days === days}
                          onChange={() => setChallengeParams(prev => ({ ...prev, days }))}
                          className="text-green-500 focus:ring-green-500"
                        />
                        <span className="text-green-200">{days} day{days > 1 ? 's' : ''}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Game Options */}
              <div className="bg-muted/30 rounded-lg p-4 border border-green-500/30">
                <h4 className="text-lg font-semibold text-green-300 mb-4">Game Options</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Rated */}
                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={challengeParams.rated}
                        onChange={(e) => setChallengeParams(prev => ({ ...prev, rated: e.target.checked }))}
                        className="rounded text-green-500 focus:ring-green-500"
                      />
                      <div>
                        <span className="font-medium text-green-200">Rated Game</span>
                        <div className="text-sm text-green-400">Affects player ratings</div>
                      </div>
                    </label>
                  </div>
                  
                  {/* Color */}
                  <div>
                    <label className="block text-sm font-medium text-green-300 mb-2">Your Color</label>
                    <select
                      value={challengeParams.color}
                      onChange={(e) => setChallengeParams(prev => ({ ...prev, color: e.target.value as any }))}
                      className="w-full px-3 py-2 bg-muted/50 border border-green-400/70 rounded text-green-300 focus:border-green-300 focus:outline-none focus:shadow-lg focus:shadow-green-400/20"
                      style={{
                        boxShadow: 'inset 0 0 8px rgba(0, 255, 127, 0.15)'
                      }}
                    >
                      <option value="random" className="bg-gray-800 text-green-300">🎲 Random</option>
                      <option value="white" className="bg-gray-800 text-green-300">♔ White</option>
                      <option value="black" className="bg-gray-800 text-green-300">♛ Black</option>
                    </select>
                  </div>
                  
                  {/* Variant */}
                  <div>
                    <label className="block text-sm font-medium text-green-300 mb-2">Game Variant</label>
                    <select
                      value={challengeParams.variant}
                      onChange={(e) => setChallengeParams(prev => ({ ...prev, variant: e.target.value }))}
                      className="w-full px-3 py-2 bg-muted/50 border border-green-400/70 rounded text-green-300 focus:border-green-300 focus:outline-none focus:shadow-lg focus:shadow-green-400/20"
                      style={{
                        boxShadow: 'inset 0 0 8px rgba(0, 255, 127, 0.15)'
                      }}
                    >
                      {variants.map((variant) => (
                        <option key={variant.key} value={variant.key} className="bg-gray-800 text-green-300">
                          {variant.icon} {variant.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Custom Position (if fromPosition variant) */}
              {challengeParams.variant === 'fromPosition' && (
                <div className="bg-muted/30 rounded-lg p-4 border border-green-500/30">
                  <h4 className="text-lg font-semibold text-green-300 mb-4">Custom Starting Position (FEN)</h4>
                  <input
                    type="text"
                    value={challengeParams.fen || ''}
                    onChange={(e) => setChallengeParams(prev => ({ ...prev, fen: e.target.value }))}
                    className="w-full px-4 py-3 bg-muted/50 border-2 border-green-500/50 rounded-lg focus:outline-none focus:border-green-400 placeholder-green-400/60 text-foreground font-mono text-sm"
                    placeholder="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
                  />
                  <div className="text-xs text-green-400/70 mt-1">
                    Enter the position in FEN (Forsyth-Edwards Notation) format
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 disabled:from-green-800 disabled:to-green-900 px-6 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-green-500 flex items-center justify-center text-white matrix-glow pulse-glow"
                style={{
                  textShadow: '0 0 10px rgba(0, 255, 127, 0.8)',
                  boxShadow: '0 0 20px rgba(0, 255, 127, 0.3), inset 0 0 20px rgba(0, 255, 127, 0.1)'
                }}
              >
                <span className="text-2xl mr-3">
                  {isSubmitting ? '⏳' : '⚔️'}
                </span>
                {isSubmitting ? 'Sending Challenge...' : 'Send Challenge'}
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}