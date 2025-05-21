import React,{useState} from 'react'
import { useNavigate } from 'react-router';

function Signup() {
    let navigate=useNavigate();
    let [email,setEmail]=useState("");
    let [password,setPassword]=useState("");
    let [username,setUsername]=useState("");
    let [city,setCity]=useState("");

    let setDetails=async()=>{
        let result=await fetch("http://localhost:8080/signup",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                email:email,
                password:password,
                username:username,
                city:city
            })
        })
        result=await result.json();
        alert(`${username} Registered successfully`);
        navigate('/signin')
        console.log(result);
    }

  return (
    <div>
        <div className="container">
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input type="email" className="form-control" id="exampleInputEmail2" value={email} onChange={(e)=>{setEmail(e.target.value)}} aria-describedby="emailHelp"/>
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">UserName</label>
    <input type="text" className="form-control" id="exampleInputEmail3" value={username} onChange={(e)=>{setUsername(e.target.value)}} aria-describedby="emailHelp"/>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input type="password" className="form-control" id="exampleInputPassword4" value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">City</label>
    <input type="text" className="form-control" placeholder='Enter your city' value={city} onChange={(e)=>{setCity(e.target.value)}} id="exampleInputEmail5" aria-describedby="emailHelp"/>
  </div>
  <button type="submit" className="btn btn-primary" onClick={setDetails}>Submit</button>
        </div>
    </div>
  )
}

export default Signup