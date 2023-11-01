const trending = document.getElementById("trending-section")
const recommendedDisplay = document.getElementById("recommended-display")
const searchMovieDisplay = document.getElementById("search-movie-display")
const search = document.getElementById("search")
const bookmarkSection = document.getElementById("bookmark-section")

let trendingArray = []
let recomandedArray = []
let searchArray = []
let bookmarkArray = []
    
checkLocalStorage()
trendingSection()
recommandedSection()

setTimeout(function(){
    bookMarkYellow()
},1000)

document.querySelector("body").addEventListener("click",function(e){
    if(e.target.dataset.bookmark)
    {
        fetch(`https://www.omdbapi.com/?apikey=d9137905&i=${e.target.dataset.bookmark}`)
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
                const displayBookmark = document.querySelector(`[data-bookmark="${e.target.dataset.bookmark}"]`)
                displayBookmark.style.color = "yellow"  
            }
                        
        })
        .catch(err => alert(err))
    }
})

search.addEventListener("change",function(){

    searchMovieDisplay.style.display = "block"

    fetch(`https://www.omdbapi.com/?apikey=d9137905&s=${search.value}&type=movie`)
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

function checkLocalStorage(){
    localStorageArray = JSON.parse(localStorage.getItem("bookmark"))

    if(localStorageArray)
    {
        
        bookmarkArray = localStorageArray

        for(let i = 0; i < bookmarkArray.length; i++)
        {
            fetch(`https://www.omdbapi.com/?apikey=d9137905&t=${bookmarkArray[i].Title}`)
                .then(res=>{
                    if(!res.ok)
                    {
                        throw Error;    
                    }
                    res.json()
                })
                .then(data=>{
        
                    bookmarkSection.innerHTML += renderHtmlMovie(data,false)
        
                })
                .catch(err => alert(err))
        }
        
    }

}

function trendingSection()
{
    fetch("https://www.omdbapi.com/?apikey=d9137905&s=love&type=movie")
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

    fetch("https://www.omdbapi.com/?apikey=d9137905&s=fight")
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



function displayMovie(){
 
    for(let i = 0 ; i < searchArray.length; i++)
    {
        fetch(`https://www.omdbapi.com/?apikey=d9137905&t=${searchArray[i].Title}`)
            .then(res=>res.json())
            .then(data=>{
 
                document.getElementById("search-display").innerHTML +=  renderHtmlMovie(data,true)
                bookMarkYellow()
            })
    }
    
}


function getMovieApi(array,display)
{
    for(let i = 0 ; i < array.length; i++)
    {
        fetch(`https://www.omdbapi.com/?apikey=d9137905&t=${array[i].Title}`)
            .then(res=>res.json())
            .then(data=>{
 
                display.innerHTML +=  renderHtmlMovie(data,true)
            })
    }
}

function getTrendingApi(array,display)
{
    for(let i = 0 ; i < array.length; i++)
    {
        fetch(`https://www.omdbapi.com/?apikey=d9137905&t=${array[i].Title}`)
            .then(res=>res.json())
            .then(data=>{
 
                display.innerHTML +=  renderHtmlMovie(data,false)
            })
    }
}


function renderHtmlMovie(data,isNotTrend){
    let imgClass = ""

    if(isNotTrend)
    {
        imgClass = "poster-img"
    }else{
        
        imgClass = "poster-img-trending"
        
    }
    
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