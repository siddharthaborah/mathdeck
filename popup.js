/**
 * Mathdeck Keyboard — popup.js
 * Vanilla ES module, no build step required.
 * Requires MathLive (loaded from node_modules/mathlive/mathlive.min.mjs)
 */

import "./node_modules/mathlive/mathlive.min.mjs";

// ─── Storage ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "mathdeck-state-v2";

const storage = globalThis.chrome?.storage?.local ?? {
  async get() { return {}; },
  set() {}
};

// ─── Tab definitions (chemistry + graph removed) ─────────────────────────────

const TABS = [
  { id: "basic",      label: "Basic",       icon: "∑" },
  { id: "algebra",    label: "Algebra",     icon: "𝑥" },
  { id: "calculus",   label: "Calculus",    icon: "∫" },
  { id: "pure",       label: "Pure",        icon: "∀" },
  { id: "statistics", label: "Stats",       icon: "σ" },
  { id: "physics",    label: "Physics",     icon: "ϕ" },
];

// ─── Keyboard data ──────────────────────────────────────────────────────────
// Each key: [displayLabel, latexToInsert, typstEquivalent, optionalHint]
// Use "□" as MathLive placeholder — converted to #? on insert.

const KEYBOARDS = {

  // ── Basic ─────────────────────────────────────────────────────────────────
  basic: [
    {
      title: "Arithmetic",
      keys: [
        ["÷",   "\\div",            "/",            "division"],
        ["×",   "\\times",          "*",            "multiply"],
        ["±",   "\\pm",             "plus.minus",   "plus-minus"],
        ["∓",   "\\mp",             "minus.plus",   "minus-plus"],
        ["≈",   "\\approx",         "approx",       "approx"],
        ["≡",   "\\equiv",          "equiv",        "equiv"],
        ["≠",   "\\ne",             "!=",           "not equal"],
        ["<",   "<",                "<",            "less than"],
        [">",   ">",                ">",            "greater than"],
        ["≤",   "\\le",             "<=",           "leq"],
        ["≥",   "\\ge",             ">=",           "geq"],
        ["∝",   "\\propto",         "prop",         "proportional"],
      ]
    },
    {
      title: "Symbols",
      keys: [
        ["π",   "\\pi",             "pi"],
        ["e",   "e",                "e"],
        ["i",   "i",                "i"],
        ["∞",   "\\infty",          "infinity"],
        ["°",   "^\\circ",          "degree"],
        ["%",   "\\%",              "%"],
        ["‰",   "\\unicode{\"2030}",  "permil",       "per mille"],
        ["∴",   "\\therefore",      "therefore"],
        ["∵",   "\\because",        "because"],
        ["⟹",  "\\implies",        "=>",           "implies"],
        ["⟺",  "\\iff",            "<=>",          "iff"],
        ["∅",   "\\emptyset",       "emptyset"],
      ]
    },
    {
      title: "Common Functions",
      keys: [
        ["x²",  "□^2",              "□^2"],
        ["xⁿ",  "□^{□}",           "□^(□)"],
        ["√",   "\\sqrt{□}",        "sqrt(□)"],
        ["ⁿ√",  "\\sqrt[□]{□}",    "root(□,□)"],
        ["x/y", "\\frac{□}{□}",    "(□)/(□)"],
        ["|x|", "\\left|□\\right|", "abs(□)"],
        ["⌊x⌋", "\\lfloor□\\rfloor","floor(□)"],
        ["⌈x⌉", "\\lceil□\\rceil",  "ceil(□)"],
        ["()",  "\\left(□\\right)", "(□)"],
        ["[]",  "\\left[□\\right]", "[□]"],
        ["{}",  "\\left\\{□\\right\\}","brace(□)"],
        ["log", "\\log\\left(□\\right)","log(□)"],
      ]
    },
  ],

  // ── Algebra ───────────────────────────────────────────────────────────────
  algebra: [
    {
      title: "Trig",
      keys: [
        ["sin",   "\\sin\\left(□\\right)",    "sin(□)"],
        ["cos",   "\\cos\\left(□\\right)",    "cos(□)"],
        ["tan",   "\\tan\\left(□\\right)",    "tan(□)"],
        ["csc",   "\\csc\\left(□\\right)",    "csc(□)"],
        ["sec",   "\\sec\\left(□\\right)",    "sec(□)"],
        ["cot",   "\\cot\\left(□\\right)",    "cot(□)"],
        ["sin⁻¹", "\\arcsin\\left(□\\right)", "arcsin(□)"],
        ["cos⁻¹", "\\arccos\\left(□\\right)", "arccos(□)"],
        ["tan⁻¹", "\\arctan\\left(□\\right)", "arctan(□)"],
        ["sinh",  "\\sinh\\left(□\\right)",   "sinh(□)"],
        ["cosh",  "\\cosh\\left(□\\right)",   "cosh(□)"],
        ["tanh",  "\\tanh\\left(□\\right)",   "tanh(□)"],
      ]
    },
    {
      title: "Logarithms",
      keys: [
        ["ln",    "\\ln\\left(□\\right)",           "ln(□)"],
        ["log",   "\\log\\left(□\\right)",           "log(□)"],
        ["logₐ",  "\\log_{□}\\left(□\\right)",      "log_a(□)"],
        ["log₂",  "\\log_{2}\\left(□\\right)",      "log_2(□)"],
        ["log₁₀", "\\log_{10}\\left(□\\right)",     "log10(□)"],
        ["exp",   "e^{□}",                           "e^(□)"],
        ["eˣ",    "e^{x}",                           "e^x"],
        ["aˣ",    "□^{□}",                           "□^□"],
        ["⌊⌋",    "\\lfloor□\\rfloor",               "floor(□)"],
        ["⌈⌉",    "\\lceil□\\rceil",                 "ceil(□)"],
        ["mod",   "□\\bmod□",                        "mod(□,□)"],
        ["gcd",   "\\gcd\\left(□,□\\right)",         "gcd(□,□)"],
      ]
    },
    {
      title: "Greek Letters",
      keys: [
        ["α",  "\\alpha",   "alpha"],
        ["β",  "\\beta",    "beta"],
        ["γ",  "\\gamma",   "gamma"],
        ["δ",  "\\delta",   "delta"],
        ["ε",  "\\epsilon", "epsilon"],
        ["ζ",  "\\zeta",    "zeta"],
        ["η",  "\\eta",     "eta"],
        ["θ",  "\\theta",   "theta"],
        ["ι",  "\\iota",    "iota"],
        ["κ",  "\\kappa",   "kappa"],
        ["λ",  "\\lambda",  "lambda"],
        ["μ",  "\\mu",      "mu"],
        ["ν",  "\\nu",      "nu"],
        ["ξ",  "\\xi",      "xi"],
        ["ρ",  "\\rho",     "rho"],
        ["σ",  "\\sigma",   "sigma"],
        ["τ",  "\\tau",     "tau"],
        ["υ",  "\\upsilon", "upsilon"],
        ["φ",  "\\phi",     "phi"],
        ["χ",  "\\chi",     "chi"],
        ["ψ",  "\\psi",     "psi"],
        ["ω",  "\\omega",   "omega"],
        ["Γ",  "\\Gamma",   "Gamma"],
        ["Δ",  "\\Delta",   "Delta"],
        ["Θ",  "\\Theta",   "Theta"],
        ["Λ",  "\\Lambda",  "Lambda"],
        ["Ξ",  "\\Xi",      "Xi"],
        ["Π",  "\\Pi",      "Pi"],
        ["Σ",  "\\Sigma",   "Sigma"],
        ["Υ",  "\\Upsilon",  "Upsilon"],
        ["Φ",  "\\Phi",     "Phi"],
        ["Ψ",  "\\Psi",     "Psi"],
        ["Ω",  "\\Omega",   "Omega"],
      ]
    },
  ],

  // ── Calculus ──────────────────────────────────────────────────────────────
  calculus: [
    {
      title: "Derivatives",
      keys: [
        ["d/dx",      "\\frac{d}{dx}\\left(□\\right)",             "dif/(dif x)(□)"],
        ["d²/dx²",    "\\frac{d^2}{dx^2}\\left(□\\right)",         "dif^2/(dif x^2)(□)"],
        ["∂/∂x",      "\\frac{\\partial}{\\partial x}\\left(□\\right)","diff(□, x)"],
        ["∂²/∂x²",    "\\frac{\\partial^2}{\\partial x^2}\\left(□\\right)","diff(□,x,2)"],
        ["f′",        "f'\\left(□\\right)",                         "f'(□)"],
        ["f″",        "f''\\left(□\\right)",                        "f''(□)"],
        ["ẋ",         "\\dot{□}",                                   "dot(□)",       "time deriv"],
        ["ẍ",         "\\ddot{□}",                                  "dot.double(□)","2nd time"],
        ["∇",         "\\nabla",                                    "nabla"],
        ["∇²",        "\\nabla^2",                                  "nabla^2",      "Laplacian"],
        ["∇·",        "\\nabla\\cdot",                              "nabla dot",    "divergence"],
        ["∇×",        "\\nabla\\times",                             "nabla times",  "curl"],
      ]
    },
    {
      title: "Integrals",
      keys: [
        ["∫",         "\\int □\\,d□",                               "integral □ dif □"],
        ["∫ₐᵇ",       "\\int_{□}^{□} □\\,d□",                       "integral_(□)^(□) □ dif □"],
        ["∬",         "\\iint □\\,dA",                              "iint □ dif A"],
        ["∭",         "\\iiint □\\,dV",                             "iiint □ dif V"],
        ["∮",         "\\oint □\\,d□",                              "oint □ dif □",  "line integ"],
        ["∯",         "\\oiint □\\,dS",                             "oiint",         "surface"],
        ["dx",        "\\,dx",                                      " dif x"],
        ["dy",        "\\,dy",                                      " dif y"],
        ["dt",        "\\,dt",                                      " dif t"],
        ["∂",         "\\partial",                                  "diff"],
        ["lim",       "\\lim_{□\\to□}",                             "lim_(□->□)"],
        ["lim→∞",     "\\lim_{□\\to\\infty}",                       "lim_(□->oo)"],
      ]
    },
    {
      title: "Series & Sums",
      keys: [
        ["Σ",         "\\sum_{□}^{□}",                              "sum_(□)^(□)"],
        ["Σₙ",        "\\sum_{n=0}^{\\infty}",                      "sum_(n=0)^oo"],
        ["Σₖ",        "\\sum_{k=1}^{n}",                            "sum_(k=1)^n"],
        ["∏",         "\\prod_{□}^{□}",                             "product_(□)^(□)"],
        ["∏ₙ",        "\\prod_{n=1}^{\\infty}",                     "product_(n=1)^oo"],
        ["∐",         "\\coprod_{□}^{□}",                           "coprod"],
        ["Taylor",    "\\sum_{n=0}^{\\infty}\\frac{f^{(n)}(a)}{n!}(x-a)^n", "taylor"],
        ["Fourier",   "\\sum_{n=-\\infty}^{\\infty}c_n e^{inx}",    "fourier"],
        ["piecewise", "\\begin{cases} □ & □ \\\\ □ & □ \\end{cases}", "cases(□ if □, □ if □)"],
        ["Matrix",    "__MATRIX__",                                  "",              "open builder"],
        ["aₙ",        "a_{□}",                                      "a_(□)"],
        ["n!",        "□!",                                         "□!"],
      ]
    },
  ],

  // ── Pure math ─────────────────────────────────────────────────────────────
  pure: [
    {
      title: "Number Sets",
      keys: [
        ["ℝ",  "\\mathbb{R}",         "RR",       "reals"],
        ["ℤ",  "\\mathbb{Z}",         "ZZ",       "integers"],
        ["ℕ",  "\\mathbb{N}",         "NN",       "naturals"],
        ["ℚ",  "\\mathbb{Q}",         "QQ",       "rationals"],
        ["ℂ",  "\\mathbb{C}",         "CC",       "complex"],
        ["𝔽",  "\\mathbb{F}",         "FF",       "field"],
        ["ℍ",  "\\mathbb{H}",         "HH",       "quaternions"],
        ["𝕀",  "\\mathbb{I}",         "II",       "irrationals"],
        ["∅",  "\\emptyset",          "emptyset"],
        ["ℵ₀", "\\aleph_0",           "aleph_0",  "aleph null"],
        ["ℵ",  "\\aleph",             "aleph"],
        ["∞",  "\\infty",             "infinity"],
      ]
    },
    {
      title: "Set Operations",
      keys: [
        ["∈",  "\\in",               "in"],
        ["∉",  "\\notin",            "in.not"],
        ["∋",  "\\ni",               "in.rev"],
        ["⊂",  "\\subset",           "subset"],
        ["⊆",  "\\subseteq",         "subset.eq"],
        ["⊄",  "\\not\\subset",      "subset.not"],
        ["⊃",  "\\supset",           "supset"],
        ["⊇",  "\\supseteq",         "supset.eq"],
        ["∪",  "\\cup",              "union"],
        ["∩",  "\\cap",              "inter"],
        ["∖",  "\\setminus",         "without",  "set minus"],
        ["×",  "\\times",            "times",    "Cartesian"],
        ["⊕",  "\\oplus",            "xor"],
        ["⊗",  "\\otimes",           "times.circle"],
        ["△",  "\\triangle",         "triangle", "sym diff"],
        ["𝒫",  "\\mathcal{P}",       "cal(P)",   "power set"],
      ]
    },
    {
      title: "Logic",
      keys: [
        ["∀",  "\\forall",           "forall"],
        ["∃",  "\\exists",           "exists"],
        ["∄",  "\\nexists",          "exists.not"],
        ["¬",  "\\neg",              "not"],
        ["∧",  "\\land",             "and"],
        ["∨",  "\\lor",              "or"],
        ["⊤",  "\\top",              "top"],
        ["⊥",  "\\bot",              "bot"],
        ["⊢",  "\\vdash",            "tack.r"],
        ["⊨",  "\\models",           "models"],
        ["≅",  "\\cong",             "tilde.eq",  "congruent"],
        ["∼",  "\\sim",              "tilde",     "similar"],
        ["≃",  "\\simeq",            "simeq"],
        ["≜",  "\\triangleq",        "eq.delta",  "defined as"],
        [":=", ":=",                 ":="],
        ["□",  "□",                  "□",         "placeholder"],
      ]
    },
  ],

  // ── Statistics ────────────────────────────────────────────────────────────
  statistics: [
    {
      title: "Descriptive",
      keys: [
        ["x̄",    "\\bar{x}",                                       "macron(x)",    "mean"],
        ["x̃",    "\\tilde{x}",                                     "tilde(x)",     "median"],
        ["s",     "s",                                              "s",            "std dev"],
        ["s²",    "s^2",                                            "s^2",          "variance"],
        ["σ",     "\\sigma",                                        "sigma"],
        ["σ²",    "\\sigma^2",                                      "sigma^2"],
        ["μ",     "\\mu",                                           "mu",           "pop mean"],
        ["IQR",   "\\text{IQR}",                                    "\"IQR\""],
        ["Q₁",    "Q_1",                                            "Q_1"],
        ["Q₃",    "Q_3",                                            "Q_3"],
        ["Range", "\\text{Range}",                                  "\"Range\""],
        ["CV",    "\\text{CV}",                                     "\"CV\"",       "coeff var"],
      ]
    },
    {
      title: "Probability",
      keys: [
        ["P(A)",    "P\\left(□\\right)",                            "P(□)"],
        ["P(A|B)",  "P\\left(□\\mid□\\right)",                      "P(□|□)"],
        ["P(A∩B)",  "P\\left(□\\cap□\\right)",                      "P(□ and □)"],
        ["P(A∪B)",  "P\\left(□\\cup□\\right)",                      "P(□ or □)"],
        ["E[X]",    "E\\left[□\\right]",                            "E[□]"],
        ["Var(X)",  "\\text{Var}\\left(□\\right)",                  "Var(□)"],
        ["Cov",     "\\text{Cov}\\left(□,□\\right)",                "Cov(□,□)"],
        ["Corr",    "\\text{Corr}\\left(□,□\\right)",               "Corr(□,□)"],
        ["∼",       "\\sim",                                        "~",            "distribd as"],
        ["iid",     "\\overset{\\text{iid}}{\\sim}",                "tilde.op",     "iid"],
        ["f(x)",    "f\\left(□\\right)",                            "f(□)"],
        ["F(x)",    "F\\left(□\\right)",                            "F(□)",         "CDF"],
      ]
    },
    {
      title: "Distributions",
      keys: [
        ["N(μ,σ²)",   "\\mathcal{N}\\left(□,□\\right)",            "cal(N)(□,□)",  "normal"],
        ["Bin(n,p)",  "\\text{Bin}\\left(□,□\\right)",              "Bin(□,□)"],
        ["Pois(λ)",   "\\text{Pois}\\left(□\\right)",               "Pois(□)"],
        ["Exp(λ)",    "\\text{Exp}\\left(□\\right)",                "Exp(□)"],
        ["U(a,b)",    "\\mathcal{U}\\left(□,□\\right)",             "U(□,□)",       "uniform"],
        ["χ²",        "\\chi^2",                                    "chi^2"],
        ["t",         "t_{□}",                                      "t(□)",         "t-dist"],
        ["F",         "F_{□,□}",                                    "F(□,□)",       "F-dist"],
        ["β",         "\\text{Beta}\\left(□,□\\right)",             "Beta(□,□)"],
        ["Γ",         "\\text{Gamma}\\left(□,□\\right)",            "Gamma(□,□)"],
        ["MVN",       "\\mathcal{N}\\left(\\boldsymbol{\\mu},\\boldsymbol{\\Sigma}\\right)", "mvn"],
        ["Dirich",    "\\text{Dir}\\left(\\boldsymbol{\\alpha}\\right)","Dir(α)"],
      ]
    },
  ],

  // ── Physics ───────────────────────────────────────────────────────────────
  physics: [
    {
      title: "Mechanics",
      keys: [
        ["F=ma",     "F = m\\vec{a}",                               "F = m a",       "Newton 2nd"],
        ["p",        "\\vec{p} = m\\vec{v}",                        "p = m v",       "momentum"],
        ["KE",       "KE = \\frac{1}{2}mv^2",                       "KE = 1/2 m v^2"],
        ["PE",       "PE = mgh",                                    "PE = m g h"],
        ["W",        "W = \\vec{F}\\cdot\\vec{d}",                  "W = F dot d",   "work"],
        ["τ",        "\\vec{\\tau} = \\vec{r}\\times\\vec{F}",      "tau = r times F","torque"],
        ["L",        "\\vec{L} = \\vec{r}\\times\\vec{p}",          "L = r times p", "ang. mom."],
        ["I",        "I = \\sum m_i r_i^2",                         "I = sum m r^2", "inertia"],
        ["ω",        "\\omega = \\frac{d\\theta}{dt}",              "omega"],
        ["a_c",      "a_c = \\frac{v^2}{r}",                        "a_c = v^2/r",   "centripetal"],
        ["Fg",       "F_g = G\\frac{m_1 m_2}{r^2}",                "Fg",            "gravity"],
        ["E=mc²",    "E = mc^2",                                    "E = m c^2",     "mass-energy"],
      ]
    },
    {
      title: "Electromagnetism & Vectors",
      keys: [
        ["v⃗",        "\\vec{□}",                                   "arrow(□)",      "vector"],
        ["v̂",        "\\hat{□}",                                   "hat(□)",        "unit vec"],
        ["a·b",       "\\vec{□}\\cdot\\vec{□}",                    "□ dot □",       "dot product"],
        ["a×b",       "\\vec{□}\\times\\vec{□}",                   "□ times □",     "cross prod"],
        ["∇",         "\\nabla",                                   "nabla",         "del"],
        ["∇²",        "\\nabla^2",                                  "laplace",       "Laplacian"],
        ["∇·v",       "\\nabla\\cdot□",                            "nabla dot □",   "divergence"],
        ["∇×v",       "\\nabla\\times□",                           "nabla times □", "curl"],
        ["V=IR",      "V = IR",                                    "V = I R",       "Ohm's law"],
        ["F_e",       "F_e = k\\frac{q_1 q_2}{r^2}",              "Coulomb",       "Coulomb"],
        ["ε",         "\\varepsilon = -\\frac{d\\Phi_B}{dt}",      "Faraday",       "Faraday"],
        ["∇·E",       "\\nabla\\cdot\\vec{E} = \\frac{\\rho}{\\varepsilon_0}", "Gauss","Gauss E"],
      ]
    },
    {
      title: "Quantum, Thermo & Constants",
      keys: [
        ["ℏ",         "\\hbar",                                    "hbar",          "h-bar"],
        ["|ψ⟩",       "\\left|\\psi\\right\\rangle",              "ket(psi)",      "ket"],
        ["⟨ψ|",       "\\left\\langle\\psi\\right|",              "bra(psi)",      "bra"],
        ["⟨φ|ψ⟩",     "\\left\\langle□\\mid□\\right\\rangle",     "braket(□,□)",   "braket"],
        ["Ĥψ=Eψ",     "\\hat{H}\\psi = E\\psi",                   "Schrödinger",   "Schrödinger"],
        ["ΔxΔp",      "\\Delta x\\Delta p \\ge \\frac{\\hbar}{2}", "Heisenberg",   "Heisenberg"],
        ["S",         "S = k_B\\ln\\Omega",                        "entropy",       "entropy"],
        ["η",         "\\eta = 1-\\frac{T_C}{T_H}",               "Carnot",        "Carnot"],
        ["c",         "c",                                         "c",             "speed of light"],
        ["G",         "G",                                         "G",             "grav. const"],
        ["kB",        "k_B",                                       "k_B",           "Boltzmann"],
        ["NA",        "N_A",                                       "N_A",           "Avogadro"],
      ]
    },
  ],
};

