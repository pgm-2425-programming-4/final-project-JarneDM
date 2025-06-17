import "./css/About.css";

export default function About() {
  return (
    <>
      <div className="about-container">
        <h1>Over dit project</h1>
        <p>
          Dit project is ontstaan als een onderdeel van mijn studie aan Hogeschool Artevelde. Het is een webtool die het beheer van
          projecten vergemakkelijkt door een duidelijk overzicht te bieden van taken, labels en statussen. De applicatie is ontwikkeld met
          React voor de front-end en maakt gebruik van een headless CMS (Strapi) voor de back-end. De gebruiksvriendelijke interface stelt
          gebruikers in staat om snel en effectief nieuwe taken te creëren en te beheren.
        </p>

        <div className="contact">
          <h2>Contactgegevens</h2>
          <ul>
            <li>
              <strong>Naam:</strong> Jarne De Meyer
            </li>
            <li>
              <strong>E-mail:</strong> <a href="mailto:jarne.demeyer@student.arteveldehs.be">jarne.demeyer@student.arteveldehs.be</a>
            </li>
            <li>
              <strong>LinkedIn:</strong>{" "}
              <a href="https://www.linkedin.com/in/jarne-de-meyer-22a2b5358/" target="_blank" rel="noopener noreferrer">
                linkedin.com
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
