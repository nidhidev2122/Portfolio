import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { useEffect } from "react";
   import portraitAsset from "../assets/dev-nidhi-portrait.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bellary Dev Nidhi | Software & AI/ML Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Dev Nidhi, a software and AI/ML engineer building NLP, data analytics, and full-stack projects.",
      },
      { property: "og:title", content: "Dev Nidhi | Software & AI/ML Engineer" },
      {
        property: "og:description",
        content: "Selected AI, machine learning, analytics, and full-stack work by Dev Nidhi.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const projects = [
  {
    number: "01",
    title: "Medix",
    description:
      "A symptom-based disease prediction system comparing Naive Bayes and Logistic Regression across 15+ disease categories.",
    outcome: "NLP classification · 15+ categories",
    tags: ["PYTHON", "NLTK", "SCIKIT-LEARN", "TF-IDF", "STREAMLIT"],
  },
  {
    number: "02",
    title: "FIXIO",
    description:
      "A multi-page home services marketplace with service booking flows and a responsive dark interface, built in a five-person team.",
    outcome: "Full-stack platform · 5-member team",
    tags: ["JAVASCRIPT", "NODE.JS", "EXPRESS", "MONGODB"],
  },
  {
    number: "03",
    title: "Netflix Content Analysis",
    description:
      "A streaming-content analysis spanning 8,000+ titles, with five dashboards exploring genre and regional distribution.",
    outcome: "8,000+ titles · 12 DAX measures",
    tags: ["POWER BI", "DAX", "POWER QUERY", "EXCEL"],
  },
  {
    number: "04",
    title: "Student Carbon Footprint Tracker",
    description:
      "A sustainability analytics dashboard for category-level emissions analysis across more than 500 student records.",
    outcome: "500+ records · 4 dashboard views",
    tags: ["POWER BI", "DATA ANALYTICS"],
  },
];

const certifications = [
  ["Amazon", "Full Stack Web Development"],
  ["Google", "Introduction to Generative AI"],
  ["IBM", "Data Warehouse Fundamentals"],
  ["Meta", "Introduction to Databases"],
  ["Illinois", "Data Visualization"],
];

