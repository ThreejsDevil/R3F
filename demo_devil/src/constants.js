// ─── 잔디 색상 (레벨 1~4) ───────────────────────────────────────────────────
/** @type {string[]} */
export const GRASS_COLORS = ["#1a6b3f", "#22a350", "#39d353", "#5eff7e"];

// ─── 기여도 셀 색상 (레벨 0~4, 0 = 비어있음) ──────────────────────────────
/** @type {string[]} */
export const CELL_COLORS = ["#4a4a52", "#0e4429", "#006d32", "#26a641", "#39d353"];

// ─── ContributionGrid 셀 치수 ────────────────────────────────────────────────
/** 셀 한 칸의 크기 (Three.js 단위) */
export const CELL_SIZE = 0.18;
/** 셀 사이 간격 */
export const CELL_GAP = 0.02;
/** 셀 높이 */
export const CELL_HEIGHT = 0.02;

// ─── 캐릭터 이동 수치 ────────────────────────────────────────────────────────
/** 이동 속도 (단위/초) */
export const SPEED = 2;
/** 회전 보간 속도 */
export const ROTATION_SPEED = 8;
/** 헤드 본 Z축 기울기 (라디안) */
export const HEAD_TILT = 0.45;

// ─── 보드 치수 ───────────────────────────────────────────────────────────────
/** 보드 너비 */
export const BOARD_W = 12
/** 보드 깊이 */
export const BOARD_D = 12;
/** 보드 두께 */
export const BOARD_H = 0.2;
/** 네온 테두리 선 두께 */
export const BOARD_LINE = 0.03;

// ─── 네온 색상 ───────────────────────────────────────────────────────────────
export const NEON_CYAN = "#00d4ff";
export const NEON_PINK = "#ff00aa";
