
let currentsong = new Audio();
let  songs;
let currfolder

function secondsToMinutesAndSeconds(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


   
async function getsongs(folder){
  currfolder= folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response= await a.text();
    let div = document.createElement('div')
    div.innerHTML = response
    let as= div.getElementsByTagName("a")
    songs=[];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
          // console.log(element)
            songs.push(element.href.split(`/${folder}/`)[1])
        }  
    }
     //show all the songs in the playlist
     let  songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
     songUl.innerHTML=""
     for(const song of songs){
        songUl.innerHTML= songUl.innerHTML +`<li> 
               
        <img class="invert" src="music.svg" alt="">
             <div class="info">
              <div>${song.replaceAll("%20"," ")}</div>
              <div>Mohit</div>
            </div>
            <div class="playnow">
              
              <img class="" src="play.svg" alt="">
            </div>        
        </li>`;
     }

      //attach an event listner
      Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener('click',element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
      })
    
}


const playmusic=(track,pause=false)=>{
    currentsong.src=`/${currfolder}/` + track
    if(!pause){
      currentsong.play()
      play.src= "pause.svg"
    
    }
    document.querySelector(".songinfo").innerHTML= decodeURI(track)
    document.querySelector(".songtime").innerHTML= "00:00/00:00"






    
}
async function displayalbums(){
  // console.log("displayalbums")
  let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response= await a.text();
    // console.log(response)
    let div = document.createElement('div')
    div.innerHTML = response
    let ancors= div.getElementsByTagName("a")
   let cardcontainer= document.querySelector(".cardcontainer")
  let array=  Array.from(ancors)

    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    
    if(e.href.includes("/songs/")){
      let folder = e.href.split("/").slice(-2)[1]

      // get meta data of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json `)
      // let a = await fetch(`http://127.0.0.1:5500/songs/cs/info.json `)
    let response= await a.json();
    console.log(response)

    cardcontainer.innerHTML= cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card">
    <div class="play">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" 
      xmlns="http://www.w3.org/2000/svg">
        <path
          d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
          fill="#000" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>

    </div>
    <img src="/songs/${folder}/cover.jpeg" alt="" />
    <h2>${response.title}</h2>
    <p>${response.description}</p>
  </div> `
    }
   }
    // console.log(ancors)



    //  load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    // console.log(e)
    e.addEventListener("click",async item=>{
      songs= await getsongs(`songs/${item.currentTarget.dataset.folder}`);
      // item.dataset.folder
    })
  })
}


 async function main(){
   await getsongs("songs/cs");
     playmusic(songs[0],true)

    // display all the albums on the page 
        displayalbums()


      //attach play and next 
      play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src= "pause.svg"
        }
        else{
            currentsong.pause()
            play.src= "play.svg"
        }
      })

      //listen for time update event
      currentsong.addEventListener("timeupdate",()=>{
        // console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML=`${secondsToMinutesAndSeconds(currentsong.currentTime)}/${secondsToMinutesAndSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration) *100 + "%";
      })


      //add an event listner in seekbar 
      document.querySelector(".seekbar").addEventListener("click",e=>{
        percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left= percent + "%";
        currentsong.currentTime=((currentsong.duration)*percent)/100
      })

      // add eventlistner for ham,burger
      document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left= "0"
      })
      // add eventlistner for close
      document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left= "-150%"
      })
      
      // add eventlistner for previous
      previous.addEventListener("click",()=>{
        let index= songs.indexOf(   currentsong.src.split("/").slice(-1)[0])
     
        // console.log(songs,index)
        if((index-1)>= 0){
          playmusic(songs[index-1])

        }
      })
      // add eventlistner for  next
      next.addEventListener("click",()=>{
        let index= songs.indexOf(currentsong.src.split("/").slice(-1)[0])
     
        // console.log(songs,index)
        if((index+1)< songs.length){
          playmusic(songs[index+1])

        }
      })
        // add an event to volume
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
          // console.log(e.target.value)
          currentsong.volume= parseInt(e.target.value)/100
        })
          //  add event listner to miute the track 
          document.querySelector(".volume>img").addEventListener("click",(e)=>{
            console.log(e.target)
            if(e.target.src.includes("volume.svg")){
              e.target.src=  e.target.src.replace("volume.svg","mute.svg")
              currentsong.volume= 0
              document.querySelector(".range").getElementsByTagName("input")[0].value=0
            }
            else{
              e.target.src=e.target.src.replace("mute.svg","volume.svg"  )
              document.querySelector(".range").getElementsByTagName("input")[0].value=10
              
              currentsong.volume= .10
              // console.log(currentsong.volume)
            }
          })
 }    
 main()
