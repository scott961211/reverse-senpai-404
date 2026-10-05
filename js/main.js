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

const menuButton = document.getElementById("menu-button");

const mainNov = document.getElementById("main-nav");

if(menuButton && mainNov){

    menuButton.addEventListener("click", function(){

        mainNov.classList.toggle("open");

        if(mainNov.classList.contains("open")){

            menuButton.textContent = "✕"

        }else{

            menuButton.textContent = "☰"
            
        }

    });

}