// ─── Color swatches ──────────────────────────────────────────────────────────

const SWATCHES = [
  "#09090b",  // zinc-950 (default dark)
  "#ef4444",  // red
  "#3b82f6",  // blue
  "#22c55e",  // green
  "#a855f7",  // purple
  "#f97316",  // orange
  "#06b6d4",  // cyan
  "#f59e0b",  // amber
];

// ─── App state ───────────────────────────────────────────────────────────────

const state = {
  activeTab: "basic",
  equation: "",
  theme: "light",
  fontColor: "#09090b",
  fontSize: 9,
  editorMode: "text",      // "text" or "math" — persisted so it restores on reopen
  custom: [
    { label: "ϕ",  latex: "\\phi",     typst: "phi" },
    { label: "∞",  latex: "\\infty",   typst: "infinity" },
    { label: "ℝ",  latex: "\\mathbb{R}", typst: "RR" },
    { label: "⊂",  latex: "\\subset",  typst: "subset" },
  ],
  history: [],
  undo: [],
  redo: [],
};

// ─── DOM refs ────────────────────────────────────────────────────────────────

const $ = (id) => document.getElementById(id);

const tabList     = document.querySelector(".keyboard-tabs");
const keyGrid     = $("keyboardGrid");
const customRow   = $("customRow");
const editor      = $("equationEditor");
const preview     = $("equationPreview");
const toastEl     = $("toast");
const saveStateEl = $("saveState");
const modeToggle  = $("modeToggle");

