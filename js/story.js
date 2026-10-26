// 世界觀專用互動，不修改共用 main.js 的手機選單或角色轉盤。
(() => {
    const text = document.getElementById("world-dialogue-text");
    const speaker = document.getElementById("world-speaker");
    const accessible = document.getElementById("world-dialogue-accessible");
    const count = document.getElementById("world-dialogue-count");
    const next = document.getElementById("world-dialogue-next");
    const restart = document.getElementById("world-dialogue-restart");
    const stage = document.querySelector(".world-scene-stage");
    const content = document.getElementById("world-scene-content");
    const finale = document.getElementById("world-scene-finale");
    const replay = document.getElementById("world-scene-replay");
    if (!text || !speaker || !accessible || !count || !next || !restart) return;

    // 原文節錄自 404demo，至青說「不了。」結束。
    const lines = [
        {
            "speaker": "青",
            "text": "我先走了。"
        },
        {
            "speaker": "棠",
            "text": "不洗個澡再走嗎。你這幅樣子⋯⋯。"
        },
        {
            "speaker": "青",
            "text": "再見。"
        },
        {
            "speaker": "棠",
            "text": "額⋯⋯加個聯絡方式⋯⋯？"
        },
        {
            "speaker": "青",
            "text": "不了。"
        }
    ];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;
    let timer = null;
    let typing = false;
    let endingTimer = null;

    function showEnding() {
        if (!stage || !content || !finale) return;
        const moveFocus = content.contains(document.activeElement);
        finale.hidden = false;
        // Commit the initial opacity before starting the fade.
        void finale.offsetWidth;
        stage.classList.add("is-complete");
        content.inert = true;
        if (moveFocus) finale.querySelector("a").focus({ preventScroll: true });
    }

    function finish() {
        clearInterval(timer);
        timer = null;
        typing = false;
        text.textContent = lines[index].text;
        next.textContent = index === lines.length - 1 ? "閱讀完畢" : "繼續 ▸";
        next.disabled = index === lines.length - 1;
        clearTimeout(endingTimer);
        if (index === lines.length - 1) endingTimer = setTimeout(showEnding, 1200);
    }

    function render() {
        clearInterval(timer);
        clearTimeout(endingTimer);
        if (stage) stage.classList.remove("is-complete");
        if (content) content.inert = false;
        if (finale) finale.hidden = true;
        const line = lines[index];
        speaker.textContent = line.speaker;
        accessible.textContent = `${line.speaker}：${line.text}`;
        count.textContent = `${index + 1} / ${lines.length}`;
        next.disabled = false;
        next.textContent = "顯示全文";
        text.textContent = "";
        typing = true;
        if (reducedMotion.matches) { finish(); return; }
        const characters = Array.from(line.text);
        let position = 0;
        timer = setInterval(() => {
            text.textContent += characters[position++];
            if (position >= characters.length) finish();
        }, 45);
    }

    // 原生按鈕支援滑鼠、觸控、Enter 與空白鍵。
    next.addEventListener("click", () => {
        if (typing) { finish(); return; }
        if (index < lines.length - 1) { index++; render(); }
    });
    restart.addEventListener("click", () => { index = 0; render(); });
    if (replay) replay.addEventListener("click", () => {
        index = 0;
        render();
        next.focus({ preventScroll: true });
    });
    reducedMotion.addEventListener("change", () => { if (reducedMotion.matches && typing) finish(); });
    window.addEventListener("pagehide", () => { clearInterval(timer); clearTimeout(endingTimer); });
    window.addEventListener("pageshow", event => { if (event.persisted) finish(); });
    next.hidden = false;
    restart.hidden = false;
    render();
})();
