//========================================
//世界觀小劇場
//========================================

// 只操作世界觀頁面，對話順序與 demo 相同，到青說「不了。」結束。
// 世界觀專用互動，不修改共用 main.js 的手機選單或角色轉盤。
(() => {
    // 對話、操作按鈕及結尾畫面所需的元素。
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
    if(!text || !speaker || !accessible || !count || !next || !restart) return;

    // 原文節錄自 404demo，至青說「不了。」結束。
    const lines = [{
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

    //========================================
    //對話進度與計時器
    //========================================

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;
    let timer = null;
    let typing = false;
    let endingTimer = null;

    //========================================
    //結尾漸淡與立即試玩
    //========================================

    // 最後一句完成後顯示結尾，停用底下的操作並照顧鍵盤焦點。
    function showEnding() {
        if(!stage || !content || !finale) return;
        const moveFocus = content.contains(document.activeElement);
        finale.hidden = false;
        // 先確認初始透明度已套用，再開始 CSS 漸淡效果。
        void finale.offsetWidth;
        stage.classList.add("is-complete");
        content.inert = true;
        if(moveFocus) finale.querySelector("a").focus({
            preventScroll: true
        });
    }

    //========================================
    //立即顯示當前句子
    //========================================

    // 顯示全文或逐字播放完成時共用；最後一句停留 1.2 秒後進入結尾。
    function finish() {
        clearInterval(timer);
        timer = null;
        typing = false;
        text.textContent = lines[index].text;
        next.textContent = index === lines.length - 1 ? "閱讀完畢" : "繼續 ▸";
        next.disabled = index === lines.length - 1;
        clearTimeout(endingTimer);
        if(index === lines.length - 1) endingTimer = setTimeout(showEnding, 1200);
    }

    //========================================
    //切換對話與逐字顯示
    //========================================

    // 先清除舊計時器與結尾狀態，重新閱讀也使用同一個流程。
    function render() {
        clearInterval(timer);
        clearTimeout(endingTimer);
        if(stage) stage.classList.remove("is-complete");
        if(content) content.inert = false;
        if(finale) finale.hidden = true;
        const line = lines[index];
        speaker.textContent = line.speaker;
        accessible.textContent = `${line.speaker}：${line.text}`;
        count.textContent = `${index + 1} / ${lines.length}`;
        next.disabled = false;
        next.textContent = "顯示全文";
        text.textContent = "";
        typing = true;
        if(reducedMotion.matches) {
            finish();
            return;
        }
        // Array.from 可避免把一個 Unicode 字元拆成兩個不完整片段。
        const characters = Array.from(line.text);
        let position = 0;
        timer = setInterval(() => {
            text.textContent += characters[position++];
            if(position >= characters.length) finish();
        }, 45);
    }

    //========================================
    //閱讀操作與頁面生命週期
    //========================================

    // 原生按鈕支援滑鼠、觸控、Enter 與空白鍵。
    next.addEventListener("click", () => {
        if(typing) {
            finish();
            return;
        }
        if(index < lines.length - 1) {
            index++;
            render();
        }
    });
    restart.addEventListener("click", () => {
        index = 0;
        render();
    });
    if(replay) replay.addEventListener("click", () => {
        index = 0;
        render();
        next.focus({
            preventScroll: true
        });
    });
    reducedMotion.addEventListener("change", () => {
        if(reducedMotion.matches && typing) finish();
    });
    // 離開頁面時清除計時器，瀏覽器還原此頁時補齊當前句子。
    window.addEventListener("pagehide", () => {
        clearInterval(timer);
        clearTimeout(endingTimer);
    });
    window.addEventListener("pageshow", event => {
        if(event.persisted) finish();
    });
    next.hidden = false;
    restart.hidden = false;
    render();
})();
