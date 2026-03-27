import styled from "styled-components";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Drag based editing",
    body: "Users can place text, photo blocks, ornaments, and freehand drawing in one invitation frame like a lightweight design tool.",
  },
  {
    title: "Print safety guidance",
    body: "Bleed and safe zones are shown directly on the frame, and risky placements are highlighted before printing.",
  },
  {
    title: "Explain then edit",
    body: "The service first explains the workflow and print rules in /explain, then moves users into the actual editor at /edit.",
  },
];

const safetyItems = [
  "Background photos, background color, gradients, patterns, and textures may extend into the bleed.",
  "Names, date, time, venue, address, guide text, contact, QR, and logos should stay inside the safe zone.",
  "Faces and upper-body portraits are treated like critical content because trimming them usually looks broken.",
];

const steps = [
  "Read the product overview and print rules on the landing page.",
  "Add and move text, image, ornament, and drawing elements on the editing page.",
  "Review warnings for safe zone and bleed before export or print.",
];

export default function Home() {
  return (
    <Page>
      <Hero>
        <HeroText>
          <Eyebrow>Invitation editor for print-ready moments</Eyebrow>
          <h1>Build wedding invitations and event cards by arranging content directly on a frame.</h1>
          <p>
            MerryNote is designed as a two-step experience. The explain page introduces the project and print
            rules, and the edit page gives users a canvas-like workspace for custom invitation making.
          </p>
          <ActionRow>
            <PrimaryLink to="/edit">Open editor</PrimaryLink>
            <SecondaryLink href="#print-guide">View print guide</SecondaryLink>
          </ActionRow>
        </HeroText>
        <HeroCard>
          <CardBadge>Core flow</CardBadge>
          <CardTitle>Understand the tool first, then design with confidence.</CardTitle>
          <FlowList>
            <li>Visit /explain to learn the product goal and printing rules.</li>
            <li>Use /edit to add text, drawings, and image content inside one frame.</li>
            <li>Adjust risky placements after reading safe-zone warnings.</li>
          </FlowList>
        </HeroCard>
      </Hero>

      <Section>
        <SectionLead>
          <span>What this project solves</span>
          <h2>Users should be able to customize invitations without forgetting real print constraints.</h2>
        </SectionLead>
        <FeatureGrid>
          {features.map((feature) => (
            <FeatureCard key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </Section>

      <SplitSection id="print-guide">
        <GuidePanel>
          <span>Print guide</span>
          <h2>Bleed and safe-zone guidance stays visible as part of the editing workflow.</h2>
          <p>
            The frame is designed to show a 35px bleed and an inner safe zone. If critical content sits in a risky
            area, the editor can warn the user before they commit to print.
          </p>
        </GuidePanel>
        <RulePanel>
          <RuleTitle>Safety rules</RuleTitle>
          {safetyItems.map((item) => (
            <RuleItem key={item}>{item}</RuleItem>
          ))}
        </RulePanel>
      </SplitSection>

      <Section>
        <SectionLead>
          <span>Workflow</span>
          <h2>The product splits explanation and creation so the editor can stay focused.</h2>
        </SectionLead>
        <Steps>
          {steps.map((step, index) => (
            <Step key={step}>
              <strong>{String(index + 1).padStart(2, "0")}</strong>
              <p>{step}</p>
            </Step>
          ))}
        </Steps>
      </Section>
    </Page>
  );
}

const Page = styled.main`
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 26px 0 72px;
  display: grid;
  gap: 26px;
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
  gap: 24px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const HeroText = styled.div`
  padding: 40px;
  border-radius: 36px;
  background:
    linear-gradient(140deg, rgba(255, 255, 255, 0.9), rgba(255, 244, 236, 0.88)),
    linear-gradient(180deg, #fefbf8, #f8ede6);
  border: 1px solid rgba(34, 27, 23, 0.08);
  box-shadow: var(--shadow);

  h1 {
    margin: 10px 0 16px;
    font-size: clamp(2.2rem, 5vw, 4.35rem);
    line-height: 1.04;
    letter-spacing: -0.04em;
  }

  p {
    margin: 0;
    max-width: 62ch;
    color: var(--muted);
    font-size: 1.06rem;
    line-height: 1.7;
  }

  @media (max-width: 768px) {
    padding: 28px;
  }
`;

const Eyebrow = styled.span`
  display: inline-flex;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(201, 111, 74, 0.12);
  color: var(--accent-deep);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 28px;
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  border-radius: 18px;
  background: linear-gradient(135deg, #cc734d, #8a432b);
  color: #fff;
  font-weight: 700;
  box-shadow: var(--shadow);
`;

const SecondaryLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  border-radius: 18px;
  background: rgba(255, 253, 248, 0.82);
  border: 1px solid var(--line);
  font-weight: 700;
`;

const HeroCard = styled.aside`
  padding: 28px;
  border-radius: 30px;
  background: linear-gradient(180deg, #fffdfa, #f7efe7);
  border: 1px solid rgba(34, 27, 23, 0.08);
  box-shadow: var(--shadow);
  display: grid;
  gap: 14px;
`;

const CardBadge = styled.span`
  display: inline-flex;
  width: fit-content;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(95, 127, 117, 0.14);
  color: var(--sage);
  font-weight: 700;
  font-size: 0.88rem;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.7rem;
  line-height: 1.2;
`;

const FlowList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  line-height: 1.8;
`;

const Section = styled.section`
  padding: 34px;
  border-radius: 30px;
  background: rgba(255, 253, 248, 0.7);
  border: 1px solid rgba(34, 27, 23, 0.08);
`;

const SectionLead = styled.div`
  margin-bottom: 22px;

  span {
    color: var(--accent-deep);
    font-weight: 700;
    font-size: 0.92rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  h2 {
    margin: 8px 0 0;
    font-size: clamp(1.65rem, 3vw, 2.5rem);
    line-height: 1.2;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.article`
  padding: 24px;
  border-radius: 24px;
  background: var(--surface);
  border: 1px solid var(--line);

  h3 {
    margin: 0 0 12px;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    color: var(--muted);
    line-height: 1.7;
  }
`;

const SplitSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 0.85fr);
  gap: 18px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const GuidePanel = styled.div`
  padding: 34px;
  border-radius: 30px;
  color: white;
  background:
    linear-gradient(155deg, rgba(50, 43, 37, 0.84), rgba(109, 57, 35, 0.86)),
    linear-gradient(180deg, #543023, #33231e);
  box-shadow: var(--shadow);

  span {
    font-size: 0.92rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    opacity: 0.88;
  }

  h2 {
    margin: 10px 0 14px;
    font-size: clamp(1.7rem, 3vw, 2.6rem);
    line-height: 1.15;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.84);
    line-height: 1.75;
  }
`;

const RulePanel = styled.div`
  padding: 28px;
  border-radius: 30px;
  background: rgba(255, 253, 248, 0.82);
  border: 1px solid var(--line);
  display: grid;
  gap: 12px;
`;

const RuleTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 1.2rem;
`;

const RuleItem = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  background: var(--surface);
  border: 1px solid rgba(34, 27, 23, 0.08);
  line-height: 1.6;
  color: var(--muted);
`;

const Steps = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const Step = styled.div`
  padding: 22px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,243,236,0.92));
  border: 1px solid var(--line);

  strong {
    display: inline-flex;
    margin-bottom: 14px;
    color: var(--accent-deep);
    font-size: 1.25rem;
  }

  p {
    margin: 0;
    color: var(--muted);
    line-height: 1.7;
  }
`;
