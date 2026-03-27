import styled from "styled-components";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/explain", label: "Explain" },
  { to: "/edit", label: "Edit" },
];

export default function Header() {
  return (
    <Shell>
      <Inner>
        <Brand to="/explain">
          <BrandMark>M</BrandMark>
          <BrandText>
            <strong>MerryNote</strong>
            <span>Custom invitation editor with print-safe guides</span>
          </BrandText>
        </Brand>
        <Nav>
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} $highlight={item.to === "/edit"}>
              {item.label}
            </NavItem>
          ))}
        </Nav>
      </Inner>
    </Shell>
  );
}

const Shell = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 18px 20px;
  backdrop-filter: blur(16px);
  background: rgba(243, 239, 231, 0.82);
  border-bottom: 1px solid rgba(34, 27, 23, 0.08);
`;

const Inner = styled.div`
  width: min(1180px, 100%);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Brand = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 14px;
`;

const BrandMark = styled.div`
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 15px;
  background: linear-gradient(135deg, #d78a63, #8d4630);
  color: white;
  font-weight: 800;
  font-size: 1.25rem;
  box-shadow: var(--shadow);
`;

const BrandText = styled.div`
  display: grid;
  gap: 2px;

  strong {
    font-size: 1rem;
    letter-spacing: 0.02em;
  }

  span {
    color: var(--muted);
    font-size: 0.9rem;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const NavItem = styled(NavLink)`
  padding: 11px 16px;
  border-radius: 999px;
  border: 1px solid ${({ $highlight }) => ($highlight ? "transparent" : "var(--line)")};
  background: ${({ $highlight }) =>
    $highlight ? "linear-gradient(135deg, #c96f4a, #8c4228)" : "rgba(255, 253, 248, 0.78)"};
  color: ${({ $highlight }) => ($highlight ? "#fff" : "var(--ink)")};
  font-weight: 600;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &.active {
    box-shadow: inset 0 0 0 2px
      ${({ $highlight }) => ($highlight ? "rgba(255,255,255,0.28)" : "rgba(201,111,74,0.25)")};
  }

  &:hover {
    transform: translateY(-1px);
  }
`;