function Index() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.12 },
    );

    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased selection:bg-accent/15 selection:text-accent">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#top" className="font-display text-lg font-extrabold">DEV NIDHI</a>
          <div className="hidden items-center gap-8 font-mono text-[11px] uppercase md:flex">
            <a href="#about" className="nav-link">00 / About</a>
            <a href="#work" className="nav-link">01 / Work</a>
            <a href="#skills" className="nav-link">02 / Expertise</a>
            <a href="#details" className="nav-link">03 / Details</a>
            <a href="#contact" className="contact-link">Contact</a>
          </div>
          <a href="mailto:nidhidev2007@gmail.com" aria-label="Email Dev Nidhi" className="nav-mail md:hidden">
            <Mail size={17} aria-hidden="true" />
          </a>
        </div>
      </nav>

      <main id="top" className="mx-auto max-w-7xl px-5 pt-28 md:px-8 md:pt-32">
        <section id="about" className="scroll-mt-24 grid grid-cols-1 items-center gap-10 pb-20 lg:grid-cols-2 lg:gap-16 lg:pb-28">
          <div className="order-2 lg:order-1">
            <p className="hero-kicker">Software & AI/ML Engineer</p>
            <h1 className="hero-title">Building intelligent systems for human needs.</h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
              I'm Dev Nidhi, a BCA (AI & ML) student at Alliance University. I work across NLP, predictive modeling, and data analytics — turning messy data into models and tools people can actually use. Every project is a problem I want to understand end to end, from research notebook to shipped interface.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#work" className="contact-link">View selected work <ArrowDown size={15} aria-hidden="true" /></a>
              <a href="#contact" className="nav-mail" aria-label="Get in touch">Let's talk</a>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="portrait-reveal overflow-hidden rounded-sm bg-secondary">
              <img src={portraitAsset} alt="Dev Nidhi, software and AI/ML engineer" className="aspect-[4/5] w-full object-cover object-center" />
            </div>
          </div>
        </section>

        <section id="work" className="scroll-mt-24 py-20 md:py-28">
          <div data-reveal className="section-heading reveal-item">
            <h2>Featured Projects</h2>
            <span>SELECTED WORK · 2024—PRESENT</span>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article key={project.title} data-reveal className="project-item reveal-item" style={{ transitionDelay: `${index * 70}ms` }}>
                <div className="mb-12 flex items-start justify-between gap-4">
                  <span className="font-mono text-xs text-accent">{project.number}</span>
                  <div className="flex max-w-[80%] flex-wrap justify-end gap-1.5">
                    {project.tags.map((tag) => <span key={tag} className="tech-tag">{tag}</span>)}
                  </div>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-outcome">{project.outcome}</div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="scroll-mt-24 py-20 md:py-28">
          <div data-reveal className="section-heading reveal-item">
            <h2>Technical Core</h2>
            <span>TOOLS I WORK WITH</span>
          </div>
          <div className="grid gap-px border border-border bg-border md:grid-cols-3">
            {[
              ["01", "Languages", "Python, SQL, JavaScript, HTML, CSS"],
              ["02", "Web Engineering", "React, Node.js, Express, Flask, Streamlit"],
              ["03", "Data & Machine Learning", "NumPy, Pandas, Scikit-learn, NLTK, Power BI"],
              ["04", "Databases", "MySQL, MongoDB"],
              ["05", "Development", "Git, GitHub, VS Code, Jupyter Notebook"],
              ["06", "Platforms", "Google Colab, Excel, Power Query, DAX"],
            ].map(([number, title, body], index) => (
              <div key={title} data-reveal className="skill-cell reveal-item" style={{ transitionDelay: `${index * 50}ms` }}>
                <span>{number}</span><h3>{title}</h3><p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="details" className="scroll-mt-24 grid gap-16 py-20 md:grid-cols-12 md:py-28">
          <div data-reveal className="reveal-item md:col-span-5">
            <p className="eyebrow">Education</p>
            <div className="education-block">
              <p>2024 — PRESENT</p>
              <h2>BCA in Artificial Intelligence & Machine Learning</h2>
              <span>Alliance University · Bangalore, Karnataka</span>
            </div>
            <div className="mt-8 space-y-2 text-sm text-muted-foreground">
              <p>HSC (CBSE) · Vibgyor High</p>
              <p>SSLC (CBSE) · Vibgyor High</p>
            </div>
          </div>
          <div data-reveal className="reveal-item md:col-span-7">
            <p className="eyebrow">Certifications</p>
            <div className="border-t border-border">
              {certifications.map(([issuer, title]) => (
                <div key={title} className="credential-row">
                  <span>{issuer}</span><p>{title}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer id="contact" className="scroll-mt-24 border-t border-border py-20 text-center md:py-28">
          <p data-reveal className="eyebrow reveal-item">Open to software and AI/ML opportunities</p>
          <h2 data-reveal className="reveal-item mx-auto mt-5 max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-6xl">Let&apos;s build something useful.</h2>
          <a href="mailto:nidhidev2007@gmail.com" className="email-link">nidhidev2007@gmail.com <ArrowUpRight size={18} /></a>
          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 font-mono text-[11px] uppercase">
            <a className="social-link" href="https://linkedin.com/in/nidhi-dev" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a>
            <a className="social-link" href="https://github.com/nidhidev2122" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>
            <a className="social-link" href="https://hackerrank.com/profile/nidhidev2007" target="_blank" rel="noreferrer">HackerRank <ArrowUpRight size={13} /></a>
            <a className="social-link" href="https://leetcode.com/u/nidhi212" target="_blank" rel="noreferrer">LeetCode <ArrowUpRight size={13} /></a>
          </div>
          <p className="mt-20 font-mono text-[10px] uppercase text-muted-foreground">© 2026 Dev Nidhi · AI/ML Engineering</p>
        </footer>
      </main>
    </div>
  );
}
