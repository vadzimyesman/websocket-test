
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import CardWithWord from './CardWithWord'


function CardsSet(props) {


    const [randomWords, setRandomWords]=useState([])
    const [blue, setBlue] = useState([])
    const [red, setRed] = useState([])
    const [grey,setGrey] = useState([])
    const [black, setBlack] = useState("")
    

    useEffect(()=>{
      axios.get(`/api/showCards`)
      .then(res=>{
        console.log(res.data)
        setRandomWords(res.data.words)
        setBlue(res.data.blue)
        setRed(res.data.red)
        setGrey(res.data.grey)
        setBlack(res.data.black)
      })

    },[])

    const handleClick1 = () =>{

        axios.get(`https://random-word-api.herokuapp.com/word?number=25`)
        .then(res=>{
          console.log(res.data)
          setRandomWords(res.data)
              axios.post(`/api/newWords`,res.data )
              .then(res=>{
                console.log(res.data)
                setBlue(res.data.blue)
                setRed(res.data.red)
                setGrey(res.data.grey)
                setBlack(res.data.black)
              })
              .catch(err=>console.log(err))
        })
      }


  return (
      <>
    {props.nickname===props.admin &&<div>
        <button
        onClick={handleClick1}
        >Get random words</button>
    </div>}
    <div className='divWithCards'>
        {randomWords.map((element,index)=>{

            if(red.includes(index)){
              return < CardWithWord key={index} randomWord={element} color={"red"}/>
            } 
            if(blue.includes(index)){
              return < CardWithWord key={index} randomWord={element} color={"blue"}/>
            } 
            if(grey.includes(index)){
              return < CardWithWord key={index} randomWord={element} color={"grey"}/>
            } 
            if(black===index){
              return < CardWithWord key={index} randomWord={element} color={"black"}/>
            } 
        
        })}
    </div>
      </>

  )
}

export default CardsSet

