export default function Footer() {
  return (
    <footer
      style={{
        width: "min(1180px, calc(100% - 32px))",
        margin: "0 auto",
        padding: "32px 0 48px",
        color: "var(--muted)",
        fontSize: "0.95rem",
      }}
    >
      MerryNote는 설명 페이지에서 흐름을 이해하고, 편집 페이지에서 인쇄 기준을 보며 초대장을 완성하도록 구성된 제작 도구입니다.
    </footer>
  );
}
