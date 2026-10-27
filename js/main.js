//=======================================
//頁首顯示當前位置
//=======================================

let currentPage = window.location.pathname.split("/").pop();

if(currentPage === "") {
    currentPage = "index.html";
}

let navLink = document.querySelectorAll("nav a")

navLink.forEach(function(link) {

    let linkPage = link.getAttribute("href");

    if(linkPage === currentPage) {

        link.classList.add("active");
        link.setAttribute("aria-current", "page");

    }
});

//========================================
//公告輪轉
//========================================

const newsList = document.querySelector(".news-list");

const prevButton = document.getElementById("news-prev");
const nextButton = document.getElementById("news-next");

// 公告輪播與影片播放共用此設定，尊重系統的減少動態偏好。
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if(newsList && prevButton && nextButton) {
    let moving = false,
        direction = 0,
        fallback;
    // 動畫完成後重排卡片，並用備援計時器避免輪播一直停在移動狀態。
    const finish = () => {
        if(!moving) return;
        clearTimeout(fallback);
        if(direction === 1) newsList.append(newsList.firstElementChild);
        newsList.style.transition = 'none';
        newsList.style.transform = 'translateX(0)';
        moving = false;
    };
    // step 為 1 時往下一則，為 -1 時往上一則；減少動態模式直接切換。
    const move = (step) => {
        if(moving || newsList.children.length < 2) return;
        if(motionPreference.matches) {
            if(step === 1) newsList.append(newsList.firstElementChild);
            else newsList.prepend(newsList.lastElementChild);
            return;
        }
        moving = true;
        direction = step;
        const distance = newsList.firstElementChild.getBoundingClientRect().width + (parseFloat(getComputedStyle(newsList).gap) || 0);
        newsList.style.transition = 'none';
        if(step === -1) {
            newsList.prepend(newsList.lastElementChild);
            newsList.style.transform = 'translateX(-' + distance + 'px)';
        }
        void newsList.offsetWidth;
        newsList.style.transition = 'transform .4s ease';
        newsList.style.transform = step === 1 ? 'translateX(-' + distance + 'px)' : 'translateX(0)';
        fallback = setTimeout(finish, 500);
    };
    nextButton.addEventListener('click', () => move(1));
    prevButton.addEventListener('click', () => move(-1));
    newsList.addEventListener('transitionend', event => {
        if(event.target === newsList && event.propertyName === 'transform') finish();
    });
    window.addEventListener('resize', finish);
    motionPreference.addEventListener('change', finish);
}
//----------------------------------------------
//漢堡選單
//----------------------------------------------

const menuButton = document.getElementById("menu-button");

const mainNov = document.getElementById("main-nav");

if(menuButton && mainNov) {
    // 同步選單外觀、按鈕文字與輔助閱讀狀態。
    const setOpen = open => {
        mainNov.classList.toggle('open', open);
        menuButton.textContent = open ? '✕' : '☰';
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    };
    menuButton.addEventListener('click', () => setOpen(!mainNov.classList.contains('open')));
    document.addEventListener('keydown', event => {
        if(event.key === 'Escape' && mainNov.classList.contains('open')) {
            setOpen(false);
            menuButton.focus();
        }
    });
    document.addEventListener('click', event => {
        if(!mainNov.contains(event.target) && !menuButton.contains(event.target)) setOpen(false);
    });
    mainNov.addEventListener('click', event => {
        if(event.target.closest('a')) setOpen(false);
    });
    const mobile = window.matchMedia('(max-width: 700px)');
    mobile.addEventListener('change', () => {
        if(mainNov.contains(document.activeElement)) menuButton.focus();
        setOpen(false);
    });
}
//--------------------------------------------------
//動畫
//--------------------------------------------------
// 首頁往下捲動時逐漸淡出提示，其餘頁面找不到此元素便不執行。
const scrollHint = document.getElementById("scroll-hint");
const heroGradient = document.getElementById("hero-gradient");

if(scrollHint && heroGradient) {

    window.addEventListener("scroll", function() {

        const scrollY = window.scrollY;

        let opacity = 1 - scrollY / 300;

        opacity = Math.max(0, Math.min(1, opacity));

        scrollHint.style.opacity = opacity;

    });

}

//---------------------------------------------
//角色轉盤
//---------------------------------------------

