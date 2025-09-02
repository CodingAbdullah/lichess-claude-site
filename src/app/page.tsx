import { Metadata } from "next";
import LichessNavbar from './components/LichessNavbar';
import FeaturedUserProfile from './components/FeaturedUserProfile';
import ArenaTournaments from './components/ArenaTournaments';
import ArenaTournamentResults from './components/ArenaTournamentResults';
import ArenaTournamentLookup from './components/ArenaTournamentLookup';
import ArenaTournamentGamesExport from './components/ArenaTournamentGamesExport';
import SwissTournamentLookup from './components/SwissTournamentLookup';
import SwissTournamentResults from './components/SwissTournamentResults';
import SwissTournamentGamesExport from './components/SwissTournamentGamesExport';
import UserPlayedTournaments from './components/UserPlayedTournaments';
import UserCreatedTournaments from './components/UserCreatedTournaments';
import TeamLookup from './components/TeamLookup';
import TeamSearch from './components/TeamSearch';
import TeamArenaTournaments from './components/TeamArenaTournaments';
import TeamSwissTournaments from './components/TeamSwissTournaments';
import TournamentTeamStandings from './components/TournamentTeamStandings';
import UserTeams from './components/UserTeams';
import ChallengeCreator from './components/ChallengeCreator';
import FidePlayerSearch from './components/FidePlayerSearch';

interface PlayerPerf {
  rating: number;
  progress: number;
}

interface Player {
  id: string;
  username: string;
  perfs: Record<string, PlayerPerf>;
  title?: string;
  patron?: boolean;
  online?: boolean;
}

interface TVGame {
  user: {
    name: string;
  };
  rating: number;
  gameId: string;
  color: string;
}

export const metadata: Metadata = {
  title: "Lichess General Stats - Lichess Hub",
  description: "General Lichess statistics including global leaderboards, popular openings, and platform metrics.",
  keywords: ["Lichess", "Chess Statistics", "Global Stats", "Chess Metrics", "Leaderboards"],
  openGraph: {
    title: "Lichess General Stats - Lichess Hub",
    description: "Explore general Lichess statistics and global chess data.",
    type: "website"
  }
};

