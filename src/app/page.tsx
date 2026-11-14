import { portfolio } from '@/lib/portfolio';

const leftNavigation = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header page-gutter">
        <nav className="header-links header-links-left" aria-label="Main navigation">
          {leftNavigation.map((item) => (
            <a className="nav-pill" href={item.href} key={item.href}>{item.label}</a>
          ))}
        </nav>
        <a className="wordmark" href="#top" aria-label={`${portfolio.name}, home`}>
          {portfolio.name}
        </a>
        <nav className="header-links header-links-right" aria-label="Contact navigation">
          <a className="nav-pill nav-pill-primary" href="#contact">Contact</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero page-gutter" id="top" aria-labelledby="hero-title">
          <div className="hero-topline">
            <span>{portfolio.role}</span>
            <span>{portfolio.location}</span>
          </div>

          <h1 id="hero-title">{portfolio.name}</h1>

          <div className="hero-bottom">
            <p className="hero-statement">{portfolio.heroStatement}</p>
            <a className="text-link" href="#work">
              Explore selected work <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className="work section-gutter" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <p className="eyebrow">01 / Selected work</p>
            <h2 id="work-title">Things in motion.</h2>
          </div>

          <div className="project-list">
            {portfolio.projects.map((project) => {
              const content = (
                <>
                  <span className="project-number">{project.number}</span>
                  <div className="project-main">
                    <div className="project-title-row">
                      <h3>{project.name}</h3>
                    </div>
                    <p className="project-description">{project.description}</p>
                    <ul className="tag-list" aria-label="Project topics">
                      {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                  </div>
                  <div className="project-meta">
                    <span>{project.type}</span>
                    <span>{project.year}</span>
                  </div>
                </>
              );

              return project.href ? (
                <a
                  className="project-row project-row-link"
                  href={project.href}
                  key={project.number}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.name}: ${project.linkLabel}`}
                >
                  {content}
                </a>
              ) : (
                <article className="project-row" key={project.number}>
                  {content}
                </article>
              );
            })}
          </div>
        </section>

        <section className="about section-gutter" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <p className="eyebrow">02 / A little context</p>
            <h2 id="about-title">A little about you.</h2>
          </div>

          <div className="about-grid">
            <p className="about-lead">{portfolio.introduction}</p>
            <div className="about-copy">
              {portfolio.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <p className="now-line"><span className="now-dot" aria-hidden="true" /> Currently: {portfolio.current}</p>
            </div>
          </div>

          <div className="milestones" aria-label="Selected milestones">
            <p className="eyebrow">A few markers along the way</p>
            {portfolio.milestones.map((milestone) => (
              <div className="milestone" key={milestone.title}>
                <span className="milestone-year">{milestone.year}</span>
                <h3>{milestone.title}</h3>
                <p>{milestone.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contact section-gutter" id="contact" aria-labelledby="contact-title">
          <div className="contact-inner">
            <p className="eyebrow">03 / Get in touch</p>
            <h2 id="contact-title">Let’s start a<br /><em>conversation.</em></h2>
            <p className="contact-copy">Replace this line with a short invitation to get in touch.</p>
            <a className="contact-email" href={`mailto:${portfolio.email}`}>
              {portfolio.email}
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer page-gutter">
        <div className="footer-top">
          <div>
            <p className="eyebrow">Elsewhere</p>
            <ul className="social-list">
              {portfolio.socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noreferrer">
                    <span>{social.label}</span><span>{social.value}</span>
                  </a>
                </li>
              ))}
              <li><a href={`tel:${portfolio.phone}`}><span>Phone</span><span>{portfolio.phoneDisplay}</span></a></li>
            </ul>
          </div>
          <a className="back-to-top" href="#top">Back to top ↑</a>
        </div>
        <div className="footer-bottom">
          <span>{portfolio.name}</span>
          <span>{portfolio.location}</span>
          <span>{portfolio.copyright}</span>
        </div>
      </footer>
    </>
  );
}
