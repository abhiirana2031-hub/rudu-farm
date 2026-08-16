const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

// 1. Sidebar to mobile-first
css = css.replace(
  /\.sidebar\s*\{[\s\S]*?gap:\s*8px;\n\}/,
  `.sidebar {\n  display: none;\n  width: 260px;\n  background-color: var(--bg-card);\n  border-right: 1px solid var(--border);\n  padding: 24px 16px;\n  flex-direction: column;\n  gap: 8px;\n}`
);

// 2. Content area to mobile-first
css = css.replace(
  /\.content-area\s*\{[\s\S]*?padding:\s*28px;[\s\S]*?\}/,
  `.content-area {\n  flex: 1;\n  min-width: 0;\n  padding: 12px 12px 80px 12px; /* Bottom padding for nav */\n  max-width: 1400px;\n  margin: 0 auto;\n  width: 100%;\n  overflow-x: hidden;\n}`
);

// 3. Mobile bottom nav to mobile-first
css = css.replace(
  /\.mobile-bottom-nav\s*\{[\s\S]*?z-index:\s*200;\n\}/,
  `.mobile-bottom-nav {\n  position: fixed;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 68px;\n  background: rgba(255, 255, 255, 0.95);\n  backdrop-filter: blur(12px);\n  border-top: 1px solid rgba(226, 232, 240, 0.8);\n  display: flex;\n  justify-content: space-around;\n  align-items: center;\n  z-index: 200;\n}`
);

// 4. dashboard-subcards-grid to mobile-first
css = css.replace(
  /\.dashboard-subcards-grid\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*1fr\);[\s\S]*?\}/,
  `.dashboard-subcards-grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 16px;\n  margin-bottom: 24px;\n}`
);

// Add Desktop Media Query at the end
const desktopOverrides = `
/* ========================================== */
/* DESKTOP RESPONSIVE OVERRIDES (MOBILE-FIRST) */
/* ========================================== */
@media (min-width: 768px) {
  .sidebar {
    display: flex;
  }
  .mobile-bottom-nav {
    display: none;
  }
  .content-area {
    padding: 28px;
  }
  .dashboard-subcards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .menu-btn {
    display: none; /* Hide hamburger if Sidebar is visible */
  }
  .farmer-stats-3col {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Base adjustments for mobile */
.farmer-stats-3col {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}
`;

fs.writeFileSync('src/index.css', css + '\n' + desktopOverrides);
console.log('index.css refactored for mobile-first');
