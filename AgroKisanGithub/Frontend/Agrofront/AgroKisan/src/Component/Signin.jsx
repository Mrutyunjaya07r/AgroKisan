import React,{useState} from 'react'
import { data, useNavigate } from 'react-router';

function Signin() {
    let navigate=useNavigate();
    let [username,setUsername]=useState("");
    let [password,setPassword]=useState("");

    let setDetails=async()=>{
         fetch("http://localhost:8080/signin",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                username:username,
                password:password,
            })
        })
       .then((res)=>res.json())
       .then((data)=>{
        console.log(data.token);
        console.log(data.userid)
        localStorage.setItem("AgroKisan",data.token);
        alert(`${username} signin successfully`)
        navigate('/')
       })
       .catch((err)=>{console.log(err)})
    }
  return (
    <div>
         <div className="container">
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">User Name</label>
    <input type="text" className="form-control" id="exampleInputEmail2" value={username} onChange={(e)=>{setUsername(e.target.value)}} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
 
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" className="form-control" id="exampleInputPassword4" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
  </div>
  <button type="submit" className="btn btn-primary" onClick={setDetails}>Submit</button>
        </div>
    </div>
  )
}

export default Signin