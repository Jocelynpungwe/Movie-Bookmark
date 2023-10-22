const trending = document.getElementById("trending-section")
const recommendedDisplay = document.getElementById("recommended-display")
const searchMovieDisplay = document.getElementById("search-movie-display")
const search = document.getElementById("search")


const movieArray = ["love","marvel","fight","basketball","laugh","life","kids","food",]

let trendingArray = []
let recomandedArray = []
let searchArray = []
let bookmarkArray = []

localStorageArray = JSON.parse(localStorage.getItem("bookmark"))
if(localStorageArray)
{
    bookmarkArray = localStorageArray
}

trendingSection()
recommandedSection()

setTimeout(function(){
    bookMarkYellow()
},1000)

document.querySelector("body").addEventListener("click",function(e){
    if(e.target.dataset.bookmark)
    {
       
        fetch(`http://www.omdbapi.com/?apikey=d9137905&i=${e.target.dataset.bookmark}`)
        .then(res =>{
            if(!res.ok)
            {
                throw Error("Server currently unavailable")
            }
            return res.json()
        })
        .then(data=>{


            if(!bookmarkArray.map(i => i.imdbID).includes(e.target.dataset.bookmark))
            {
                bookmarkArray.push(data)
                localStorage.setItem("bookmark",JSON.stringify(bookmarkArray))
                const el = document.querySelector(`[data-bookmark="${e.target.dataset.bookmark}"]`);
                el.style.color = "yellow"
            }
                        
        })
        .catch(err => alert(err))
    }
})

search.addEventListener("change",function(){


    searchMovieDisplay.style.display = "block"

    fetch(`http://www.omdbapi.com/?apikey=d9137905&s=${search.value}&type=movie`)
    .then(res => {
        if(!res.ok)
        {
            throw Error("Server currently unavailable")
        }
       return res.json()
    
    })
    .then(data=>{
       
        if(data.Response === "True")
        {
            searchArray = data.Search
            searchMovieDisplay.innerHTML = `
                <h2>Found ${searchArray.length} results from '${search.value}'</h2>
                <div id="search-display" class="search-display"></div>
                `
                displayMovie()
                
        }
        else{
            searchMovieDisplay.innerHTML = `
            <h2>Found 0 results from '${search.value}'</h2>`
    
        }
        
    })
    .catch(err => alert(err))
        
})

function bookMarkYellow(){

    if(bookmarkArray)
    {
        for(let i = 0; i < bookmarkArray.length; i++)
        {
            const el = document.querySelector(`[data-bookmark="${bookmarkArray[i].imdbID}"]`);
            el.style.color = "yellow"

        }

    }

}

function randomString(){
    const randomIndex = Math.floor(Math.random() *  movieArray.length)
    return movieArray[randomIndex]
}

function trendingSection()
{
    fetch(`http://www.omdbapi.com/?apikey=d9137905&s=${randomString()}&type=movie`)
    .then(res => {
        if(!res.ok)
        {
            throw Error("Server currently unavailable")
        }
    return res.json()

    })
    .then(data=>{
        trendingArray = data.Search
        getTrendingApi(trendingArray,trending)
 
    })
    .catch(err => alert(err))

}


function recommandedSection(){

    fetch(`http://www.omdbapi.com/?apikey=d9137905&s=${randomString()}`)
    .then(res => {
        if(!res.ok)
        {
            throw Error("Server currently unavailable")
        }
    return res.json()

    })
    .then(data=>{
        recomandedArray = data.Search
        getMovieApi(recomandedArray,recommendedDisplay)
    })
    .catch(err => alert(err))


}

function displayMovie(){
 
    for(let i = 0 ; i < searchArray.length; i++)
    {
        fetch(`http://www.omdbapi.com/?apikey=d9137905&t=${searchArray[i].Title}`)
            .then(res=>res.json())
            .then(data=>{
 
                document.getElementById("search-display").innerHTML +=  renderHtmlMovie(data)
                bookMarkYellow()
            })
    }
    
}


function getMovieApi(array,display)
{
    for(let i = 0 ; i < array.length; i++)
    {
        fetch(`http://www.omdbapi.com/?apikey=d9137905&t=${array[i].Title}`)
            .then(res=>res.json())
            .then(data=>{
 
                display.innerHTML +=  renderHtmlMovie(data)
            })
    }
}

function getTrendingApi(array,display)
{
    for(let i = 0 ; i < array.length; i++)
    {
        fetch(`http://www.omdbapi.com/?apikey=d9137905&t=${array[i].Title}`)
            .then(res=>res.json())
            .then(data=>{
 
                display.innerHTML +=  renderHtmlTrending(data)
            })
    }
}


function renderHtmlTrending(data){
    return `
               <div class="movie-container">
                    <div class="poster-container">
                        <img class="poster-img-trending" src="${data.Poster}" alt="Poster of ${data.Title}"/>    
                        <div class="bookmark-circle">
                            <i class="fa-solid fa-bookmark" data-bookmark="${data.imdbID}"></i>
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
}

function renderHtmlMovie(data){
    return `
               <div class="movie-container">
                    <div class="poster-container">
                        <img class="poster-img" src="${data.Poster}" alt="Poster of ${data.Title}"/>    
                        <div class="bookmark-circle">
                            <i class="fa-solid fa-bookmark" data-bookmark="${data.imdbID}"></i>
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

}