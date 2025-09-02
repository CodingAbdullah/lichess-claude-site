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
}

interface TeamSearchResponse {
  currentPage: number;
  maxPerPage: number;
  currentPageResults: Team[];
  previousPage: number | null;
  nextPage: number | null;
  nbResults: number;
  nbPages: number;
}

export default function TeamSearch() {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<TeamSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const searchTeams = async (text: string, page: number = 1) => {
    if (!text.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams();
      params.append('text', text.trim());
      params.append('page', page.toString());

      const response = await fetch(`/api/lichess/team/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to search teams');
      }

      const data = await response.json();
      setSearchResults(data);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search teams');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchTeams(searchText, 1);
  };

  const handlePageChange = (page: number) => {
    if (searchText.trim()) {
      searchTeams(searchText, page);
    }
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

  const truncateDescription = (description: string, maxLength: number = 200) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Search Form */}
      <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
        <div className="flex items-center justify-center mb-4">
          <span className="text-3xl mr-2">🔍</span>
          <h3 className="text-2xl font-bold">Search Teams</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="searchText" className="block text-sm font-semibold mb-2 text-amber-200">
              Search Teams *
            </label>
            <input
              type="text"
              id="searchText"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-4 py-3 bg-amber-700/30 border-2 border-amber-600/50 rounded-lg focus:outline-none focus:border-amber-400 placeholder-amber-300 text-amber-50 font-medium"
              placeholder="Enter keywords to search teams (e.g., coders, chess masters)..."
              required
            />
            <p className="text-amber-300 text-sm mt-1">
              Search by team name, description, or keywords
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
            {loading ? 'Searching Teams...' : 'Search Teams'}
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

      {searchResults && (
        <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-3xl mr-2">📊</span>
              <h3 className="text-2xl font-bold">Search Results</h3>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-amber-100">
                {searchResults.nbResults} teams found
              </div>
              <div className="text-amber-300 text-sm">
                Page {searchResults.currentPage} of {searchResults.nbPages}
              </div>
            </div>
          </div>

          {searchResults.currentPageResults.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">🔍</span>
              <p className="text-amber-300 text-lg mb-2">No teams found</p>
              <p className="text-amber-400">Try different keywords or search terms</p>
            </div>
          ) : (
            <>
              {/* Results */}
              <div className="space-y-4 mb-6">
                {searchResults.currentPageResults.map((team) => (
                  <div key={team.id} className="bg-amber-700/30 rounded-lg p-5 border border-amber-600/50">
                    {/* Team Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {team.flair && <span className="text-xl">⚡</span>}
                          <h4 className="text-xl font-bold text-amber-100">{team.name}</h4>
                          <span className="text-amber-300 text-sm">
                            {team.open ? '🌐 Open' : '🔒 Closed'}
                          </span>
                        </div>
                        <div className="text-amber-300 text-sm mb-3">@{team.id}</div>
                        <p className="text-amber-200 text-sm leading-relaxed">
                          {truncateDescription(team.description)}
                        </p>
                      </div>
                    </div>

                    {/* Team Stats and Leader */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Team Leader */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h5 className="text-amber-200 font-semibold mb-2 text-sm">Team Leader</h5>
                        <div className="flex items-center gap-2">
                          {team.leader.title && (
                            <span title={team.leader.title}>{getTitleDisplay(team.leader.title)}</span>
                          )}
                          <span className="text-amber-100 font-semibold">{team.leader.name}</span>
                          {team.leader.patron && <span className="text-amber-200" title="Patron">💎</span>}
                        </div>
                        <div className="text-amber-400 text-xs mt-1">@{team.leader.id}</div>
                      </div>

                      {/* Team Stats */}
                      <div className="bg-amber-600/20 rounded p-3 border border-amber-500/30">
                        <h5 className="text-amber-200 font-semibold mb-2 text-sm">Team Statistics</h5>
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
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center mt-4 space-x-3">
                      <a
                        href={`https://lichess.org/team/${team.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm flex items-center"
                      >
                        <span className="text-lg mr-1">🔗</span>
                        View Team
                      </a>
                      
                      {team.open && (
                        <a
                          href={`https://lichess.org/team/${team.id}/join`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm flex items-center"
                        >
                          <span className="text-lg mr-1">➕</span>
                          Join
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {searchResults.nbPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!searchResults.previousPage}
                    className="px-4 py-2 bg-amber-600/30 hover:bg-amber-600/50 disabled:bg-amber-800/30 disabled:text-amber-500 text-amber-100 rounded-lg font-semibold transition-colors"
                  >
                    ← Previous
                  </button>
                  
                  <span className="px-4 py-2 bg-amber-700/40 text-amber-100 rounded-lg font-semibold">
                    Page {searchResults.currentPage} of {searchResults.nbPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!searchResults.nextPage}
                    className="px-4 py-2 bg-amber-600/30 hover:bg-amber-600/50 disabled:bg-amber-800/30 disabled:text-amber-500 text-amber-100 rounded-lg font-semibold transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}