const settingsDialog = $("settingsDialog");
const customDialog   = $("customDialog");
const matrixDialog   = $("matrixDialog");

const fontSizeSlider = $("fontSize");
const fontSizeOut    = $("fontSizeOutput");
const customLabelIn  = $("customLabel");
const customValueIn  = $("customValue");

let toastTimer  = 0;
let customSlot  = -1;
let matrixEnv   = "pmatrix";

// ─── Boot ────────────────────────────────────────────────────────────────────

init();

async function init() {
  await loadState();

  configureMathField(editor);
  configureMathField(preview, true);

  renderTabs();
  renderKeyboard();
  renderCustomButtons();
  renderSettings();
  applyTheme();

  editor.value = state.equation;
  updatePreview();
  // Show the correct mode indicator on the toolbar button
  updateModeIndicator(state.editorMode ?? "text");

  // Events
  editor.addEventListener("input", onEditorInput);
  document.addEventListener("click", onGlobalClick);
  document.addEventListener("keydown", onKeyDown);
  fontSizeSlider.addEventListener("input", onFontSize);

  document.querySelectorAll("[data-theme]").forEach((btn) => {
    btn.addEventListener("click", () => setTheme(btn.dataset.theme));
  });

  $("settingsClose").addEventListener("click", () => settingsDialog.close());
  $("customClose").addEventListener("click",   () => customDialog.close());
  $("customCancel").addEventListener("click",  () => customDialog.close());
  $("matrixClose").addEventListener("click",   () => matrixDialog.close());
  $("matrixCancel").addEventListener("click",  () => matrixDialog.close());
  $("saveCustom").addEventListener("click",    saveCustomButton);
  $("insertMatrix").addEventListener("click",  doInsertMatrix);
  $("collapseBtn").addEventListener("click",   toggleKeyboard);

  // Matrix dialog: rebuild grid on size change
  $("matrixRows").addEventListener("input",  buildMatrixGrid);
  $("matrixCols").addEventListener("input",  buildMatrixGrid);

  // Matrix bracket type buttons
  $("matrixTypeRow").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-env]");
    if (!btn) return;
    matrixEnv = btn.dataset.env;
    $("matrixTypeRow").querySelectorAll(".matrix-type-btn").forEach((b) =>
      b.classList.toggle("is-active", b === btn)
    );
  });
}

