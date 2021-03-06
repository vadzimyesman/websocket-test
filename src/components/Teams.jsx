import axios from 'axios'
import React, { useEffect, useState } from 'react'
import KillGame from './KillGame'
import CardsSet from './CardsSet'
import { w3cwebsocket as W3CWebSocket } from "websocket";
const  HOST = window.location.origin.replace(/^http/, 'ws')
const client = new W3CWebSocket(HOST);

function Teams(props) {

    const [redSpy, setRedSpy]=useState("")
    const [blueSpy, setBlueSpy]=useState("")
    const [redAgents, setRedAgents]=useState([])
    const [blueAgents, setBlueAgents]=useState([])

    const [display1, setDisplay1]=useState(true)
    const [display2, setDisplay2]=useState(true)
    const [display3, setDisplay3]=useState(true)
    const [spyStatus, setSpystatus]=useState(false)
    

    useEffect(()=>{
        axios.get(`/api/showTeams`)
        .then(res=>{
            console.log(res.data)
            setRedSpy(res.data.redSpy)
            setBlueSpy(res.data.blueSpy)
            setRedAgents(res.data.redAgents)
            setBlueAgents(res.data.blueAgents)
            console.log(redSpy,blueSpy)
            if (res.data.allPlayers.includes(props.nickname)){
                setDisplay1(false)
            } 
            if (res.data.redSpy){
                setDisplay2(false)
            }
            if (res.data.blueSpy){
                setDisplay3(false)
            }
            if (res.data.blueSpy.includes(props.nickname)||res.data.redSpy.includes(props.nickname)){
                setSpystatus(true)
            }
            
        })
        .catch(err=>console.log(err))
      },[])


      useEffect(()=>{
        console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR")
        client.onopen = () =>{
            console.log('WebSocket Client Connected');
        }
        client.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            console.log('got reply! ', dataFromServer);
            if (dataFromServer.msg==="New player joined!") {
                axios.get(`/api/showTeams`)
                .then(res=>{
                    console.log(res.data)
                    setRedSpy(res.data.redSpy)
                    setBlueSpy(res.data.blueSpy)
                    setRedAgents(res.data.redAgents)
                    setBlueAgents(res.data.blueAgents)
                })
                .catch(err=>console.log(err))

            }
            
          };
    },[])
   
   

    const addRedSpy=()=>{
        client.send(JSON.stringify({
            type: "update",
            msg: "New player joined!",
            user: props.nickname
          }));
        setSpystatus(true)
        const body ={
            nickname:props.nickname
        }
        axios.post(`/api/redSpy`,body)
        .then(res=>{
            console.log(res.data)
            setRedSpy(res.data.redSpy)
            setBlueSpy(res.data.blueSpy)
            setRedAgents(res.data.redAgents)
            setBlueAgents(res.data.blueAgents)
            setDisplay1(false)
        })
        .catch(err=>console.log(err))
        client.send(JSON.stringify({
            newPlayer:true
        }))
    }

    const addBlueSpy=()=>{
        client.send(JSON.stringify({
            type: "update",
            msg: "New player joined!",
            user: props.nickname
          }));
        setSpystatus(true)
        const body = {
            nickname:props.nickname
        }
        axios.post(`/api/blueSpy`,body)
        .then(res=>{
            console.log(res.data)
            setRedSpy(res.data.redSpy)
            setBlueSpy(res.data.blueSpy)
            setRedAgents(res.data.redAgents)
            setBlueAgents(res.data.blueAgents)
            setDisplay1(false)
        })
        .catch(err=>console.log(err))
    }

    const addRedAgent=()=>{
        client.send(JSON.stringify({
            type: "update",
            msg: "New player joined!",
            user: props.nickname
          }));
        const body ={
            nickname:props.nickname
        }
        axios.post(`/api/redAgent`,body)
        .then(res=>{
            console.log(res.data)
            setRedSpy(res.data.redSpy)
            setBlueSpy(res.data.blueSpy)
            setRedAgents(res.data.redAgents)
            setBlueAgents(res.data.blueAgents)
            setDisplay1(false)
        })
        .catch(err=>console.log(err))
    }

    const addBlueAgent=()=>{
        client.send(JSON.stringify({
            type: "update",
            msg: "New player joined!",
            user: props.nickname
          }));
        const body ={
            nickname:props.nickname
        }
        axios.post(`/api/blueAgent`,body)
        .then(res=>{
            console.log(res.data)
            setRedSpy(res.data.redSpy)
            setBlueSpy(res.data.blueSpy)
            setRedAgents(res.data.redAgents)
            setBlueAgents(res.data.blueAgents)
            setDisplay1(false)
        })
        .catch(err=>console.log(err))
    }

  return (
    <div className="gameField">
        <div className='gameTopDiv'>
        
        <div className='redTeam'>
            <h3 style={{color:"white"}}> Spy: {redSpy}</h3>
            
            <h3 style={{color:"white"}}>Agents:{redAgents}</h3>
            {display1 &&<div className='roleButtons'>
                {display2 &&<button
                className='roleButtons'
                onClick={addRedSpy}
                >Join as a spy</button>}
                <button
                onClick={addRedAgent}
                className='roleButtons'
                >Join as an agent</button>
            </div>}
        </div>
        <div className='topCenter'>
            <h1>Admin is {props.admin}</h1>
            {props.nickname === props.admin &&
            <KillGame />
            }
            
        </div>
        <div className='blueTeam'>
            <h3 style={{color:"white"}}>Spy: {blueSpy}</h3>
            <h3 style={{color:"white"}}>Agents: {blueAgents}</h3>
            {display1 &&<div >
                {display3 && < button
                className='roleButtons'
                onClick={addBlueSpy}
                >Join as a spy</button>}
                <button
                className='roleButtons'
                onClick={addBlueAgent}
                >Join as an agent</button>
            </div>}
        </div>
    </div>
    {!display1 && <CardsSet nickname={props.nickname} admin={props.admin} spyStatus={spyStatus}/>}
    </div>
    

  )
}

export default Teams
