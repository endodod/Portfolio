"use client";
import { useEffect, useState } from "react";
import Console from "@/components/Console";
import { profile } from "@/content/profile";
import { alignList } from "@/lib/alignList";

const { name, role, location, school, contact, stack } = profile;

const QUICK_COMMANDS = [
  { label: "Home", command: "cd ~" },
];

const TAG_COLORS = [
  "about-tag--c1", "about-tag--c2", "about-tag--c3", "about-tag--c4", "about-tag--c5",
];

// Each stack row gets one consistent color, distinct from the row above/below it.
function tagClass(rowIndex) {
  return `about-tag ${TAG_COLORS[rowIndex % TAG_COLORS.length]}`;
}

export default function AboutPage() {
  const [topArtists, setTopArtists] = useState(["loading..."]);
  const [recentGames, setRecentGames] = useState(["loading..."]);
  const [recentChamps, setRecentChamps] = useState(["loading..."]);
  const [spotifyAccount, setSpotifyAccount] = useState(null);
  const [steamAccount, setSteamAccount] = useState(null);
  const [riotAccount, setRiotAccount] = useState(null);

  useEffect(() => {
    fetch("/api/spotify-top")
      .then((r) => r.json())
      .then((d) => {
        setTopArtists(d.error ? ["(unavailable)"] : alignList(d.artists, (a) => (a.hours != null ? `${a.hours}h` : `${a.tracks} tracks`)));
        setSpotifyAccount(d.account || null);
      })
      .catch(() => setTopArtists(["(unavailable)"]));

    fetch("/api/steam-recent")
      .then((r) => r.json())
      .then((d) => {
        setRecentGames(d.error ? ["(unavailable)"] : d.games.map((g) => g.name));
        setSteamAccount(d.account || null);
      })
      .catch(() => setRecentGames(["(unavailable)"]));

    fetch("/api/riot-recent")
      .then((r) => r.json())
      .then((d) => {
        setRecentChamps(d.error ? ["(unavailable)"] : alignList(d.champions, (c) => `${Math.round(c.points / 1000)}k pts`));
        setRiotAccount(d.account || null);
      })
      .catch(() => setRecentChamps(["(unavailable)"]));
  }, []);

  return (
    <main className="home home--fixed console">
      <div className="home-shell home-shell--stack">

        {/* Background decorative windows */}
        <section className="desktop-window desktop-window--about-lang" aria-hidden="true">
          <div className="desktop-header">
            <span className="desktop-title">languages.txt</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green">## spoken languages</span>
              <span className="desktop-line"> </span>
              <span className="desktop-line">german   {"██████████"}  C2</span>
              <span className="desktop-line">english  {"████████░░"}  C1</span>
              <span className="desktop-line">french   {"███████░░░"}  B2</span>
            </pre>
          </div>
        </section>

        <section className="desktop-window desktop-window--about-spotify">
          <div className="desktop-header">
            <span className="desktop-title">spotify.txt</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green">## top artists this month</span>
              {spotifyAccount && (
                <span className="desktop-line">
                  account: <a className="desktop-link" href={spotifyAccount.url} target="_blank" rel="noopener noreferrer">{spotifyAccount.name}</a>
                </span>
              )}
              <span className="desktop-line"> </span>
              {topArtists.map((line, i) => (
                <span key={i} className="desktop-line">{i + 1}. {line}</span>
              ))}
            </pre>
          </div>
        </section>

        <section className="desktop-window desktop-window--about-steam">
          <div className="desktop-header">
            <span className="desktop-title">steam.txt</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green">## last 5 games played</span>
              {steamAccount && (
                <span className="desktop-line">
                  account: <a className="desktop-link" href={steamAccount.url} target="_blank" rel="noopener noreferrer">{steamAccount.name}</a>
                </span>
              )}
              <span className="desktop-line"> </span>
              {recentGames.map((line, i) => (
                <span key={i} className="desktop-line">{i + 1}. {line}</span>
              ))}
            </pre>
          </div>
        </section>

        <section className="desktop-window desktop-window--about-riot">
          <div className="desktop-header">
            <span className="desktop-title">league-of-legends.txt</span>
          </div>
          <div className="desktop-body">
            <pre>
              <span className="desktop-line text-green">## top champion masteries</span>
              {riotAccount && (
                <span className="desktop-line">
                  account: <a className="desktop-link" href={riotAccount.url} target="_blank" rel="noopener noreferrer">{riotAccount.name}</a>
                </span>
              )}
              <span className="desktop-line"> </span>
              {recentChamps.map((line, i) => (
                <span key={i} className="desktop-line">{i + 1}. {line}</span>
              ))}
            </pre>
          </div>
        </section>

        {/* Main about file viewer */}
        <section className="about-window" aria-label="About me — file viewer">
          <div className="console-header">
            <span className="console-dot console-dot--red" />
            <span className="console-dot console-dot--yellow" />
            <span className="console-dot console-dot--green" />
            <span className="console-title">cat about-me.txt — paul @ portfolio</span>
          </div>

          <div className="about-body">
            {/* identity + contact side by side */}
            <div className="about-top-row">
              <div className="about-section">
                <span className="about-comment">## identity</span>
                <div className="about-field">
                  <span className="about-key">name</span>
                  <span className="about-sep">:</span>
                  <span className="about-value about-value--accent">{name}</span>
                </div>
                <div className="about-field">
                  <span className="about-key">role</span>
                  <span className="about-sep">:</span>
                  <span className="about-value">{role}</span>
                </div>
                <div className="about-field">
                  <span className="about-key">location</span>
                  <span className="about-sep">:</span>
                  <span className="about-value">{location}</span>
                </div>
                <div className="about-field">
                  <span className="about-key">school</span>
                  <span className="about-sep">:</span>
                  <span className="about-value">{school}</span>
                </div>
              </div>

              <div className="about-section">
                <span className="about-comment">## contact</span>
                <div className="about-field">
                  <span className="about-key">email</span>
                  <span className="about-sep">:</span>
                  <span className="about-value">{contact.email}</span>
                </div>
                <div className="about-field">
                  <span className="about-key">github</span>
                  <span className="about-sep">:</span>
                  <a className="about-value about-value--link" href={contact.githubUrl} target="_blank" rel="noopener noreferrer">{contact.github}</a>
                </div>
                <div className="about-field">
                  <span className="about-key">linkedin</span>
                  <span className="about-sep">:</span>
                  <a className="about-value about-value--link" href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">{contact.linkedin}</a>
                </div>
              </div>
            </div>

            {/* stack full width below */}
            <div className="about-section about-section--stack">
              <span className="about-comment">## stack</span>
              <div className="about-field">
                <span className="about-key">languages</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  {stack.languages.map((l) => <span className={tagClass(0)} key={l}>{l}</span>)}
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">frameworks</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  {stack.frameworks.map((f) => <span className={tagClass(1)} key={f}>{f}</span>)}
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">databases</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  {stack.databases.map((d) => <span className={tagClass(2)} key={d}>{d}</span>)}
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">tools</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  {stack.tools.map((t) => <span className={tagClass(3)} key={t}>{t}</span>)}
                </span>
              </div>
              <div className="about-field">
                <span className="about-key">certificates</span>
                <span className="about-sep">:</span>
                <span className="about-value">
                  {stack.certificates.map((c) => <span className={tagClass(4)} key={c}>{c}</span>)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <Console quickCommands={QUICK_COMMANDS} autoRun={false} dirs={{}} />
      </div>
    </main>
  );
}