function configureMathField(mf, readOnly = false) {
  if (readOnly) {
    mf.readOnly = true;
    mf.disabled = true;
    mf.defaultMode = "math";
    return;
  }

  // ── Space bar behaviour ──────────────────────────────────────────────────
  // In math mode, LaTeX ignores plain spaces. We use \: (medium space) so
  // pressing Space in math mode inserts visible spacing.
  // In text mode (default / smart-mode text segments), the browser handles
  // Space natively and it always works — no extra config needed.
  MathfieldElement.mathModeSpace = "\\:";

  // ── Default mode ─────────────────────────────────────────────────────────
  // "text" makes the field behave like a rich-text editor by default:
  // plain typing (including spaces) produces regular text, and math is
  // entered by switching into math mode (Alt+= or the mode button).
  // Combined with smartMode the field auto-detects math context.
  mf.defaultMode   = state.editorMode ?? "text";
  mf.smartMode     = true;   // always on — detects math vs text automatically
  mf.smartFence    = true;
  mf.removeExtraneousParentheses = true;
  mf.virtualKeyboardMode = "manual";
  mf.placeholder   = "\\text{Write your sentence or equation here…}";

  // ── Mode-change listener ─────────────────────────────────────────────────
  // Update the badge whenever the mode changes. smartMode fires this often
  // mid-word; we debounce slightly so the badge doesn't flicker.
  let modeChangeDebounce = 0;
  mf.addEventListener("mode-change", () => {
    clearTimeout(modeChangeDebounce);
    modeChangeDebounce = setTimeout(() => {
      updateModeIndicator(mf.mode);
    }, 120);
  });
}

