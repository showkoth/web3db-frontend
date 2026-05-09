import {
  AlertTriangle,
  Database,
  ExternalLink,
  Lock,
  Network,
  Shield,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SplineHero } from '@/components/spline-hero';
import { Button } from '@/components/ui/button';

const SPLINE_SCENE = 'https://prod.spline.design/G-ZkNll36P6FOfVW/scene.splinecode';

export const metadata: Metadata = {
  title: 'web3db — Decentralized SQL with on-chain access policies',
  description:
    'Encrypted, IPFS-backed SQL database with smart-contract access control and tamper-evident audit logs.',
};

const FEATURE_TONES = [
  {
    icon: 'text-cyan-400',
    title: 'text-cyan-400',
    border: 'border-cyan-500/40 hover:border-cyan-400 hover:shadow-cyan-500/20',
    bg: 'bg-cyan-500/5',
  },
  {
    icon: 'text-emerald-400',
    title: 'text-emerald-400',
    border: 'border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/20',
    bg: 'bg-emerald-500/5',
  },
  {
    icon: 'text-amber-400',
    title: 'text-amber-400',
    border: 'border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/20',
    bg: 'bg-amber-500/5',
  },
] as const;

const FEATURES = [
  {
    icon: Lock,
    title: 'End-to-end encrypted',
    body: 'Your data is encrypted before it leaves your device.',
  },
  {
    icon: Network,
    title: 'Censorship-resistant',
    body: 'Data is stored decentralized across the network.',
  },
  {
    icon: Shield,
    title: 'On-chain access & audit',
    body: 'Grant, revoke, and audit access — every action signed on-chain.',
  },
  {
    icon: Database,
    title: 'Universal SQL interface',
    body: 'Query with standard SQL. No new language to learn.',
  },
  {
    icon: Users,
    title: 'Open consortium',
    body: 'Multi-tenant by design. Anyone can join and share data securely.',
  },
] as const;

const CURRENT_DEVELOPERS = [
  {
    name: 'Showkot Hossain',
    role: 'Student',
    affiliation: 'University of Notre Dame',
    img: '/team/showkot.jpg',
    url: 'https://www.linkedin.com/in/showkoth/',
  },
  {
    name: 'Wenyi Tang',
    role: 'Student',
    affiliation: 'Indiana University',
    img: '/team/Wenyi.png',
    url: 'https://www.linkedin.com/in/wenyi-tang-nd/',
  },
  {
    name: 'Changhao Chenli',
    role: 'Assistant Professor',
    affiliation: 'Indiana Institute of Technology',
    img: '/team/Changhao.png',
    url: 'https://www.linkedin.com/in/changhao-chenli-116081185/',
  },
  {
    name: 'Avery Hughes',
    role: 'Student',
    affiliation: 'Indiana Institute of Technology',
    img: '/team/Avery.png',
    url: 'https://www.linkedin.com/in/avery-hughes06/',
  },
  {
    name: 'Mohit Naik',
    role: 'Student',
    affiliation: 'University of Georgia',
    img: '/team/Mohit.png',
    url: 'https://www.linkedin.com/in/mohit-naik21/',
  },
] as const;

const PRINCIPAL_INVESTIGATORS = [
  {
    name: 'Taeho Jung',
    role: 'Associate Professor',
    affiliation: 'University of Notre Dame',
    img: '/team/taeho.jpg',
    url: 'https://sites.nd.edu/taeho-jung/',
  },
  {
    name: 'WenZhan Song',
    role: 'Professor',
    affiliation: 'University of Georgia',
    img: '/team/wenzhan.jpg',
    url: 'https://sensorweb.engr.uga.edu/index.php/song/',
  },
  {
    name: 'Haijian Sun',
    role: 'Assistant Professor',
    affiliation: 'University of Georgia',
    img: '/team/HaijanPhoto.jpg',
    url: 'https://esi.uga.edu/',
  },
] as const;

const STATS = [
  { value: '100%', label: 'Decentralized storage', color: 'text-cyan-400' },
  { value: 'Zero', label: 'Single points of failure', color: 'text-emerald-400' },
  { value: 'TEE', label: 'Hardware-secured compute', color: 'text-amber-400' },
] as const;

const SPONSORS = [
  { src: '/sponsors/NsfGrant.png', alt: 'NSF', invert: false },
  { src: '/sponsors/NotreDame.png', alt: 'University of Notre Dame', invert: true },
  { src: '/sponsors/UGA.png', alt: 'University of Georgia', invert: false },
] as const;

type Person = {
  name: string;
  role: string;
  affiliation: string;
  img: string;
  url: string;
};

