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

  return null;
}