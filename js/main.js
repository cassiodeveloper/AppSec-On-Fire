(() => {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(() => {
    const root = document.documentElement;

    // 1) DATA FIRST (antes de qualquer função que use)
    const PT = [
      { q: "Seu AppSec é forte… até o primeiro incidente.", h: "Produção é o árbitro. Não o seu slide." },
      { q: "Ferramenta não é estratégia.", h: "SAST não pensa. Você pensa." },
      { q: "“Depende” sem decisão é covardia técnica.", h: "Escolha e banque. Depois melhore." },
      { q: "Patch ruim é um incêndio novo.", h: "Conserta, mas não quebra o resto." },
      { q: "Segredo em log não é acidente. É processo falhando.", h: "Rotação + prevenção. Sempre." },
      { q: "Autorização é onde sistemas bons morrem.", h: "AuthN é fácil. AuthZ é o inferno." },
      { q: "Pipeline sem gates é decoração.", h: "Integra, mede, melhora. Sem teatro." },
      { q: "Quem prioriza mal cria vulnerabilidade com prazo.", h: "Risco tem fila. Você decide a ordem." }
    ];

    const EN = [
      { q: "Your AppSec is strong… until the first incident.", h: "Production is the referee. Not your slides." },
      { q: "Tools aren’t strategy.", h: "SAST doesn’t think. You do." },
      { q: "“It depends” without a decision is technical cowardice.", h: "Pick a call. Own it. Improve later." },
      { q: "A bad patch is a new fire.", h: "Fix it without breaking the rest." },
      { q: "Secrets in logs aren’t accidents. Processes failed.", h: "Rotate + prevent. Always." },
      { q: "Authorization is where good systems die.", h: "AuthN is easy. AuthZ is hell." },
      { q: "A pipeline without gates is decoration.", h: "Integrate, measure, improve. No theater." },
      { q: 'Bad prioritization is a vulnerability with a deadline.', h: "Risk has a queue. You set the order." }
    ];

    // Elements
    const switchBtn = document.getElementById("switch");
    const langLabel = document.getElementById("langLabel");
    const year = document.getElementById("year");
    const quoteText = document.getElementById("quoteText");
    const quoteHint = document.getElementById("quoteHint");
    const shuffleBtn = document.getElementById("shuffleBtn");

    if (!switchBtn || !langLabel || !year) {
      console.warn("[AOF] Missing required elements (switch/langLabel/year). Check IDs.");
      return;
    }

    year.textContent = new Date().getFullYear();

    function pick(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function setMeta(name, content) {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    }

    // 2) FUNCTIONS SECOND
    function renderQuote() {
      if (!quoteText || !quoteHint) return;
      const lang = root.getAttribute("data-lang") || "pt";
      const item = pick(lang === "en" ? EN : PT);
      quoteText.textContent = item.q;
      quoteHint.textContent = item.h;
    }

    function setLang(lang, pushToUrl) {
      root.setAttribute("data-lang", lang);
      root.lang = lang === "pt" ? "pt-BR" : "en";
      localStorage.setItem("aof_lang", lang);

      switchBtn.dataset.lang = lang;
      langLabel.textContent = lang === "pt" ? "PT" : "EN";

      if (lang === "pt") {
        document.title = "AppSec on Fire | Secure Under Pressure";
        setMeta("description", "AppSec on Fire: competição estilo reality para formar talentos júnior em AppSec. 12 participantes, 2 provas por episódio, 1 eliminado. Sem slide. Sem desculpa.");
      } else {
        document.title = "AppSec on Fire | Secure Under Pressure";
        setMeta("description", "AppSec on Fire: a reality-style AppSec competition to grow junior talent. 12 contestants, 2 challenges per episode, 1 eliminated. No slides. No excuses.");
      }

      if (pushToUrl) {
        const u = new URL(window.location.href);
        u.searchParams.set("lang", lang);
        window.history.replaceState({}, "", u.toString());
      }

      renderQuote();
    }

    // 3) RUN LAST
    const url = new URL(window.location.href);
    const qp = url.searchParams.get("lang");
    const saved = localStorage.getItem("aof_lang");
    const initial = (qp === "en" || qp === "pt") ? qp : ((saved === "en" || saved === "pt") ? saved : "pt");
    setLang(initial, false);

    switchBtn.addEventListener("click", () => {
      const next = (root.getAttribute("data-lang") === "pt") ? "en" : "pt";
      setLang(next, true);
    });

    if (shuffleBtn) shuffleBtn.addEventListener("click", renderQuote);

    renderQuote();
  });
})();
