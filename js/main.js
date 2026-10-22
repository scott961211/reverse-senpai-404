//=======================================
//業首顯示當前位置
//=======================================

let currentPage = window.location.pathname.split("/").pop();

if(currentPage === ""){
    currentPage = "index.html";
}

let navLink = document.querySelectorAll("nav a")

navLink.forEach(function(link){

    let linkPage = link.getAttribute("href");

    if(linkPage === currentPage){

        link.classList.add("active");

    }
});

//========================================
//公告輪轉
//========================================

const newsList = document.querySelector(".news-list");

const prevButton = document.getElementById("news-prev");
const nextButton = document.getElementById("news-next");

if(newsList && prevButton && nextButton){

    let isMoving = false;

    function getMoveDistance(){

        const firstCard = newsList.firstElementChild;
        const cardWidth = firstCard.getBoundingClientRect().width;
        const listStyle = window.getComputedStyle(newsList);
        const gap = parseFloat(listStyle.gap) || 0;

        return cardWidth + gap;
    }

    nextButton.addEventListener("click",function(){

        if(isMoving){
            return;
        }

        isMoving = true;

        const moveDistance = getMoveDistance();

        newsList.style.transition = "transform 0.4s ease";

        newsList.style.transform = `translateX(-${moveDistance}px)`;

    });

    newsList.addEventListener("transitionend",function(){

        if(newsList.style.transform.includes("-")){

            const firstCard = newsList.firstElementChild;

            newsList.appendChild(firstCard);
         
            newsList.style.transition = "none";

            newsList.style.transform = "translateX(0)";

            isMoving = false;
        }
    });

    prevButton.addEventListener("click",function(){

        if(isMoving){
            return;
        }

        isMoving = true;

        const lastCard = newsList.lastElementChild;

        newsList.style.transition = "none";

        newsList.prepend(lastCard);

        const moveDistance = getMoveDistance();

        newsList.style.transform = `translateX(-${moveDistance}px)`;

        newsList.offsetHeight;

        newsList.style.transition = "transform 0.4s ease";

        newsList.style.transform = "translateX(0)";

        function previousFinished(){

            isMoving = false;

            newsList.removeEventListener(
                "transitionend",
                previousFinished
            );

        }

        newsList.addEventListener(
            "transitionend",
            previousFinished
        );

    });

}
//----------------------------------------------
//漢堡選單
//----------------------------------------------

const menuButton = document.getElementById("menu-button");

const mainNov = document.getElementById("main-nav");

if(menuButton && mainNov){

    menuButton.addEventListener("click", function(){

        const isOpen = mainNov.classList.toggle("open");

        menuButton.textContent = isOpen ? "✕" : "☰";
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "關閉選單" : "開啟選單"
        );

    });

}

//--------------------------------------------------
//動畫
//--------------------------------------------------
const scrollHint = document.getElementById("scroll-hint");
const heroGradient = document.getElementById("hero-gradient");

if(scrollHint && heroGradient){

    window.addEventListener("scroll",function(){

        const scrollY = window.scrollY;

        let opacity = 1 - scrollY/300;

        opacity = Math.max(0,Math.min(1,opacity));

        scrollHint.style.opacity = opacity;
        heroGradient.style.opacity = opacity;
    });

}

//---------------------------------------------
//角色轉盤
//---------------------------------------------

const characters = [
    {
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
        description: "身高:?\n生日:?\n生日花:?\n花語:?、?、?\n代表物:?\n代表色:?\n#?#?#?#?"
    }
];

const characterStage = document.getElementById("character-stage");
const characterPrev = document.getElementById("character-prev");
const characterNext = document.getElementById("character-next");

const characterName = document.getElementById("character-name");
const characterDescription = document.getElementById("character-description");

if(characterStage && characterPrev && characterNext){

    let selectedIndex = 0;

    const characterElements = [];

    characters.forEach(function(character,index){

        const item = document.createElement("div");

        item.className = "character-item";
        const img = document.createElement("img");
        img.src = character.image;
        img.alt = `${character.name}角色立繪`;
        img.draggable = false;
        item.appendChild(img);

        item.addEventListener("click", function(){
            selectedIndex = index;
            updateCharacters();
        });

        characterStage.appendChild(item);
        characterElements.push(item);

    });

    function updateCharacters(){

        const total = characters.length;

        characterElements.forEach(function(item, index){

            let offset = index - selectedIndex;

            if(offset > total / 2){
                offset -= total;
            }

            if(offset < -total / 2){
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

        });

        characterName.textContent = characters[selectedIndex].name;

        characterDescription.textContent = characters[selectedIndex].description;

    }

    characterPrev.addEventListener("click", function(){

        selectedIndex = (selectedIndex - 1 + characters.length) % characters.length;

        updateCharacters();

    });

    characterNext.addEventListener("click",function(){

        selectedIndex = (selectedIndex + 1) % characters.length;

        updateCharacters();

    });

    window.addEventListener("resize", updateCharacters);

    updateCharacters();
}