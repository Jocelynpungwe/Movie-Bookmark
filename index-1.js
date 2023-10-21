let bookmarkDisplay = document.getElementById("bookmark-display")
let emptyBookmark = document.getElementById("empty-bookmark")

let bookArray = JSON.parse(localStorage.getItem("bookmark"))
        
        
if(!bookArray[0])
{
    emptyBookmark.style.display =  "block"
}else{
    emptyBookmark.style.display =  "none"
}

displayBook = bookArray.map(data=>{
        return `
            <div class="movie-container">
                    <div class="poster-container">
                        <img class="poster-img" src="${data.Poster} alt="Poster of ${data.Title}""/>    
                        <div class="bookmark-circle">
                            <i class="fa-solid fa-bookmark marked" data-remove="${data.imdbID}"></i>
                        </div>
                    </div>

                    <div class="movie-section">
                        <p class="movie-title">${data.Title}</p>
                        <div class="year-container">
                            <i class="fa-solid fa-film"></i>
                            <p>${data.Year}</p>
                        </div>
                        <p>${data.Genre}</p>
                        <p>${data.Rated}</p>
                        
                    </div>
            </div>
            `
}).join("")


bookmarkDisplay.innerHTML = displayBook

document.querySelector("body").addEventListener("click",function(e){
    if(e.target.dataset.remove)
    {

    let index = bookArray.findIndex(element => element.imdbID == e.target.dataset.remove)

    bookArray.splice(index, 1);             
    displayBook = bookArray.map(data =>{
        return `
            <div class="movie-container">
                    <div class="poster-container">
                        <img class="poster-img" src="${data.Poster}" alt="Poster of ${data.Title}"/>    
                        <div class="bookmark-circle">
                            <i class="fa-solid fa-bookmark marked" data-remove="${data.imdbID}"></i>
                        </div>
                    </div>

                    <div class="movie-section">
                        <p class="movie-title">${data.Title}</p>
                        <div class="year-container">
                            <i class="fa-solid fa-film"></i>
                            <p>${data.Year}</p>
                        </div>
                        <p>${data.Genre}</p>
                        <p>${data.Rated}</p>
                        
                    </div>
            </div>
                `
        }).join("")


        if(bookArray)
        {
            bookmarkDisplay.innerHTML = displayBook
        }
        
        if(!bookArray[0])
        {
            emptyBookmark.style.display =  "block"
        }
        
        localStorage.setItem("bookmark",JSON.stringify(bookArray))   
    
    }
               
})

