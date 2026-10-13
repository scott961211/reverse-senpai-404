// 世界觀專用互動，不修改共用 main.js 的手機選單或角色轉盤。
(() => {
    const text = document.getElementById("world-dialogue-text");
    const speaker = document.getElementById("world-speaker");
    const accessible = document.getElementById("world-dialogue-accessible");
    const count = document.getElementById("world-dialogue-count");
    const next = document.getElementById("world-dialogue-next");
    const restart = document.getElementById("world-dialogue-restart");
    if (!text || !speaker || !accessible || !count || !next || !restart) return;

    // 節錄初遇劇情；Discord 表情代碼不直接顯示於官網。
    const lines = [
        { speaker: "旁白", text: "被室友拖進酒吧的青，在吧台前坐了下來。" },
        { speaker: "青", text: "蜂蜜酒。" },
        { speaker: "棠", text: "弟弟，這裡是酒吧，你未滿十八不能喝……" },
        { speaker: "旁白", text: "青沒有說話，只是遞出了身分證。" },
        { speaker: "棠", text: "沒有啦……我開玩笑的啦……對不起。" },
        { speaker: "癒", text: "笑死，沒事啦，他已經習慣了。" },
        { speaker: "青", text: "……" },
        { speaker: "旁白", text: "如果青知道這杯酒會換來多少黑歷史，他大概會直接回宿舍。可惜，現在的他還不知道。" }
    ];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;
    let timer = null;
    let typing = false;

    function finish() {
        clearInterval(timer);
        timer = null;
        typing = false;
        text.textContent = lines[index].text;
        next.textContent = index === lines.length - 1 ? "閱讀完畢" : "繼續 ▸";
        next.disabled = index === lines.length - 1;
    }

    function render() {
        clearInterval(timer);
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
    reducedMotion.addEventListener("change", () => { if (reducedMotion.matches && typing) finish(); });
    window.addEventListener("pagehide", () => clearInterval(timer));
    window.addEventListener("pageshow", event => { if (event.persisted) finish(); });
    next.hidden = false;
    restart.hidden = false;
    render();
})();
