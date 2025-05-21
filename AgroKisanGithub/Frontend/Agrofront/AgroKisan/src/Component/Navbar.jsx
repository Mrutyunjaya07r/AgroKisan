import React from 'react'
import { Link ,useNavigate } from 'react-router'

function Navbar() {
  let navigate=useNavigate();
  function logout(){
    localStorage.removeItem('AgroKisan');
    navigate('/signin')
  }
  return (
    <div>
       <header> <div className="px-3 py-2 text-bg-dark border-bottom"> <div className="container"> <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"> <Link to="/" className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none"> <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkto="#bootstrap"></use></svg> </Link> <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small"> <li> <Link to="#" className="nav-link text-secondary"> <svg className="bi d-block mx-auto mb-1" width="24" height="24" aria-hidden="true"><use xlinkto="#home"></use></svg>
Home
</Link> </li> <li> <Link to="#" className="nav-link text-white"> <svg className="bi d-block mx-auto mb-1" width="24" height="24" aria-hidden="true"><use xlinkto="#speedometer2"></use></svg>
Dashboard
</Link> </li> <li> <Link to="#" className="nav-link text-white"> <svg className="bi d-block mx-auto mb-1" width="24" height="24" aria-hidden="true"><use xlinkto="#table"></use></svg>
Orders
</Link> </li> <li> <Link to="#" className="nav-link text-white"> <svg className="bi d-block mx-auto mb-1" width="24" height="24" aria-hidden="true"><use xlinkto="#grid"></use></svg>
Products
</Link> </li> <li> <Link to="#" className="nav-link text-white"> <svg className="bi d-block mx-auto mb-1" width="24" height="24" aria-hidden="true"><use xlinkto="#people-circle"></use></svg>
Customers
</Link> </li> </ul> </div> </div> </div> <div className="px-3 py-2 border-bottom mb-3"> <div className="container d-flex flex-wrap justify-content-center"> <form className="col-12 col-lg-auto mb-2 mb-lg-0 me-lg-auto" role="search"> <input type="search" className="form-control" placeholder="Search..." aria-label="Search"/> </form> <div className="text-end">{
  localStorage.getItem('AgroKisan') ? <button className='btn btn-danger' onClick={()=>{logout()}}>Logout</button>  : <div style={{display:"flex",margin:"10px"}}>
<button type="button" className="btn btn-light text-dark me-2"><Link to='/signin' style={{color:"black",textDecoration:"none"}}>Signin</Link></button> <button type="button" className="btn btn-primary"><Link to='/signup' style={{color:"white",textDecoration:"none"}}>Signup</Link></button>
  </div> 
  }  </div> </div> </div> </header>
    </div>
  )
}

export default Navbar