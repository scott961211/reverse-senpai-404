// Present the existing character data without duplicating its content.
(() => {
    const description = document.getElementById('character-description');
    const facts = document.getElementById('character-facts');
    const tags = document.getElementById('character-tags');
    const page = document.querySelector('.character-page');
    const name = document.getElementById('character-name');
    if (!description || !facts || !tags || !page || !name) return;
    const render = () => {
        facts.replaceChildren();
        tags.replaceChildren();
        for (const line of description.textContent.split('\n')) {
            if (line.startsWith('#')) {
                for (const label of line.split('#').filter(Boolean)) {
                    const tag = document.createElement('span');
                    tag.textContent = label;
                    tags.append(tag);
                }
                continue;
            }
            const separator = line.search(/[:：]/);
            if (separator < 0) continue;
            const item = document.createElement('div');
            const term = document.createElement('dt');
            const value = document.createElement('dd');
            term.textContent = line.slice(0, separator);
            value.textContent = line.slice(separator + 1);
            item.append(term, value);
            facts.append(item);
        }
        page.dataset.character = name.textContent === '棠' ? 'tang' : name.textContent === '心魔' ? 'shadow' : 'qing';
        page.classList.add('profile-ready');
    };
    new MutationObserver(render).observe(description, { childList: true, characterData: true, subtree: true });
    render();
})();
