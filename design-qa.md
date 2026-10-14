# Design QA

## Evidence

- Source visual truth:
  - `/var/folders/h6/z3tp4rlx34374yv6sqhf89d00000gn/T/codex-clipboard-78cdecfa-b589-454a-aa75-186861e15e99.png`
  - `/var/folders/h6/z3tp4rlx34374yv6sqhf89d00000gn/T/codex-clipboard-ee8bacff-290d-4b27-9294-fd7523a15fa2.png`
  - Latest user specification: replace the right dashboard cards with equal-width model-cost trend and approval cards; reveal document selection only after clicking “导入知识库”; stack “导入文档” above it; remove the upper-left “forma” wordmark.
- Implementation screenshot: Codex in-app Browser tab 8 inline captures of the dashboard and document-selection state.
- Reference pixels: 2940 × 1662 for both supplied screenshots; displayed comparison normalized to 2048 × 1158.
- Implementation viewport: 1280 × 720 CSS px, device scale factor 1.
- State: signed in as the multi-workspace demo account, Legal workspace; dashboard and Document Center selection mode.

## Full-view comparison evidence

- Dashboard: the two trend cards measure 479 × 260.5 CSS px each; the task and approval cards measure 479 × 253 CSS px each. Both rows use equal 1:1 columns and aligned top/bottom edges.
- Document Center: default state has zero selection controls and shows “导入文档” above “导入知识库”. After clicking “导入知识库”, five selection controls appear, “取消选择” becomes available, and the confirmation action stays disabled until a document is selected.
- Brand: the upper-left brand renders only “序间”; no “forma” text is visible.
- No horizontal overflow was detected.

## Focused region comparison evidence

- Dashboard grid, upper-left brand, and Document Center header/selection controls were inspected at readable scale. No extra crop was needed because typography, button labels, and card edges were legible in the browser captures.

## Findings

- No actionable P0/P1/P2 differences remain for the requested changes.
- Fonts and typography: existing Chinese UI hierarchy and weights remain consistent; the removed English wordmark leaves balanced spacing.
- Spacing and layout rhythm: both requested card pairs are equal-width and vertically aligned; stacked document actions have consistent spacing.
- Colors and visual tokens: the established deep-green theme remains consistent across chart lines, selection states, buttons, and borders.
- Image quality and asset fidelity: no new raster assets were required; existing Lucide icons remain crisp and consistent.
- Copy and content: “模型消耗趋势”, “待审批”, “导入文档”, “导入知识库”, and “确认导入知识库” match the requested workflow.

## Interaction checks

- Signed in and opened the dashboard.
- Confirmed both dashboard card rows are equal-width.
- Opened Document Center and confirmed no checkboxes are visible by default.
- Clicked “导入知识库”, confirmed selection mode appears, selected one document, and confirmed the action becomes enabled with count 1.
- Browser console errors/warnings checked: none.
- Production build and model tests passed.

## Comparison history

- Earlier P2: dashboard right-side cards used unequal column proportions. Fixed by applying a shared two-column 1:1 grid to both dashboard rows; post-fix measurements match exactly.
- Earlier P2: Document Center exposed selection controls before entering the import workflow. Fixed with an explicit selection mode entered from “导入知识库”; post-fix default state has zero checkboxes.
- Earlier P2: “forma” remained in the upper-left brand. Fixed at the shared Brand component; post-fix rendered text is “序间”.

## Follow-up polish

- None required for this scope.

final result: passed