function PersonCard({ person }: { person: Person }) {
  return (
    <a
      href={person.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full flex-col items-center gap-2 rounded-xl border bg-card p-5 text-center transition-all hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10 sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={person.img}
        alt={person.name}
        className="h-24 w-24 rounded-full object-cover ring-2 ring-cyan-400/70 ring-offset-2 ring-offset-card"
      />
      <div className="mt-2 inline-flex items-center gap-1.5 text-lg font-semibold tracking-tight transition-colors group-hover:text-cyan-400">
        {person.name}
        <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="text-sm text-muted-foreground">{person.role}</div>
      <div className="text-sm text-cyan-400/80">{person.affiliation}</div>
    </a>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-14 items-center justify-between border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Database className="h-5 w-5" />
          web3db
        </Link>
        <Button render={<Link href="/query" />} size="sm">
          Open App
        </Button>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            <SplineHero scene={SPLINE_SCENE} />
          </div>
          <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,theme(colors.foreground/8%),transparent_60%)] md:hidden" />
          <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-center gap-6 px-6 py-24 md:items-start md:py-32 md:text-left">
            <h1 className="font-mono text-5xl font-extrabold tracking-[0.4rem] sm:text-6xl md:text-7xl">
              <span className="bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">
                WEB3DB.ORG
              </span>
            </h1>
            <h2 className="max-w-3xl text-balance text-3xl font-semibold leading-tight text-foreground/90 sm:text-4xl md:text-5xl">
              Decentralized Zero-Trust Computing and Storage
            </h2>
            <p className="max-w-3xl text-pretty text-xl leading-relaxed text-foreground/80 sm:text-2xl">
              Web3DB restores data ownership to individuals — fine-grained access control,
              secure query processing, and safe sharing. Built on blockchain, IPFS, and trusted
              execution environments (TEEs). Anyone can join and contribute.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <Button
                render={<Link href="/query" />}
                size="lg"
                className="h-12 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 text-base font-semibold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-600 hover:to-emerald-600"
              >
                🚀 Try Demo
              </Button>
              <Button
                render={
                  <a
                    href="https://docs.web3db.org/docs/intro"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Documentation"
                  >
                    📖 Documentation
                  </a>
                }
                size="lg"
                variant="outline"
                className="h-12 rounded-xl px-6 text-base"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-12 text-center text-5xl font-bold tracking-tight sm:text-6xl">
            Why Web3DB?
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {FEATURES.map(({ icon: Icon, title, body }, i) => {
              const tone = FEATURE_TONES[(i + Math.floor(i / 3)) % FEATURE_TONES.length]!;
              return (
                <div
                  key={title}
                  className={`group w-full rounded-xl border-2 sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] ${tone.border} ${tone.bg} p-6 text-center backdrop-blur transition-all hover:-translate-y-2 hover:shadow-xl`}
                >
                  <Icon className={`mx-auto h-10 w-10 ${tone.icon}`} />
                  <div className={`mt-4 text-xl font-semibold tracking-tight ${tone.title}`}>
                    {title}
                  </div>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-balance text-center text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              A platform that guarantees individual data ownership, privacy, and secure
              computation altogether.
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <div
                    className={`text-5xl font-extrabold tracking-tight sm:text-6xl ${s.color}`}
                  >
                    {s.value}
                  </div>
                  <div className="mt-3 text-base text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-6 py-12">
            <div className="flex gap-4 rounded-lg border border-amber-500/30 bg-amber-500/[0.04] p-6">
              <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-amber-400" />
              <div>
                <h3 className="text-lg font-semibold uppercase tracking-wider text-amber-400">
                  Disclaimer
                </h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  Use Web3DB at your own risk. Web3DB is a research-oriented project that evolves
                  alongside ongoing state-of-the-art research conducted by our team. The authors,
                  contributors, principal investigators, and affiliated parties assume no
                  responsibility for any consequences arising from the use of this platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="text-center">
              <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                Meet the team
              </h2>
              <p className="mt-4 text-base font-semibold uppercase tracking-wider text-primary">
                Current developers
              </p>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {CURRENT_DEVELOPERS.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </div>

            <h3 className="mt-20 text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Principal investigators
            </h3>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {PRINCIPAL_INVESTIGATORS.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center">
            <h2 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Supported by
            </h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              This project is sponsored by NSF under Grant No. OAC-2312973 &amp; OAC-2312974, and
              the Cascarilla Blockchain Endowment Fund.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-12">
              {SPONSORS.map((s) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={s.src}
                  src={s.src}
                  alt={s.alt}
                  className={`h-14 w-auto object-contain ${s.invert ? 'brightness-0 invert' : ''}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Web3DB. Developed and maintained by Showkot Hossain. All
        rights reserved.
      </footer>
    </div>
  );
}