async function getGeneralStats() {
  try {
    const [leaderboardRes, topGamesRes, usersStatusRes, userNotesRes, dailyPuzzleRes, broadcastsRes, tvChannelsRes, streamersRes, externalEnginesRes] = await Promise.all([
      // Mock comprehensive leaderboard data - in production this would call our API
      Promise.resolve({
        ok: true,
        json: async () => ({
          bullet: [
            { id: "rodosfatihi", username: "RoDoSfAtiHi", perfs: { bullet: { rating: 3302, progress: -10 } } },
            { id: "aqua_blazing", username: "Aqua_Blazing", perfs: { bullet: { rating: 3300, progress: -19 } } },
            { id: "arm-777777", username: "ARM-777777", perfs: { bullet: { rating: 3270, progress: 10 } }, title: "GM" }
          ],
          blitz: [
            { id: "ls_kokomo", username: "LS_kokomo", perfs: { blitz: { rating: 3053, progress: 26 } } },
            { id: "bettercollsoul", username: "BetterCollSoul", perfs: { blitz: { rating: 2998, progress: -1 } } },
            { id: "cutemouse83", username: "cutemouse83", perfs: { blitz: { rating: 2971, progress: 10 } }, title: "GM" }
          ],
          rapid: [
            { id: "realmadrid2007", username: "realmadrid2007", perfs: { rapid: { rating: 2969, progress: -18 } } },
            { id: "pap-g", username: "Pap-G", perfs: { rapid: { rating: 2931, progress: 17 } }, title: "GM" },
            { id: "ilqar_7474", username: "ilqar_7474", perfs: { rapid: { rating: 2834, progress: 17 } } }
          ],
          classical: [
            { id: "ojaijoao", username: "OjaiJoao", perfs: { classical: { rating: 2515, progress: 16 } }, title: "FM" },
            { id: "truemasterme", username: "Truemasterme", perfs: { classical: { rating: 2509, progress: 19 } }, title: "FM" },
            { id: "cod_dragon", username: "CoD_Dragon", perfs: { classical: { rating: 2508, progress: 17 } }, online: true }
          ],
          ultraBullet: [
            { id: "ragehunter", username: "Ragehunter", perfs: { ultraBullet: { rating: 2693, progress: -1 } }, title: "FM" },
            { id: "konstantinkornienko", username: "KonstantinKornienko", perfs: { ultraBullet: { rating: 2670, progress: -16 } }, title: "CM" },
            { id: "amethyst27", username: "AmeThyst27", perfs: { ultraBullet: { rating: 2626, progress: 5 } }, patron: true, online: true }
          ],
          crazyhouse: [
            { id: "larso", username: "larso", perfs: { crazyhouse: { rating: 2762, progress: -21 } }, title: "GM" },
            { id: "kingswitcher", username: "Kingswitcher", perfs: { crazyhouse: { rating: 2672, progress: 16 } } },
            { id: "vikal00", username: "vikal00", perfs: { crazyhouse: { rating: 2661, progress: 8 } } }
          ]
        })
      }),
      fetch('https://lichess.org/api/tv/channels', { next: { revalidate: 300 } }),
      // Mock data for users status - in production this would call our API
      Promise.resolve({
        ok: true,
        json: async () => [
          {
            name: "Magnus Carlsen",
            title: "GM",
            flair: "symbols.crown",
            id: "dragnev",
            online: true,
            signal: 4
          },
          {
            name: "Hikaru Nakamura", 
            title: "GM",
            flair: "symbols.lightning",
            id: "hikaru",
            online: true,
            signal: 3,
            playing: {
              id: "abc123",
              variant: "standard",
              speed: "blitz"
            }
          },
          {
            name: "Anna Rudolf",
            title: "WGM",
            flair: "food-drink.coconut", 
            id: "anna_chess",
            online: false
          },
          {
            name: "Levy Rozman",
            flair: "symbols.japanese-no-vacancy-button",
            id: "gothamchess",
            online: true,
            signal: 2
          },
          {
            name: "Alexandra Botez",
            title: "WFM",
            flair: "symbols.crown",
            id: "alexandrabotez",
            online: true,
            signal: 4
          }
        ]
      }),
      // Mock data for user notes - in production this would call our API
      Promise.resolve({
        ok: true,
        json: async () => [
          {
            from: {
              name: "Chess Coach",
              flair: "symbols.crown",
              patron: true,
              id: "coach_mike"
            },
            to: {
              name: "Student Player",
              flair: "food-drink.coconut",
              id: "student_player"
            },
            text: "Great improvement in tactical awareness! Keep practicing those endgames.",
            date: 1745110569899
          },
          {
            from: {
              name: "Tournament Director",
              flair: "symbols.japanese-no-vacancy-button",
              patron: false,
              id: "td_official"
            },
            to: {
              name: "Player A",
              flair: "smileys.grinning-squinting-face",
              id: "player_a"
            },
            text: "Reminder: Next tournament registration closes Friday.",
            date: 1745110563496
          },
          {
            from: {
              name: "Study Partner",
              flair: "symbols.lightning",
              patron: true,
              id: "study_buddy"
            },
            to: {
              name: "Chess Friend",
              flair: "food-drink.coconut",
              id: "chess_friend"
            },
            text: "Let's analyze that game from yesterday - some interesting positions!",
            date: 1745110116435
          },
          {
            from: {
              name: "Chess Mentor",
              flair: "symbols.crown",
              patron: true,
              id: "mentor_gm"
            },
            to: {
              name: "Rising Player",
              flair: "smileys.grinning-squinting-face",
              id: "rising_player"
            },
            text: "Your opening preparation has really paid off. Time to work on middlegame planning.",
            date: 1745109515339
          }
        ]
      }),
      // Mock data for daily puzzle - in production this would call our API
      Promise.resolve({
        ok: true,
        json: async () => ({
          game: {
            id: "HcVUWf38",
            perf: {
              key: "rapid",
              name: "Rapid"
            },
            rated: true,
            players: [
              {
                name: "ajdin_derlic",
                id: "ajdin_derlic",
                color: "white",
                rating: 1908
              },
              {
                name: "magnusrex",
                id: "magnusrex", 
                color: "black",
                rating: 1843
              }
            ],
            pgn: "e4 d5 exd5 Nf6 c4 e6 dxe6 Bxe6 Nc3 Nc6 Nf3 Bc5 h3 Qe7 Be2 Bxc4 O-O O-O-O Bxc4 Nd4 Nxd4 Rxd4 Bb3 g5 Re1 Qd7 Bc2 g4 hxg4 Nxg4 Re4",
            clock: "5+5"
          },
          puzzle: {
            id: "OT8q6",
            rating: 1837,
            plays: 105506,
            solution: [
              "g4f2",
              "d1h5",
              "f2e4"
            ],
            themes: [
              "middlegame",
              "short",
              "advantage"
            ],
            initialPly: 30
          }
        })
      }),
      // Mock broadcasts data - in production this would call our API
      Promise.resolve({
        ok: true,
        json: async () => ({
          tour: {
            id: "sO7W9Jje",
            name: "Knight Invitational",
            slug: "knight-invitational",
            info: {},
            createdAt: 1746738601405,
            url: "https://lichess.org/broadcast/knight-invitational/sO7W9Jje",
            tier: 5,
            dates: [
              1746738601684
            ]
          },
          rounds: [
            {
              id: "eJLgkG7n",
              name: "Round 1",
              slug: "round-1",
              createdAt: 1746738601488,
              ongoing: true,
              startsAt: 1746742201434,
              rated: true,
              url: "https://lichess.org/broadcast/knight-invitational/round-1/eJLgkG7n"
            },
            {
              id: "97ILZHjQ",
              name: "Round 2", 
              slug: "round-2",
              createdAt: 1746738601640,
              ongoing: true,
              startsAt: 1746745801434,
              rated: true,
              url: "https://lichess.org/broadcast/knight-invitational/round-2/97ILZHjQ"
            },
            {
              id: "SqzHhD4p",
              name: "Round 3",
              slug: "round-3",
              createdAt: 1746738601663,
              ongoing: true,
              startsAt: 1746749401434,
              rated: true,
              url: "https://lichess.org/broadcast/knight-invitational/round-3/SqzHhD4p"
            },
            {
              id: "6qYaFbEv",
              name: "Final Round",
              slug: "final-round", 
              createdAt: 1746738601684,
              ongoing: true,
              startsAt: 1746738601684,
              rated: true,
              url: "https://lichess.org/broadcast/knight-invitational/final-round/6qYaFbEv"
            }
          ],
          defaultRoundId: "eJLgkG7n"
        })
      }),
      // Mock TV channels data - in production this would call our API
      Promise.resolve({
        ok: true,
        json: async () => ({
          chess960: {
            user: {
              name: "ADDRESP",
              flair: "nature.crab",
              id: "addresp"
            },
            rating: 2217,
            gameId: "vR3yQVOA",
            color: "black"
          },
          best: {
            user: {
              name: "Olexiy_Bilych",
              title: "IM",
              flair: "activity.trophy",
              id: "olexiy_bilych"
            },
            rating: 2782,
            gameId: "xYfwLFIi",
            color: "black"
          },
          antichess: {
            user: {
              name: "bwmtone",
              flair: "activity.tennis",
              patron: true,
              id: "bwmtone"
            },
            rating: 2245,
            gameId: "wwVmRFKS",
            color: "black"
          },
          computer: {
            user: {
              name: "mathpablo",
              id: "mathpablo"
            },
            rating: 1949,
            gameId: "uAGDSlyB",
            color: "white"
          },
          bullet: {
            user: {
              name: "JurgenSanchez97",
              title: "NM",
              id: "jurgensanchez97"
            },
            rating: 2878,
            gameId: "HilOlgQm",
            color: "black"
          },
          horde: {
            user: {
              name: "ASKCHESS",
              id: "askchess"
            },
            rating: 2150,
            gameId: "ZPnpt4PD",
            color: "black"
          },
          atomic: {
            user: {
              name: "AeFanMu12345",
              flair: "smileys.ghost",
              id: "aefanmu12345"
            },
            rating: 1898,
            gameId: "J9obVj6r",
            color: "black"
          },
          bot: {
            user: {
              name: "MayhemPI_cluster",
              title: "BOT",
              id: "mayhempi_cluster"
            },
            rating: 3213,
            gameId: "TJ0vdQL7",
            color: "white"
          },
          racingKings: {
            user: {
              name: "stillinflipflops",
              id: "stillinflipflops"
            },
            rating: 2301,
            gameId: "enHMb9X9",
            color: "white"
          },
          ultraBullet: {
            user: {
              name: "asteroid44",
              id: "asteroid44"
            },
            rating: 1730,
            gameId: "W5khY2w7",
            color: "black"
          },
          blitz: {
            user: {
              name: "Olexiy_Bilych",
              title: "IM",
              flair: "activity.trophy",
              id: "olexiy_bilych"
            },
            rating: 2782,
            gameId: "xYfwLFIi",
            color: "black"
          },
          kingOfTheHill: {
            user: {
              name: "MaxwellsSilvrHammer",
              flair: "nature.snail",
              id: "maxwellssilvrhammer"
            },
            rating: 2213,
            gameId: "jXDBqUjs",
            color: "white"
          },
          crazyhouse: {
            user: {
              name: "VRDeveloper",
              flair: "smileys.robot",
              id: "vrdeveloper"
            },
            rating: 2263,
            gameId: "VlDXktTm",
            color: "black"
          },
          threeCheck: {
            user: {
              name: "clippencough",
              id: "clippencough"
            },
            rating: 1951,
            gameId: "aElB1lrQ",
            color: "black"
          },
          classical: {
            user: {
              name: "Tsagaanuul0121",
              id: "tsagaanuul0121"
            },
            rating: 1966,
            gameId: "YjEOekEz",
            color: "black"
          },
          rapid: {
            user: {
              name: "FoxyMate1776",
              flair: "activity.chess-pawn",
              id: "foxymate1776"
            },
            rating: 2465,
            gameId: "v050nHBP",
            color: "black"
          }
        })
      }),
      // Mock streamers data - in production this would call our API
      Promise.resolve({
        ok: true,
        json: async () => ([
          {
            name: "PokochajSzachy",
            title: "CM",
            flair: "symbols.orange-heart",
            patron: true,
            id: "pokochajszachy",
            stream: {
              service: "twitch",
              status: "CHess & Chill & Good Music !youtube !instagram lichess.org [EN] [PL]",
              lang: "pl"
            },
            streamer: {
              name: "Pokochaj Szachy",
              headline: "Streaming in Polish and English. Come by and say hello! Pokochaj Szachy to miejsce dla pasjonatów królewskiej gry!",
              description: "Hi! Have a good time watching the stream! I very often play against viewers on DGT chessboard. So, if you would like to play against me just let me know during the stream.  Zapraszam wszystkich do oglądania, i aktywnego uczestnictwa. Łączą nas Szachy!",
              twitch: "https://www.twitch.tv/pokochajszachy",
              image: "https://image.lichess1.org/display?fmt=png&h=350&op=thumbnail&path=pokochajszachy:streamer:pokochajszachy:qfVf3nXP.png&w=350&sig=e329d57f8e6815da63dba66992fa8b3c4b100ba9"
            }
          },
          {
            name: "RESET-101",
            id: "reset-101",
            stream: {
              service: "twitch",
              status: "Playing viewers and 2400 Rapid on lichess.org",
              lang: "en"
            },
            streamer: {
              name: "RESET-101",
              headline: "I stream because I would like to meet similar minded people who share the same enthusiasm for chess",
              twitch: "https://www.twitch.tv/chess_dexter",
              image: "https://image.lichess1.org/display?fmt=webp&h=350&op=thumbnail&path=reset-101:streamer:reset-101:KjGH8CPF.jpg&w=350&sig=a24efd256d7f5feeac638ebd5954ce2902326b2a"
            }
          },
          {
            name: "neverplayslowanti",
            flair: "smileys.hugging-face",
            id: "neverplayslowanti",
            stream: {
              service: "twitch",
              status: "Night Antichess Grind on lichess.org !!",
              lang: "en"
            },
            streamer: {
              name: "ASGM Preslav Petkov",
              headline: "Antichess World Champion & Chess Amateur trying his best to bring you (anti)chess-related content!",
              twitch: "https://www.twitch.tv/neversmartenough",
              image: "https://image.lichess1.org/display?fmt=webp&h=350&op=thumbnail&path=streamer:neverplayslowanti:fl0ap4YM.webp&w=350&sig=568c0f86bf3afc85854bdb1cba80f7bc28b179b1"
            }
          },
          {
            name: "XadrezTotalTV",
            flair: "objects.telescope",
            id: "xadreztotaltv",
            stream: {
              service: "youTube",
              status: "Xadrez Total | Analisando partidas e  batendo papo  Lichess.org",
              lang: "en-US"
            },
            streamer: {
              name: "XadrezTotal",
              headline: "Empresa de Organizaçao de torenios FIDE com comentários de jogadores e árbitros titulados",
              description: "Xadrez Total é uma empresa que organiza torneios FIDE, sob a coordenação do Árbitro Internacional Mauro Amaral. \r\nTrabalhamos e/ou organizamos em masi de 15 páises, e em mais de 30 torneios do Calendário da FIDE, tais como Olimpíadas, Campeonatos Mundiais, Continetais FIDE, Pan-Americanos, Sul-Americanos e Zonais 2.4 FIDE, além de mais de uma centena de torneios Open e ITTs fechados de Norma de GM, MI, WGM e WIM ! ",
              twitch: "https://www.twitch.tv/xadreztotaltv",
              youTube: "https://www.youtube.com/channel/UCl0pW-vG9r8AT8N2bJdMu8Q/live",
              image: "https://image.lichess1.org/display?fmt=webp&h=350&op=thumbnail&path=xadreztotaltv:streamer:xadreztotaltv:4DueCXhP.jpg&w=350&sig=e5fb7e683cb3ec7258778f727decd50b0495417a"
            }
          },
          {
            name: "JaquetonEnigmatico",
            id: "jaquetonenigmatico",
            stream: {
              service: "twitch",
              status: "tratando de volver al prime lichess.org",
              lang: "es"
            },
            streamer: {
              name: "JaquetonEnigmatico",
              headline: "jugador malo xd",
              description: "aprendi a jugar a los 10 y ahora voy a demostrar lo poco que se xd",
              twitch: "https://www.twitch.tv/gablots_gyt"
            }
          }
        ])
      }),
      // Mock external engines data - in production this would call our API
      Promise.resolve({
        ok: true,
        json: async () => ([
          {
            id: "eei_n7icubLdRJYm",
            name: "Stockfish 17",
            userId: "bobby",
            maxThreads: 8,
            maxHash: 2048,
            variants: [
              "chess"
            ],
            providerData: null,
            clientSecret: "ees_rR288clqHjNElDiP"
          },
          {
            id: "eei_m8jdvcKeRKZn",
            name: "Stockfish 16",
            userId: "magnus_ai",
            maxThreads: 16,
            maxHash: 4096,
            variants: [
              "chess",
              "chess960"
            ],
            providerData: null,
            clientSecret: "ees_sS399dmrIkOFmEjQ"
          },
          {
            id: "eei_p9kefLmsTUAo",
            name: "Leela Chess Zero",
            userId: "deepmind_chess",
            maxThreads: 4,
            maxHash: 1024,
            variants: [
              "chess"
            ],
            providerData: null,
            clientSecret: "ees_tT410ensBLPGnFkR"
          }
        ])
      })
    ]);

    const leaderboard = leaderboardRes.ok ? await leaderboardRes.json() : null;
    const topGames = topGamesRes.ok ? await topGamesRes.json() : null;
    const usersStatus = usersStatusRes.ok ? await usersStatusRes.json() : null;
    const userNotes = userNotesRes.ok ? await userNotesRes.json() : null;
    const dailyPuzzle = dailyPuzzleRes.ok ? await dailyPuzzleRes.json() : null;
    const broadcasts = broadcastsRes.ok ? await broadcastsRes.json() : null;
    const tvChannels = tvChannelsRes.ok ? await tvChannelsRes.json() : null;
    const streamers = streamersRes.ok ? await streamersRes.json() : null;
    const externalEngines = externalEnginesRes.ok ? await externalEnginesRes.json() : null;

    return { leaderboard, topGames, usersStatus, userNotes, dailyPuzzle, broadcasts, tvChannels, streamers, externalEngines };
  } catch (error) {
    console.error('Error fetching general stats:', error);
    return { leaderboard: null, topGames: null, usersStatus: null, userNotes: null, dailyPuzzle: null, broadcasts: null, tvChannels: null, streamers: null, externalEngines: null };
  }
}

