const AudioPlayer = ({track}) => {
    const audioRef = React.useRef()
    React.useEffect( () => {
        if (track) {
            console.log(track)
            audioRef.current = new Audio(track.preview_url)
            audioRef.current.play()
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.remove()
            }
        }
    }, [track] );

    return
}
const genTracksArray = () => {
    return [
        DATA[Math.floor(Math.random() * DATA.length)].track,
        DATA[Math.floor(Math.random() * DATA.length)].track,
        DATA[Math.floor(Math.random() * DATA.length)].track
    ]
}
const TrackCard = ({track, onClick, color}) => (
    <div class="column is-one-third" onClick={onClick}>
        <div class="card" style={{background: color}}>
            <div class="card-image">
                <figure class="image is-128x128 m-auto">
                    <img src={track.album.images[0].url} alt="Album cover" />
                </figure>
            </div>
            <div class="card-content">
                <div class="content">
                    <p class="title is-4">{track.name}</p>
                    <p class="subtitle is-6">{track.artists[0].name}</p>
                    <p class="subtitle is-6">{track.album.name}</p>
                </div>
            </div>
        </div>
    </div>
)
const App = () => {
    const [tracks, setTracks] = React.useState([])

    const [randomTrackNumber, setRandomTrackNumber] = React.useState(Math.floor(Math.random() * tracks.length))
    const [gameState, setGameState] = React.useState("waitingGuess")
    const [score, setScore] = React.useState(0)
    const guessTrack = (track, index) => {
        if (gameState !== "waitingGuess") return
        if (index === randomTrackNumber) {
            setGameState("success")
            setScore(p => p+1)
        } else {
            setGameState("fail")
            setScore(0)
        }
    }
    const next = () => {
        setTracks(genTracksArray())
        setRandomTrackNumber(Math.floor(Math.random() * tracks.length))
        setGameState("waitingGuess")
    }
    if (!tracks.length) return (
        <section class="section">
            <div class="container">
                <h1 class="title">
                    Soundtrack Quizz
                </h1>
                <button class="button is-primary is-large" onClick={next}>Start</button>
            </div>
        </section>
    )
    return (
        <section class="section">
            <AudioPlayer track={tracks[randomTrackNumber]} />
            <div class="container">
                <h1 class="title">
                    Soundtrack Quizz
                </h1>
                <h2 class="subtitle">Score: {score}</h2>
                <div class="columns is-vcentered is-centered">
                    {tracks.map((t,i) => (<TrackCard track={t} onClick={() => guessTrack(t, i)} color={gameState === "waitingGuess" ? "" : (i !== randomTrackNumber ? "" : gameState === "success" ? "#effaf5" : "#feecf0")} />))}
                </div>
                {gameState === "success" && <div class="notification is-success is-light">
                    Congrats ! It was indeed <strong>{tracks[randomTrackNumber].name}.</strong> <a href={tracks[randomTrackNumber].external_urls.spotify} norel>Listen on spotify</a>
                </div>}
                {gameState === "fail" && <div class="notification is-danger is-light">
                    No :(, it was <strong>{tracks[randomTrackNumber].name}</strong>, <a href={tracks[randomTrackNumber].external_urls.spotify} norel>Listen on spotify</a>
                </div>}
                {gameState !== "waitingGuess" && <button class="button is-primary is-large" onClick={next}>Next</button>}
            </div>
        </section>

    )
}

const domContainer = document.getElementById('root');
ReactDOM.render(<App />, domContainer);
