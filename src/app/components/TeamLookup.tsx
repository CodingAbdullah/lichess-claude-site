'use client';

import { useState } from 'react';

interface TeamLeader {
  name: string;
  title?: string;
  flair?: string;
  patron?: boolean;
  id: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  open: boolean;
  leader: TeamLeader;
  nbMembers: number;
  flair?: string;
  leaders: TeamLeader[];
  joined?: boolean;
  requested?: boolean;
}

export default function TeamLookup() {
  const [teamId, setTeamId] = useState('');
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTeam = async (id: string) => {
    if (!id.trim()) {
      setError('Please enter a team ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/lichess/team/${encodeURIComponent(id.trim())}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Team not found. Please check the team ID.');
        }
        throw new Error('Failed to fetch team data');
      }

      const data = await response.json();
      setTeam(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch team data');
      setTeam(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTeam(teamId);
  };

  const getTitleDisplay = (title?: string) => {
    if (!title) return '';
    const titleMap: { [key: string]: string } = {
      'GM': '👑',
      'IM': '🏆',
      'FM': '🥇',
      'CM': '🥈',
      'NM': '⭐',
      'LM': '🎖️',
      'BOT': '🤖'
    };
    return titleMap[title] || '🎯';
  };

  const formatMemberCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getFlairEmoji = (flair?: string) => {
    if (!flair) return '⚡';
    // Map common flair types to emojis
    const flairMap: { [key: string]: string } = {
      'activity.lichess': '♞',
      'nature.seedling': '🌱',
      'food-drink.cheese-wedge': '🧀',
      'objects.hammer-and-wrench': '🛠️',
      'nature.fire': '🔥',
      'nature.cherry-blossom': '🌸',
      'smileys.flushed-face': '😳',
      'symbols.play-button': '▶️',
      'travel-places.ambulance': '🚑',
      'objects.money-bag': '💰',
      'nature.horse-face': '🐴'
    };
    return flairMap[flair] || '⚡';
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Search Form */}
      <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl mr-2">🔍</span>
          <h3 className="text-2xl font-bold">Team Lookup</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="teamId" className="block text-sm font-semibold mb-2 text-amber-200">
              Team ID *
            </label>
            <input
              type="text"
              id="teamId"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full px-4 py-3 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50 font-medium"
              placeholder="Enter team ID (e.g., lichess-swiss, coders)..."
              required
            />
            <p className="text-amber-300 text-sm mt-1">
              Find the team ID in the team URL: lichess.org/team/[team-id]
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:from-amber-800 disabled:to-amber-900 px-4 py-3 rounded-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-amber-500 flex items-center justify-center"
          >
            <span className="text-xl mr-2">
              {loading ? '⏳' : '🔍'}
            </span>
            {loading ? 'Looking up Team...' : 'Lookup Team'}
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

      {team && (
        <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
          <div className="flex items-center justify-center mb-6">
            <span className="text-3xl mr-2">👥</span>
            <h3 className="text-2xl font-bold">Team Information</h3>
          </div>
          
          {/* Team Header */}
          <div className="bg-amber-700/30 rounded-lg p-6 border border-amber-600/50 mb-6">
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-2xl">{getFlairEmoji(team.flair)}</span>
                <h4 className="text-3xl font-bold text-amber-100">{team.name}</h4>
                <span className="text-lg">
                  {team.open ? '🌐' : '🔒'}
                </span>
              </div>
              <div className="text-amber-300 text-sm mb-4">@{team.id}</div>
              
              <p className="text-amber-200 text-lg leading-relaxed mb-4">
                {team.description}
              </p>

              {/* Membership Status */}
              {(team.joined !== undefined || team.requested !== undefined) && (
                <div className="flex justify-center space-x-4 mb-4">
                  {team.joined && (
                    <span className="bg-green-600/30 text-green-300 px-4 py-2 rounded-lg font-semibold flex items-center">
                      <span className="mr-2">✅</span>
                      Member
                    </span>
                  )}
                  {team.requested && (
                    <span className="bg-yellow-600/30 text-yellow-300 px-4 py-2 rounded-lg font-semibold flex items-center">
                      <span className="mr-2">⏳</span>
                      Request Pending
                    </span>
                  )}
                  {!team.joined && !team.requested && (
                    <span className="bg-amber-600/30 text-amber-300 px-4 py-2 rounded-lg font-semibold flex items-center">
                      <span className="mr-2">👤</span>
                      Not a Member
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-center">
              <div className="bg-amber-600/20 rounded-lg p-3 border border-amber-500/30">
                <div className="text-2xl mb-1">👥</div>
                <div className="text-2xl font-bold text-amber-100">
                  {formatMemberCount(team.nbMembers)}
                </div>
                <div className="text-amber-300 text-sm">Members</div>
              </div>
              
              <div className="bg-amber-600/20 rounded-lg p-3 border border-amber-500/30">
                <div className="text-2xl mb-1">👑</div>
                <div className="text-2xl font-bold text-amber-100">
                  {team.leaders.length}
                </div>
                <div className="text-amber-300 text-sm">Leaders</div>
              </div>
              
              <div className="bg-amber-600/20 rounded-lg p-3 border border-amber-500/30">
                <div className="text-2xl mb-1">
                  {team.open ? '✅' : '🔒'}
                </div>
                <div className="text-lg font-bold text-amber-100">
                  {team.open ? 'Open' : 'Closed'}
                </div>
                <div className="text-amber-300 text-sm">Membership</div>
              </div>
            </div>
          </div>

          {/* Team Leaders */}
          <div className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50 mb-6">
            <h5 className="text-xl font-semibold text-amber-200 mb-4 flex items-center justify-center">
              <span className="text-xl mr-2">👑</span>
              Team Leadership
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.leaders.map((leader, index) => (
                <div key={index} className="bg-amber-600/20 rounded-lg p-4 border border-amber-500/30">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {leader.title && (
                        <span title={leader.title} className="text-xl">
                          {getTitleDisplay(leader.title)}
                        </span>
                      )}
                      <h6 className="font-bold text-amber-100">{leader.name}</h6>
                      {leader.patron && (
                        <span className="text-amber-200" title="Patron">💎</span>
                      )}
                    </div>
                    
                    <div className="text-amber-300 text-sm mb-2">@{leader.id}</div>
                    
                    {leader.title && (
                      <div className="inline-block bg-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold text-amber-100 mb-2">
                        {leader.title}
                      </div>
                    )}
                    
                    {leader.flair && (
                      <div className="text-amber-400 text-xs mt-2 flex items-center justify-center">
                        <span className="mr-1">{getFlairEmoji(leader.flair)}</span>
                        {leader.flair.split('.').pop()?.replace(/-/g, ' ')}
                      </div>
                    )}
                    
                    {leader.id === team.leader.id && (
                      <div className="mt-2">
                        <span className="inline-block bg-amber-600/40 px-2 py-1 rounded text-xs font-semibold text-amber-100">
                          Team Leader
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <a
              href={`https://lichess.org/team/${team.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              <span className="text-lg mr-2">🔗</span>
              View on Lichess
            </a>
            
            {team.open && !team.joined && (
              <a
                href={`https://lichess.org/team/${team.id}/join`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
              >
                <span className="text-lg mr-2">➕</span>
                Join Team
              </a>
            )}

            {team.joined && (
              <a
                href={`https://lichess.org/team/${team.id}/quit`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
              >
                <span className="text-lg mr-2">🚪</span>
                Leave Team
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}