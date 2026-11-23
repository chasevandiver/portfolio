// TODO(Chase): add an email address or other links here.
const links = [{ label: "GitHub", href: "https://github.com/chasevandiver" }];

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <h2 className="display">Get in touch</h2>
      <div className="glass contact-card">
        <p>Want something built, or want to see how one of these works? Reach out.</p>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a className="live" href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
