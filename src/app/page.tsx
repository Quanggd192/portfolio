import { CareerChat } from "@/components/career-chat";
import { skills, timeline } from "@/lib/profile";

export default function Home() {
  return (
    <div className="page-shell">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-12">
        <section className="glass-panel hero-panel reveal">
          <span className="eyebrow">Enterprise meets edgy</span>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Nguyen Quang
          </h1>
          <p className="mt-4 max-w-3xl text-xl text-slate-300 sm:text-2xl">
            Professional FE Developer and Project Leader crafting digital
            products with clean systems, sharp UX, and reliable execution.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="chip">Hanoi, Vietnam</span>
            <span className="chip">Open to Remote / Freelance</span>
            <span className="chip">8+ Years in Product Delivery</span>
          </div>
          <div className="mt-10 flex flex-wrap items-start gap-4">
            <details className="contact-menu">
              <summary className="btn btn-primary contact-trigger">
                Contact Me
              </summary>
              <div className="contact-panel">
                <p className="contact-panel-title">Choose your preferred way to connect</p>
                <div className="contact-options">
                  <a
                    className="contact-option"
                    href="mailto:quanggd192@gmail.com"
                    rel="noreferrer"
                  >
                    <span className="contact-option-label">Email</span>
                    <span className="contact-option-value">
                      quanggd192@gmail.com
                    </span>
                  </a>
                  <a
                    className="contact-option"
                    href="https://zalo.me/84378324266"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="contact-option-label">Zalo</span>
                    <span className="contact-option-value">Message on Zalo</span>
                  </a>
                  <a className="contact-option" href="tel:+84378324266">
                    <span className="contact-option-label">Phone</span>
                    <span className="contact-option-value">+84 378 324 266</span>
                  </a>
                </div>
              </div>
            </details>
            <a
              className="btn btn-ghost"
              href="https://www.linkedin.com/in/nguyen-quang-bb8635198"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Profile
            </a>
          </div>
        </section>

        <section className="reveal grid gap-4 md:grid-cols-3">
          <article className="stat-card">
            <p className="stat-label">Current Role</p>
            <h2 className="stat-value">Project Leader</h2>
            <p className="stat-note">LG CNS Vietnam</p>
          </article>
          <article className="stat-card">
            <p className="stat-label">Career Arc</p>
            <h2 className="stat-value">Frontend to Fullstack</h2>
            <p className="stat-note">Product + Outsourcing + Freelance</p>
          </article>
          <article className="stat-card">
            <p className="stat-label">Signature</p>
            <h2 className="stat-value">Execution Quality</h2>
            <p className="stat-note">Management and skill development focus</p>
          </article>
        </section>

        <section className="glass-panel reveal">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="section-title">Career Journey</h2>
            <p className="text-sm text-slate-400">
              Built from your LinkedIn profile resume.
            </p>
          </div>
          <ol className="timeline mt-8">
            {timeline.map((item) => (
              <li className="timeline-item" key={`${item.company}-${item.role}`}>
                <div className="timeline-dot" />
                <div>
                  <p className="timeline-period">{item.period}</p>
                  <h3 className="timeline-role">{item.role}</h3>
                  <p className="timeline-company">{item.company}</p>
                  <p className="timeline-summary">{item.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="reveal grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="glass-panel">
            <h2 className="section-title">How I Work</h2>
            <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
              I turn ambiguous requirements into production-grade interfaces and
              scalable platforms, aligning product goals with disciplined
              engineering delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span key={skill} className="chip">
                  {skill}
                </span>
              ))}
            </div>
          </article>
          <article className="glass-panel">
            <h2 className="section-title">Portfolio</h2>
            <p className="mt-4 text-slate-300">
              A curated portfolio is launching soon with selected case studies,
              architecture notes, and delivery impact.
            </p>
            <span className="btn btn-primary mt-8" aria-disabled="true">
              Portfolio Link (Coming Soon)
            </span>
          </article>
        </section>

        <section className="reveal">
          <CareerChat />
        </section>

        <section className="footer-note reveal">
          <p>
            Built with Next.js. Designed for a sharp, professional first
            impression.
          </p>
        </section>
      </main>
    </div>
  );
}