// ─── State persistence ───────────────────────────────────────────────────────

async function loadState() {
  try {
    const stored = await storage.get(STORAGE_KEY);
    const saved  = stored[STORAGE_KEY];
    if (saved) Object.assign(state, saved);
  } catch { /* ignore */ }
}

let saveDebounce = 0;

function scheduleSave() {
  saveStateEl.textContent = "Saving…";
  saveStateEl.classList.add("unsaved");
  clearTimeout(saveDebounce);
  saveDebounce = setTimeout(() => {
    state.equation = editor.value;
    const { activeTab, equation, theme, fontColor, fontSize, editorMode, custom, history } = state;
    storage.set({ [STORAGE_KEY]: { activeTab, equation, theme, fontColor, fontSize, editorMode, custom, history } });
    saveStateEl.textContent = "Saved";
    saveStateEl.classList.remove("unsaved");
  }, 250);
}

// ─── Render: tabs ────────────────────────────────────────────────────────────

function renderTabs() {
  tabList.innerHTML = "";
  TABS.forEach((tab) => {
    const btn = document.createElement("button");
    btn.className = "tab-button";
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.dataset.tab = tab.id;
    btn.setAttribute("aria-selected", tab.id === state.activeTab ? "true" : "false");
    btn.innerHTML = `<span class="tab-icon" aria-hidden="true">${tab.icon}</span><span>${tab.label}</span>`;
    tabList.append(btn);
  });
}

// ─── Render: keyboard ────────────────────────────────────────────────────────

function renderKeyboard() {
  keyGrid.innerHTML = "";
  const groups = KEYBOARDS[state.activeTab] ?? [];

  groups.forEach((group) => {
    const section = document.createElement("section");
    section.className = "key-group";

    // Group header
    const header = document.createElement("div");
    header.className = "key-group-header";
    header.innerHTML = `
      <span class="key-group-title">${group.title}</span>
      <span class="key-group-line" aria-hidden="true"></span>
    `;
    section.append(header);

    // Key grid
    const keysDiv = document.createElement("div");
    keysDiv.className = "keys";

    group.keys.forEach(([label, latex, typst, hint]) => {
      const btn = document.createElement("button");
      btn.type = "button";

      // Wide key: label longer than 7 chars
      const isWide = label.length > 7;
      btn.className = isWide ? "key-button wide-key" : "key-button";

      // Special: matrix builder trigger
      if (latex === "__MATRIX__") {
        btn.className = "key-button accent-key";
        btn.textContent = "Matrix";
        btn.dataset.action = "open-matrix";
        keysDiv.append(btn);
        return;
      }

      btn.dataset.latex = latex;
      btn.dataset.typst = typst ?? latex;
      btn.textContent = label;
      if (hint) btn.dataset.hint = hint;

      keysDiv.append(btn);
    });

    section.append(keysDiv);
    keyGrid.append(section);
  });
}

// ─── Render: custom buttons ───────────────────────────────────────────────────

function renderCustomButtons() {
  customRow.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    const item = state.custom[i];
    const btn  = document.createElement("button");
    btn.type = "button";
    btn.dataset.customSlot = i;

    if (item) {
      btn.className = "custom-key";
      btn.textContent = item.label;
      btn.dataset.latex = item.latex;
      btn.dataset.typst = item.typst ?? item.latex;
      btn.title = item.latex;
    } else {
      btn.className = "add-custom";
      btn.textContent = "+";
      btn.title = "Add custom button";
    }
    customRow.append(btn);
  }
}