export default async function Home() {
  const { leaderboard, topGames } = await getGeneralStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Navigation */}
      <LichessNavbar />
      
      {/* Chess Board Pattern Background */}
      <div className="fixed inset-0 opacity-15 pointer-events-none">
        <div className="w-full h-full" style={{
          backgroundImage: `repeating-conic-gradient(#8b4513 0% 25%, #d4a574 25% 50%)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      <div className="relative container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <span className="text-6xl mr-4">♔</span>
            <h1 className="text-5xl font-bold text-amber-900 drop-shadow-lg">Lichess General Statistics</h1>
            <span className="text-6xl ml-4">♛</span>
          </div>
          <p className="text-xl text-amber-800">Explore global chess statistics and leaderboards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Players Section */}
          <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl mr-2">👑</span>
              <h2 className="text-2xl font-bold">Top Players Leaderboards</h2>
            </div>
            {leaderboard ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(leaderboard).map(([variant, players]: [string, Player[]]) => (
                  <div key={variant} className="bg-amber-700/30 rounded-lg p-4 border border-amber-600/50">
                    <h3 className="text-lg font-semibold capitalize mb-3 text-amber-200 flex items-center">
                      <span className="text-2xl mr-2">
                        {variant === 'bullet' ? '•' : 
                         variant === 'ultraBullet' ? '💥' : 
                         variant === 'blitz' ? '⚔️' : 
                         variant === 'rapid' ? '🏃' : 
                         variant === 'classical' ? '⬛' : 
                         variant === 'crazyhouse' ? '🏠' :
                         variant === 'chess960' ? '🎲' :
                         variant === 'kingOfTheHill' ? '👑' :
                         variant === 'threeCheck' ? '✓' :
                         variant === 'antichess' ? '🔄' :
                         variant === 'atomic' ? '💥' :
                         variant === 'horde' ? '⚔️' :
                         variant === 'racingKings' ? '🏃‍♂️' : '♞'}
                      </span>
                      {variant.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {players.slice(0, 3).map((player, index: number) => (
                        <div key={player.id} className="flex items-center justify-between bg-amber-600/20 rounded p-3">
                          <div className="flex items-center">
                            <div className="text-lg mr-3">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </div>
                            <div>
                              <div className="flex items-center">
                                <span className="font-bold text-amber-100 mr-2">{player.username}</span>
                                {player.title && (
                                  <span className="px-2 py-1 bg-amber-600 text-amber-100 text-xs rounded font-bold mr-2">
                                    {player.title}
                                  </span>
                                )}
                                {player.patron && (
                                  <span className="text-yellow-400" title="Patron">⭐</span>
                                )}
                                {player.online && (
                                  <div className="w-2 h-2 bg-green-400 rounded-full ml-2" title="Online"></div>
                                )}
                              </div>
                              <div className="text-sm text-amber-400">@{player.id}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-amber-100">
                              {String(Object.values(player.perfs)[0]?.rating || 'N/A')}
                            </div>
                            <div className={`text-sm ${Object.values(player.perfs)[0]?.progress >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {Object.values(player.perfs)[0]?.progress >= 0 ? '+' : ''}
                              {Object.values(player.perfs)[0]?.progress || 0}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">♟️</span>
                <p className="text-amber-300">Unable to load leaderboard data</p>
              </div>
            )}
          </div>

          {/* Live TV Games */}
          <div className="bg-gradient-to-br from-amber-800 to-amber-900 text-amber-50 rounded-2xl p-6 shadow-2xl border-4 border-amber-600">
            <div className="flex items-center justify-center mb-4">
              <span className="text-3xl mr-2">📺</span>
              <h2 className="text-2xl font-bold">Live TV Games</h2>
            </div>
            {topGames && typeof topGames === 'object' ? (
              <div className="space-y-3">
                {Object.entries(topGames).slice(0, 6).map(([channel, game]) => {
                  const typedGame = game as TVGame;
                  return (
                  <div key={channel} className="bg-amber-700/30 rounded-lg p-3 border border-amber-600/50">
                    <h3 className="font-semibold capitalize mb-2 text-amber-200 flex items-center">
                      <span className="text-xl mr-2">⚔️</span>
                      {channel.replace(/([A-Z])/g, ' $1')}
                    </h3>
                    {typedGame && typeof typedGame === 'object' && 'user' in typedGame && typedGame.user && (
                      <div className="text-sm text-amber-100">
                        <div className="flex items-center justify-between">
                          <span>
                            {typedGame.color === 'white' ? '♔' : '♛'} {typedGame.user?.name || 'Anonymous'}
                          </span>
                          <span className="text-amber-300">
                            {typedGame.rating ? `(${typedGame.rating})` : ''}
                          </span>
                        </div>
                        <div className="text-xs mt-1 text-center text-amber-300">
                          {channel.replace(/([A-Z])/g, ' $1')}
                          {typedGame.gameId ? ` • Game ID: ${typedGame.gameId}` : ''}
                        </div>
                      </div>
                    )}
                  </div>
                );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">♟️</span>
                <p className="text-amber-300">Unable to load live games</p>
              </div>
            )}
          </div>
        </div>

        {/* Users Section */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-amber-900 drop-shadow-lg flex items-center justify-center">
              <span className="text-5xl mr-4">👥</span>
              Users
              <span className="text-5xl ml-4">👥</span>
            </h2>
            <p className="text-xl text-amber-800 mt-2">User profiles and statistics</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FeaturedUserProfile />
            <UserPlayedTournaments username="carlsen" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <UserCreatedTournaments username="carlsen" />
            <UserTeams username="carlsen" />
          </div>
        </div>

        {/* Tournaments Section */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-amber-900 drop-shadow-lg flex items-center justify-center">
              <span className="text-5xl mr-4">🏆</span>
              Tournaments
              <span className="text-5xl ml-4">🏆</span>
            </h2>
            <p className="text-xl text-amber-800 mt-2">Arena and Swiss tournament management</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ArenaTournaments />
            <ArenaTournamentResults />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <ArenaTournamentLookup />
            <SwissTournamentLookup />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <SwissTournamentResults tournamentId="example-swiss-tournament" />
            <TournamentTeamStandings />
          </div>
        </div>

        {/* Games Section */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-amber-900 drop-shadow-lg flex items-center justify-center">
              <span className="text-5xl mr-4">♟️</span>
              Games
              <span className="text-5xl ml-4">♟️</span>
            </h2>
            <p className="text-xl text-amber-800 mt-2">Game exports and challenges</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ArenaTournamentGamesExport />
            <SwissTournamentGamesExport tournamentId="example-swiss-tournament" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <ChallengeCreator />
          </div>
        </div>

        {/* Teams Section */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-amber-900 drop-shadow-lg flex items-center justify-center">
              <span className="text-5xl mr-4">👨‍👩‍👧‍👦</span>
              Teams
              <span className="text-5xl ml-4">👨‍👩‍👧‍👦</span>
            </h2>
            <p className="text-xl text-amber-800 mt-2">Team management and tournaments</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TeamLookup />
            <TeamSearch />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <TeamArenaTournaments />
            <TeamSwissTournaments />
          </div>
        </div>

        {/* FIDE Section */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-amber-900 drop-shadow-lg flex items-center justify-center">
              <span className="text-5xl mr-4">🌍</span>
              FIDE
              <span className="text-5xl ml-4">🌍</span>
            </h2>
            <p className="text-xl text-amber-800 mt-2">FIDE player search and ratings</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FidePlayerSearch />
          </div>
        </div>

        <div className="text-center mt-12">
          <a 
            href="/profile" 
            className="inline-flex items-center bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-amber-500"
          >
            <span className="text-2xl mr-2">👤</span>
            View Individual Profile Stats
          </a>
        </div>
      </div>
    </div>
  );
}
