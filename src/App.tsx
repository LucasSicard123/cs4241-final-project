import {useEffect, useState} from 'react'
import './App.css'

function App() {
  //startWord
  const [startWord, setStartWord] = useState('')
  //word count
  const [wordCount, setWordCount] = useState(0);
  //score
  const [score, setScore] = useState(0);
  //timer
  const [seconds, setSeconds] = useState(10);
  //scoreboard
  const [scoreboard, setScoreboard] = useState([{name: "BigScore", score: 100}, {name: "MidScore", score: 10}, {name: "LowScore", score: 1}]);
  useEffect(() =>{
      const timer = setInterval(() => {
          setSeconds(prevSeconds => prevSeconds - 1)
      }, 1000)
      if(seconds ===0){
          clearInterval(timer)
      }
      return () => clearInterval(timer);
  }, [seconds]);

  // update the scoreboard with a new score
  // if the new score is not within top 5 scores, scoreboard will not change
  // may want to change to use current score and user rather than params
    const addScore = (newName:string, newScore:number) =>{
        for (var i=0; i<scoreboard.length; i++) {
            if (newScore > scoreboard[i].score) {
                let newScoreboard = scoreboard.slice(0, i).concat([{name: newName, score: newScore}]).concat(scoreboard.slice(i, 4))
                setScoreboard(newScoreboard)
                break
            }
        }
    }

  //word count increment
    const wordCountIncrement = () =>{
        setWordCount(wordCount + 1);
    }
    //
  const fetchStartWord = async () => {
      try {
          const response = await fetch('https://api.datamuse.com/words?sp=??????&max=1000'); // 获取所有单词
          const data = await response.json();
          // @ts-ignore
          const filteredWords = data.filter(startWord => startWord.word.length > 4  && !/\s/.test(startWord.word));
          const randomIndex = Math.floor(Math.random() * filteredWords.length);
          setStartWord(filteredWords[randomIndex].word);
      } catch (error) {
          console.error('Error fetching random word:', error);
      }
  }

  // map the scoreboard data to list items
  const arrayDataItems = scoreboard.map((s) => <li>{s.name}: {s.score}</li>);

  return (
    <>
        <div>
          {/* basic word count/time/score */}
            <div className="container">
                <div className="column">
                    <h1>Countdown Timer</h1>
                    <p>{seconds} seconds left</p>
                </div>
                <div className="column">
                    <h1>Word Counter</h1>
                    <p>{wordCount}</p>
                </div>
                <div className="column">
                    <h1>Score Counter</h1>
                    <p>Score: {score}</p>
                </div>
                <div className="column">
                    <h1>Scoreboard</h1>
                    <ul>{arrayDataItems}</ul>
                </div>

            </div>

          {/* Start Word */}
          <button onClick={fetchStartWord}>Start</button>
          {startWord && <p>Start Word: {startWord}</p>}
      </div>
    </>
  )
}

export default App