// ─── Render: settings ────────────────────────────────────────────────────────

function renderSettings() {
  fontSizeSlider.value = String(state.fontSize);
  fontSizeOut.textContent = String(state.fontSize);

  document.querySelectorAll("[data-theme]").forEach((btn) =>
    btn.classList.toggle("is-active", btn.dataset.theme === state.theme)
  );

  // Swatches
  const swatchContainer = $("swatches");
  swatchContainer.innerHTML = "";
  SWATCHES.forEach((color) => {
    const btn = document.createElement("button");
    btn.className = "swatch";
    btn.type = "button";
    btn.style.setProperty("--swatch-color", color);
    btn.classList.toggle("is-active", color === state.fontColor);
    btn.title = color;
    btn.setAttribute("aria-label", `Color ${color}`);
    btn.addEventListener("click", () => {
      state.fontColor = color;
      renderSettings();
      applyTheme();
      scheduleSave();
    });
    swatchContainer.append(btn);
  });
}

// ─── Theme application ────────────────────────────────────────────────────────

function applyTheme() {
  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved    = state.theme === "auto"
    ? (prefersDark ? "dark" : "light")
    : state.theme;

  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.setProperty("--equation-color", state.fontColor);
  document.documentElement.style.setProperty("--equation-size",  `${state.fontSize * 3}px`);
}

// ─── Event handlers ───────────────────────────────────────────────────────────

function onEditorInput() {
  state.equation = editor.value;
  updatePreview();
  scheduleSave();
}

function onGlobalClick(e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  // Tab switch
  if (btn.dataset.tab) {
    state.activeTab = btn.dataset.tab;
    renderTabs();
    renderKeyboard();
    scheduleSave();
    return;
  }

  // Key insertion
  if (btn.dataset.latex) {
    insertToken(btn.dataset.latex);
    return;
  }

  // Custom slot
  if (btn.classList.contains("add-custom")) {
    openCustomDialog(Number(btn.dataset.customSlot));
    return;
  }

  // Named actions
  const action = btn.dataset.action;
  if (action) handleAction(action);
}

function onKeyDown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === "z") {
    e.preventDefault();
    undo();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "y") {
    e.preventDefault();
    redo();
  }
}

// ─── Actions ─────────────────────────────────────────────────────────────────

async function handleAction(action) {
  switch (action) {
    case "new":          newEquation();          break;
    case "undo":         undo();                 break;
    case "redo":         redo();                 break;
    case "clear":        clearEquation();        break;
    case "toggle-mode":  toggleMode();           break;
    case "copy-latex":   await copyText(currentLatex(), "LaTeX copied"); break;
    case "copy-typst":   await copyText(toTypst(currentLatex()), "Typst copied"); break;
    case "copy-image":   await copyImage();      break;
    case "insert":       await insertIntoPage(); break;
    case "settings":     openSettings();         break;
    case "history":      insertHistory();        break;
    case "favorite":     showToast("Saved to favorites"); break;
    case "help":         showToast("Click a field on a page → open Mathdeck → Insert"); break;
    case "open-matrix":  openMatrixDialog();     break;
  }
}

function newEquation() {
  const latex = currentLatex().trim();
  if (latex) {
    state.history.unshift(editor.value);
    state.history = [...new Set(state.history)].slice(0, 20);
  }
  pushUndo();
  editor.value = "";
  onEditorInput();
  showToast("New equation");
}

function clearEquation() {
  pushUndo();
  editor.value = "";
  onEditorInput();
}

function undo() {
  if (!state.undo.length) return;
  state.redo.push(editor.value);
  editor.value = state.undo.pop();
  onEditorInput();
}

function redo() {
  if (!state.redo.length) return;
  state.undo.push(editor.value);
  editor.value = state.redo.pop();
  onEditorInput();
}

function pushUndo() {
  state.undo.push(editor.value);
  state.undo = state.undo.slice(-60);
  state.redo = [];
}

function toggleMode() {
  // Determine next mode based on persisted state, not editor.mode which
  // fluctuates when smartMode auto-switches mid-typing.
  const nextMode = (state.editorMode === "text") ? "math" : "text";
  state.editorMode = nextMode;

  // Switch the field's current mode explicitly
  editor.executeCommand(["switchMode", nextMode]);
  // Update defaultMode so new sessions restore correctly
  editor.defaultMode = nextMode;

  updateModeIndicator(nextMode);
  scheduleSave();
  showToast(nextMode === "text"
    ? "Text mode — type prose, spaces work normally"
    : "Math mode — type equations (Alt+= to return to text)"
  );
}

/**
 * Updates the mode toggle button and mode badge to reflect the current mode.
 * Called on: init, mode-change event, manual toggle.
 * @param {"text"|"math"} mode
 */
function updateModeIndicator(mode) {
  const btn   = $("modeToggle");
  const badge = $("modeBadge");
  if (!btn) return;

  const isText = mode === "text";

  // Button tooltip + aria
  btn.title = isText
    ? "Text mode — spaces work normally. Click or Alt+= for Math"
    : "Math mode — click or Alt+= to return to Text";
  btn.setAttribute("aria-label", isText ? "Switch to math mode" : "Switch to text mode");

  // Button highlight
  btn.style.background = isText
    ? "color-mix(in srgb, var(--primary) 14%, transparent)"
    : "";
  btn.style.color = isText ? "var(--primary)" : "";

  // Button icon
  btn.innerHTML = isText
    ? `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
         <text x="2" y="11" font-size="10" font-weight="800" fill="currentColor"
               font-family="Inter,sans-serif">T</text>
         <circle cx="11" cy="4" r="2" fill="currentColor" opacity="0.5"/>
       </svg>`
    : `<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
         <text x="1" y="11" font-size="12" font-weight="700" fill="currentColor"
               font-family="Cambria Math,serif">∑</text>
       </svg>`;

  // Badge pill
  if (badge) {
    badge.dataset.mode = mode;
    badge.textContent  = isText ? "Text" : "Math";
  }
}

