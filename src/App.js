import Result from "./Components/Result";
import { useEffect, useMemo,useState, useReducer } from "react";

const synth=window.speechSynthesis;

const wordReducer=(state,action)=>{
  if(action.type==='reset')
    return {word:'', meanings:[],
      phonetics:[]}
  return {word:action.actionWord, meanings:action.actionMeanings,
    phonetics:action.actionPhonetics
  }
}

function App() {
  const voices = useMemo(()=>synth.getVoices(),[])
  const [selectedVoice, setSelectedVoice] = useState("Microsoft David - English (United States)")
  const [text, setText] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [state, dispatch] = useReducer(wordReducer, {word:'', meanings:[], phonetics:[]})
  // const [meanings, setMeanings] = useState([])
  // const [phonetics, setPhonetics] = useState([])
  // const [word, setWord] = useState("")
  const [error, setError] = useState('')

  const dictionaryAPI=async (text)=>{
    let url = ` https://api.dictionaryapi.dev/api/v2/entries/en/${text}`
    try {
      const res= await fetch(url)
      const data=await res.json()
      console.log(data);
      dispatch({type: 'update',actionWord:data[0]?.word, actionMeanings: data[0]?.meanings,
        actionPhonetics: data[0]?.phonetics
      })
      // setMeanings(data[0]?.meanings)
      // setPhonetics(data[0]?.phonetics)
      // setWord(data[0]?.word)
      
    } catch (error) {
      setError(error)
    }
    
  }
  const reset=()=>{
    setIsSpeaking(false);
    dispatch({type:'reset'})
    setError('')
    // setMeanings([])
    // setPhonetics([])
    // setWord('')
  }

  useEffect(()=>{
    if(!text.trim()) return reset();
    const requestTimeout= setTimeout(() => {
       dictionaryAPI(text)
    }, 1000);

    return ()=>clearTimeout(requestTimeout)
  },[text])

  const startSpeech=(text)=>{
    const utterance=new SpeechSynthesisUtterance(text)
    const voice = voices.find(voice=>voice.name===selectedVoice)
   utterance.voice=voice;
    
    synth.speak(utterance)
  }
  const handleSpeech=()=>{
    if(!text.trim()) return;
    if(!synth.speaking){ //avoid repeating
      startSpeech(text)
      setIsSpeaking(true)
    }else{
      synth.cancel()
    }
    setInterval(() => {
      if(!synth.speaking){
        setIsSpeaking(false)
      }
    }, 100);
  }


  return (
    <div className="container">
      <h1>English Dictionary</h1>
      <form>
        <div className="row">
          <textarea name="" id="" cols={30} rows={4}
          placeholder='Enter Text' value={text} 
          onChange={e=>setText(e.target.value)}></textarea>
          <div className="voice-icons">
            <div className="select-voice">
              <select value={selectedVoice}
              onChange={e=>setSelectedVoice(e.target.value)}>
                {voices.map(voice=>(<option key={voice.name} value={voice.name}>{voice.name}</option>))}
              </select>
            </div>
            <i className={`fa-solid fa-volume-high ${isSpeaking? 'active' : ''}`}
            onClick={handleSpeech}/>
          </div>
        </div>
      </form>
      {
        (text.trim() !== '' && !error ) &&
        <Result word={state.word} phonetics={state.phonetics}
        meanings={state.meanings} setText={setText}/>
      }
    </div>
  );
}

export default App;
