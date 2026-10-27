//========================================
//角色資料的排版與主題配色
//========================================

// 直接讀取 main.js 的角色介紹，避免另外維護一份重複資料。
(() => {
    const description = document.getElementById('character-description');
    const facts = document.getElementById('character-facts');
    const tags = document.getElementById('character-tags');
    const page = document.querySelector('.character-page');
    const name = document.getElementById('character-name');
    if(!description || !facts || !tags || !page || !name) return;
    // 把冒號分隔的資料轉成欄位，把 # 分隔的特色轉成標籤。
    const render = () => {
        facts.replaceChildren();
        tags.replaceChildren();
        // 只整理顯示方式，原始介紹保留給輔助閱讀工具。
        for(const line of description.textContent.split('\n')) {
            if(line.startsWith('#')) {
                for(const label of line.split('#').filter(Boolean)) {
                    const tag = document.createElement('span');
                    tag.textContent = label;
                    tags.append(tag);
                }
                continue;
            }
            const separator = line.search(/[:：]/);
            if(separator < 0) continue;
            const item = document.createElement('div');
            const term = document.createElement('dt');
            const value = document.createElement('dd');
            term.textContent = line.slice(0, separator);
            value.textContent = line.slice(separator + 1);
            item.append(term, value);
            facts.append(item);
        }
        // CSS 依此屬性套用角色對應的光暈與文字顏色。
        page.dataset.character = name.textContent === '棠' ? 'tang' : name.textContent === '心魔' ? 'shadow' : 'qing';
        page.classList.add('profile-ready');
    };
    // main.js 切換介紹後，自動重新排版資料，不干擾原本的角色轉盤。
    new MutationObserver(render).observe(description, {
        childList: true,
        characterData: true,
        subtree: true
    });
    render();
})();