function insertHistory() {
  const latest = state.history.find(Boolean);
  if (!latest) { showToast("No recent equations"); return; }
  insertToken(latest);
}

function openSettings() {
  renderSettings();
  settingsDialog.showModal();
}

function setTheme(t) {
  state.theme = t;
  renderSettings();
  applyTheme();
  scheduleSave();
}

function onFontSize() {
  state.fontSize = Number(fontSizeSlider.value);
  fontSizeOut.textContent = String(state.fontSize);
  applyTheme();
  scheduleSave();
}

// ─── Token insertion ──────────────────────────────────────────────────────────

function insertToken(token) {
  pushUndo();
  editor.focus();

  // Use mode:"math" in insert options so MathLive parses the LaTeX as math
  // WITHOUT switching the field's current mode. This is the correct approach
  // per the MathLive API (InsertOptions.mode). It avoids disrupting smartMode
  // and the surrounding text context — the cursor stays in text mode after
  // the math atom is inserted so the user can keep typing prose normally.
  editor.insert(token.replaceAll("□", "#?"), {
    format: "latex",
    mode: "math",           // parse as math, don't change current field mode
    selectionMode: "placeholder",
    smartFence: true,
  });

  onEditorInput();
}

// ─── Preview (mixed text + math) ──────────────────────────────────────────────

function updatePreview() {
  const val = editor.value ?? "";
  preview.value = val;
}

function currentLatex() {
  return editor.getValue("latex-without-placeholders");
}

// ─── Toggle keyboard ──────────────────────────────────────────────────────────

function toggleKeyboard() {
  const panel = $("keyboardPanel");
  const btn   = $("collapseBtn");
  const hidden = panel.classList.toggle("is-collapsed");
  btn.classList.toggle("is-open", !hidden);
  btn.setAttribute("aria-expanded", String(!hidden));
}

// ─── Matrix builder ───────────────────────────────────────────────────────────

function openMatrixDialog() {
  matrixEnv = "pmatrix";
  $("matrixRows").value = "2";
  $("matrixCols").value = "2";
  $("matrixTypeRow").querySelectorAll(".matrix-type-btn").forEach((b) =>
    b.classList.toggle("is-active", b.dataset.env === matrixEnv)
  );
  buildMatrixGrid();
  matrixDialog.showModal();
}

function buildMatrixGrid() {
  const rows = Math.min(8, Math.max(1, parseInt($("matrixRows").value) || 2));
  const cols = Math.min(8, Math.max(1, parseInt($("matrixCols").value) || 2));
  const grid = $("matrixGridPreview");

  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.innerHTML = "";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const inp = document.createElement("input");
      inp.className = "matrix-cell";
      inp.type = "text";
      inp.placeholder = `a_{${r + 1}${c + 1}}`;
      inp.setAttribute("aria-label", `Row ${r + 1} Col ${c + 1}`);
      inp.dataset.row = r;
      inp.dataset.col = c;
      grid.append(inp);
    }
  }
}

function doInsertMatrix() {
  const rows = Math.min(8, Math.max(1, parseInt($("matrixRows").value) || 2));
  const cols = Math.min(8, Math.max(1, parseInt($("matrixCols").value) || 2));
  const grid = $("matrixGridPreview");
  const cells = grid.querySelectorAll(".matrix-cell");

  // Build 2D array of cell values (use placeholder if empty)
  const data = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      const inp = grid.querySelector(`[data-row="${r}"][data-col="${c}"]`);
      return (inp?.value?.trim()) || `a_{${r + 1}${c + 1}}`;
    })
  );

  // Serialize to LaTeX
  const body = data
    .map((row) => row.join(" & "))
    .join(" \\\\ ");

  const latex = `\\begin{${matrixEnv}} ${body} \\end{${matrixEnv}}`;

  matrixDialog.close();
  insertToken(latex);
  showToast(`${rows}×${cols} matrix inserted`);
}

// ─── Custom button dialog ─────────────────────────────────────────────────────

function openCustomDialog(slot) {
  customSlot = slot;
  const item = state.custom[slot] ?? { label: "", latex: "" };
  customLabelIn.value = item.label;
  customValueIn.value = item.latex;
  customDialog.showModal();
  setTimeout(() => customLabelIn.focus(), 50);
}

function saveCustomButton() {
  const label = customLabelIn.value.trim();
  const latex = customValueIn.value.trim();

  if (!label || !latex || customSlot < 0) {
    showToast("Both label and LaTeX are required");
    return;
  }
  state.custom[customSlot] = { label, latex, typst: toTypst(latex) };
  renderCustomButtons();
  scheduleSave();
  customDialog.close();
  showToast("Custom button saved");
}

// ─── Copy actions ─────────────────────────────────────────────────────────────

async function copyText(text, message) {
  if (!text.trim()) { showToast("Nothing to copy"); return; }
  await navigator.clipboard.writeText(text);
  showToast(message);
}

async function copyImage() {
  const latex = currentLatex().trim();
  if (!latex) { showToast("Nothing to copy"); return; }
  try {
    const blob = await renderEquationToPng(latex);
    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    showToast("Image copied");
  } catch (err) {
    console.error("copyImage failed:", err);
    showToast("Image copy failed");
  }
}

/**
 * Renders a LaTeX string to a crisp PNG Blob.
 *
 * Uses MathLive's convertLatexToMarkup() to get properly typeset HTML,
 * inlines @font-face rules from the already-loaded document stylesheets,
 * wraps everything in an SVG <foreignObject>, draws to a 2× DPR canvas,
 * and exports as PNG. Fonts work because they're already loaded in the
 * extension popup's document — we just re-declare them so the SVG blob
 * renderer can access them.
 */