// 修改角色姓名、圖片與介紹時，集中編輯這份資料即可。
const characters = [{
        name: "青",
        image: "images/character/c.webp",
        description: "身高:160cm\n生日:2006/05/28\n生日花:紫鳶尾花\n花語:智慧、尊貴、靈性\n代表物:眼鏡\n代表色:紫色\n#反差#敏感#依賴#傲嬌"
    },
    {
        name: "棠",
        image: "images/character/t.webp",
        description: "身高:175cm\n生日:2005/03/25\n生日花:貼梗海棠\n花語:溫和、美麗、快樂\n代表物:西裝\n代表色:藍色\n#反差#浪漫#獨立#溫和"
    },
    {
        name: "心魔",
        image: "images/character/h.webp",
        description: "身分:未明\n身高:尚未公開\n生日:尚未公開\n生日花:尚未公開\n代表物:尚未公開\n代表色:尚未公開\n#身分未明#資料未公開"
    }
];

const characterStage = document.getElementById("character-stage");
const characterPrev = document.getElementById("character-prev");
const characterNext = document.getElementById("character-next");

const characterName = document.getElementById("character-name");
const characterDescription = document.getElementById("character-description");

if(characterStage && characterPrev && characterNext) {

    let selectedIndex = 0;

    const characterElements = [];

    characters.forEach(function(character, index) {

        const item = document.createElement("button");

        item.className = "character-item";
        item.type = "button";
        item.setAttribute("aria-label", `查看${character.name}的角色介紹`);
        item.setAttribute("aria-controls", "character-name character-description");
        const img = document.createElement("img");
        img.src = character.image;
        img.alt = `${character.name}角色立繪`;
        img.draggable = false;
        item.appendChild(img);

        item.addEventListener("click", function() {
            selectedIndex = index;
            updateCharacters();
        });

        characterStage.appendChild(item);
        characterElements.push(item);

    });

    // 依選取角色計算環形排列，更新圖片層次、姓名與介紹。
    function updateCharacters() {

        const total = characters.length;

        characterElements.forEach(function(item, index) {

            // 將左右距離限制在最短方向，讓首尾角色也能連續切換。
            let offset = index - selectedIndex;

            if(offset > total / 2) {
                offset -= total;
            }

            if(offset < -total / 2) {
                offset += total;
            }

            const angle = offset * 30 * Math.PI / 180;

            const radiusX = Math.min(characterStage.clientWidth * 0.6, 600);
            const radiusY = -65;

            const x = Math.sin(angle) * radiusX;
            const y = (1 - Math.cos(angle) * radiusY);

            const scale = Math.max(0.45, 0.85 - Math.abs(offset) * 0.25);
            const opacity = Math.max(0.3, 1 - Math.abs(offset) * 0.25);

            item.style.transform =
                `translate(${x}px, ${-y}px) scale(${scale})`;

            item.style.opacity = opacity;

            item.style.zIndex = 100 - Math.abs(offset);

            item.classList.toggle("selected", offset === 0);
            item.setAttribute("aria-pressed", String(offset === 0));

        });

        characterName.textContent = characters[selectedIndex].name;

        characterDescription.textContent = characters[selectedIndex].description;

    }

    characterPrev.addEventListener("click", function() {

        selectedIndex = (selectedIndex - 1 + characters.length) % characters.length;

        updateCharacters();

    });

    characterNext.addEventListener("click", function() {

        selectedIndex = (selectedIndex + 1) % characters.length;

        updateCharacters();

    });

    window.addEventListener("resize", updateCharacters);

    updateCharacters();
}

//========================================
//公告影片的播放與暫停
//========================================

// 使用者主動點擊才播放；切換成減少動態模式時暫停影片。
document.querySelectorAll('.news-card video').forEach(video => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'media-toggle';
    button.textContent = '播放動畫';
    button.setAttribute('aria-label', '播放棠的角色動畫');
    video.closest('.image-placeholder').after(button);
    // 讓按鈕文字隨影片實際播放狀態更新，而非只依點擊次數判斷。
    const sync = () => {
        button.textContent = video.paused ? '播放動畫' : '暫停動畫';
        button.setAttribute('aria-label', (video.paused ? '播放' : '暫停') + '棠的角色動畫');
    };
    button.addEventListener('click', async () => {
        if(!video.paused) video.pause();
        else {
            try {
                await video.play();
            } catch {
                button.textContent = '無法播放，請重試';
            }
        }
    });
    video.addEventListener('play', sync);
    video.addEventListener('pause', sync);
    motionPreference.addEventListener('change', () => {
        if(motionPreference.matches) video.pause();
    });
});
