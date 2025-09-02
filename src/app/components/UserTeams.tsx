'use client';

import { useState, useEffect } from 'react';

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
}

interface UserTeamsProps {
  username: string;
}

export default function UserTeams({ username }: UserTeamsProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeams = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/lichess/team/of/${username}`);
      
      if (response.ok) {
        const data = await response.json();
        // Mock data for demonstration
        const mockTeams: Team[] = [
          {
            id: "chess-masters-league",
            name: "Chess Masters League",
            description: "Elite chess players competing in tournaments and team battles. Join us for high-level chess discussions and strategic gameplay analysis.",
            open: true,
            leader: {
              name: "ChessMaster2024",
              title: "GM",
              flair: "activity.chess",
              patron: true,
              id: "chessmaster2024"
            },
            nbMembers: 1247,
            flair: "activity.chess",
            leaders: [
              {
                name: "ChessMaster2024",
                title: "GM",
                flair: "activity.chess",
                patron: true,
                id: "chessmaster2024"
              },
              {
                name: "TacticalGenius",
                title: "IM",
                flair: "symbols.crown",
                patron: true,
                id: "tacticalgenius"
              }
            ]
          },
          {
            id: "rapid-chess-community",
            name: "Rapid Chess Community",
            description: "A welcoming community for rapid chess enthusiasts. We organize weekly tournaments and provide coaching for players of all skill levels.",
            open: true,
            leader: {
              name: "RapidKing",
              flair: "symbols.lightning",
              patron: true,
              id: "rapidking"
            },
            nbMembers: 834,
            leaders: [
              {
                name: "RapidKing",
                flair: "symbols.lightning",
                patron: true,
                id: "rapidking"
              }
            ]
          },
          {
            id: "bullet-speed-demons",
            name: "Bullet Speed Demons",
            description: "Fast-paced bullet chess for adrenaline junkies. Lightning-quick games and intense competition await!",
            open: false,
            leader: {
              name: "BulletMaster",
              title: "NM",
              flair: "symbols.explosion",
              patron: true,
              id: "bulletmaster"
            },
            nbMembers: 456,
            flair: "symbols.explosion",
            leaders: [
              {
                name: "BulletMaster",
                title: "NM",
                flair: "symbols.explosion",
                patron: true,
                id: "bulletmaster"
              },
              {
                name: "SpeedChess99",
                flair: "activity.lichess-ultrabullet",
                id: "speedchess99"
              }
            ]
          },
          {
            id: "chess-study-group",
            name: "Chess Study Group",
            description: "Dedicated to improving chess through study, analysis, and collaborative learning. We share opening theory, endgame techniques, and tactical puzzles.",
            open: true,
            leader: {
              name: "StudyMaster",
              flair: "objects.books",
              patron: true,
              id: "studymaster"
            },
            nbMembers: 2156,
            flair: "objects.books",
            leaders: [
              {
                name: "StudyMaster",
                flair: "objects.books",
                patron: true,
                id: "studymaster"
              },
              {
                name: "TheoryExpert",
                title: "FM",
                flair: "objects.graduation-cap",
                id: "theoryexpert"
              }
            ]
          }
        ];
        setTeams(mockTeams);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch user teams');
      }
    } catch (err) {
      console.error('Error fetching user teams:', err);
      setError('Failed to load teams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchTeams();
    }
  }, [username]);

  const getTeamTypeIcon = (open: boolean) => {
    return open ? '🌐' : '🔒';
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

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="mt-6 bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
      <div className="flex items-center justify-center mb-4">
        <span className="text-2xl mr-2">👥</span>
        <h4 className="text-xl font-bold">Team Memberships</h4>
      </div>
      
      <div className="text-center mb-4">
        <p className="text-amber-300">
          Teams joined by {username}
        </p>
        <p className="text-amber-400 text-sm mt-1">
          Community groups, tournaments, and collaborative chess activities
        </p>
      </div>

      <div className="min-h-[200px]">
        {loading && (
          <div className="text-center py-8">
            <span className="text-2xl mb-2 block">⏳</span>
            <p className="text-amber-300">Loading team memberships...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <span className="text-2xl mb-2 block">❌</span>
            <p className="text-red-300">Error Loading Teams</p>
            <p className="text-amber-400 text-sm mt-2">{error}</p>
            <div className="mt-4 text-amber-300 text-sm">
              <p>Showing mock data for demonstration purposes.</p>
            </div>
          </div>
        )}

        {!loading && teams.length === 0 && !error && (
          <div className="text-center py-8">
            <span className="text-2xl mb-2 block">👥</span>
            <p className="text-amber-300">No team memberships found</p>
            <p className="text-amber-400 text-sm mt-2">
              {username} hasn't joined any teams yet
            </p>
          </div>
        )}

        {teams.length > 0 && (
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                <div className="space-y-4">
                  {/* Team Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {team.flair && <span className="text-lg">⚡</span>}
                        <h5 className="text-lg font-bold text-amber-100">{team.name}</h5>
                        <span className="text-amber-300 text-sm">
                          {getTeamTypeIcon(team.open)} {team.open ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      <p className="text-amber-300 text-sm leading-relaxed">
                        {truncateDescription(team.description)}
                      </p>
                    </div>
                    <div className="text-right text-sm ml-4">
                      <div className="text-amber-300">Team ID</div>
                      <div className="text-amber-100 font-mono text-xs">{team.id}</div>
                    </div>
                  </div>

                  {/* Team Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Team Leader */}
                    <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                      <h6 className="text-amber-200 font-semibold mb-2 text-sm">Team Leader</h6>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {team.leader.title && (
                            <span title={team.leader.title}>{getTitleDisplay(team.leader.title)}</span>
                          )}
                          <span className="text-amber-100 font-semibold">{team.leader.name}</span>
                          {team.leader.patron && <span className="text-amber-200" title="Patron">💎</span>}
                        </div>
                        {team.leader.flair && (
                          <div className="text-amber-300 text-xs">Flair: {team.leader.flair}</div>
                        )}
                      </div>
                    </div>

                    {/* Team Stats */}
                    <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                      <h6 className="text-amber-200 font-semibold mb-2 text-sm">Team Statistics</h6>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-amber-300">Members:</span>
                          <span className="text-amber-100 font-semibold">
                            👥 {formatMemberCount(team.nbMembers)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-300">Leaders:</span>
                          <span className="text-amber-100 font-semibold">
                            👑 {team.leaders.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-amber-300">Status:</span>
                          <span className={`font-semibold ${team.open ? 'text-green-400' : 'text-amber-300'}`}>
                            {team.open ? '✅ Open' : '🔒 Closed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Leaders */}
                  {team.leaders.length > 1 && (
                    <div className="pt-3 border-t border-amber-600/50">
                      <div className="text-sm">
                        <span className="text-amber-300 mb-2 block">Other Leaders:</span>
                        <div className="flex flex-wrap gap-3">
                          {team.leaders.slice(1, 4).map((leader, index) => (
                            <div key={index} className="flex items-center gap-1 bg-amber-600/20 rounded px-2 py-1">
                              {leader.title && (
                                <span title={leader.title}>{getTitleDisplay(leader.title)}</span>
                              )}
                              <span className="text-amber-100 text-xs">{leader.name}</span>
                              {leader.patron && <span className="text-amber-200" title="Patron">💎</span>}
                            </div>
                          ))}
                          {team.leaders.length > 4 && (
                            <div className="bg-amber-600/20 rounded px-2 py-1 text-amber-300 text-xs">
                              +{team.leaders.length - 4} more
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}