async function renderEquationToPng(latex) {
  const { convertLatexToMarkup } = await import("./node_modules/mathlive/mathlive.min.mjs");

  const PAD      = 32;
  const DPR      = 2;
  const fontSize = state.fontSize * 4;
  const color    = state.fontColor;

  // 1. Typeset HTML
  const mathHtml = convertLatexToMarkup(latex, { mathstyle: "displaystyle" });

  // 2. Measure rendered size in DOM (fonts already loaded here)
  const probe = document.createElement("div");
  Object.assign(probe.style, {
    position: "fixed", left: "-9999px", top: "0",
    fontSize: `${fontSize}px`, color, background: "white",
    display: "inline-block", padding: `${PAD}px`,
    whiteSpace: "nowrap", lineHeight: "1.5", visibility: "hidden",
  });
  probe.innerHTML = mathHtml;
  document.body.appendChild(probe);
  await new Promise((r) => requestAnimationFrame(r));
  await new Promise((r) => requestAnimationFrame(r));
  const { width: rw, height: rh } = probe.getBoundingClientRect();
  document.body.removeChild(probe);
  const W = Math.max(300, Math.ceil(rw));
  const H = Math.max(100, Math.ceil(rh));

  // 3. Collect @font-face rules from loaded stylesheets
  let fontFaces = "";
  try {
    for (const sheet of document.styleSheets) {
      let rules;
      try { rules = sheet.cssRules; } catch { continue; }
      for (const rule of rules) {
        if (rule instanceof CSSFontFaceRule) fontFaces += rule.cssText + "\n";
      }
    }
  } catch { /* non-critical */ }

  // 4. Build self-contained XHTML for foreignObject
  const xhtml = `<html xmlns="http://www.w3.org/1999/xhtml"><head><style>
${fontFaces}
*{box-sizing:border-box;margin:0;padding:0;}
body{width:${W}px;height:${H}px;background:white;
  display:flex;align-items:center;justify-content:center;
  font-size:${fontSize}px;color:${color};}
</style></head><body>
<div style="padding:${PAD}px;white-space:nowrap;line-height:1.5;">${mathHtml}</div>
</body></html>`;

  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<rect width="${W}" height="${H}" rx="10" fill="white"/>
<foreignObject x="0" y="0" width="${W}" height="${H}">${xhtml}</foreignObject></svg>`;

  // 5. SVG → canvas → PNG
  return new Promise((resolve, reject) => {
    const canvas  = document.createElement("canvas");
    canvas.width  = W * DPR;
    canvas.height = H * DPR;
    const ctx = canvas.getContext("2d");
    ctx.scale(DPR, DPR);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, W, H);

    const img  = new Image();
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url  = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, W, H);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (png) => png ? resolve(png) : reject(new Error("toBlob failed")),
        "image/png"
      );
    };

    // Fallback: draw as plain styled text (always readable)
    img.onerror = () => {
      URL.revokeObjectURL(url);
      ctx.font = `${fontSize}px "Cambria Math", Cambria, Georgia, serif`;
      ctx.fillStyle = color;
      ctx.textBaseline = "middle";
      ctx.fillText(latex, PAD, H / 2);
      canvas.toBlob(
        (png) => png ? resolve(png) : reject(new Error("fallback failed")),
        "image/png"
      );
    };

    img.src = url;
  });
}

// ─── Page insertion ───────────────────────────────────────────────────────────

async function insertIntoPage() {
  const text = currentLatex().trim();
  if (!text) { showToast("Nothing to insert"); return; }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("no active tab");

    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectText,
      args: [text],
    });

    if (result?.result) {
      showToast("Inserted into page");
    } else {
      await navigator.clipboard.writeText(text);
      showToast("Copied — no editable field found");
    }
  } catch {
    await navigator.clipboard.writeText(text);
    showToast("Copied — page insertion unavailable");
  }
}

// Runs inside the page context
function injectText(text) {
  const el = document.activeElement;
  if (!el) return false;

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    const s = el.selectionStart ?? el.value.length;
    const e = el.selectionEnd   ?? el.value.length;
    el.value = el.value.slice(0, s) + text + el.value.slice(e);
    el.selectionStart = el.selectionEnd = s + text.length;
    el.dispatchEvent(new InputEvent("input", { bubbles: true, data: text, inputType: "insertText" }));
    return true;
  }

  const ce = el.closest?.("[contenteditable='true'],[contenteditable='plaintext-only']");
  if (ce) {
    ce.focus();
    document.execCommand("insertText", false, text);
    ce.dispatchEvent(new InputEvent("input", { bubbles: true, data: text, inputType: "insertText" }));
    return true;
  }

  return false;
}

// ─── Typst conversion ─────────────────────────────────────────────────────────

function toTypst(latex) {
  return latex
    .replaceAll("\\frac{",    "frac(")
    .replaceAll("\\sqrt{",    "sqrt(")
    .replaceAll("\\left(",    "(")
    .replaceAll("\\right)",   ")")
    .replaceAll("\\left[",    "[")
    .replaceAll("\\right]",   "]")
    .replaceAll("\\left|",    "abs(")
    .replaceAll("\\right|",   ")")
    .replaceAll("\\left\\{",  "brace(")
    .replaceAll("\\right\\}", ")")
    .replaceAll("\\mathbb{R}","RR")
    .replaceAll("\\mathbb{Z}","ZZ")
    .replaceAll("\\mathbb{N}","NN")
    .replaceAll("\\mathbb{Q}","QQ")
    .replaceAll("\\mathbb{C}","CC")
    .replaceAll("\\infty",    "infinity")
    .replaceAll("\\alpha",    "alpha")
    .replaceAll("\\beta",     "beta")
    .replaceAll("\\gamma",    "gamma")
    .replaceAll("\\delta",    "delta")
    .replaceAll("\\epsilon",  "epsilon")
    .replaceAll("\\theta",    "theta")
    .replaceAll("\\lambda",   "lambda")
    .replaceAll("\\mu",       "mu")
    .replaceAll("\\sigma",    "sigma")
    .replaceAll("\\omega",    "omega")
    .replaceAll("\\pi",       "pi")
    .replaceAll("\\nabla",    "nabla")
    .replaceAll("\\partial",  "diff")
    .replaceAll("\\vec{",     "arrow(")
    .replaceAll("\\hat{",     "hat(")
    .replaceAll("\\bar{",     "macron(")
    .replaceAll("\\tilde{",   "tilde(")
    .replaceAll("\\operatorname{", "")
    .replaceAll("\\text{",    "\"")
    .replaceAll("\\,",        " ")
    .replaceAll("\\\\",       "\\")
    .replaceAll("\\",         "");
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function showToast(msg) {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add("is-visible");
  toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2000);
}
