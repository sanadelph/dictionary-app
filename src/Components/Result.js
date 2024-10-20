
const Result = ({word,phonetics,meanings,setText}) => {
  return (
      <ul>
        <li className='word'>
            <h2>{word}</h2>
            {phonetics?.map((phonetic, i)=>(<span key={i}>{phonetic.text}</span>))}
        </li>
        {
            meanings?.map((meaning,i)=>(
            <li className='contain' key={i}>
                <h3 key={i}>{meaning?.partOfSpeech}</h3>
                <div className='details details-meaning'>
                    <h3>Meaning</h3>
                    {
                        meaning?.definitions?.map((definition,i)=>(
                            <p key={i}>- {definition?.definition}</p>
                        ))
                    }
                </div>
                {
                    meaning?.synonyms.length !== 0 &&
                    <div className='details details-synonyms'>
                        <h3>Synonyms</h3>
                        {
                            meaning.synonyms.map((syn,i)=>(
                                <span key={i}
                                onClick={()=>setText(syn)}>
                                    {`${syn}, `}
                                </span>
                            ))
                        }
                    </div>
                }
            </li>
            ))
       
        }
    </ul>
  )
}

export default Result