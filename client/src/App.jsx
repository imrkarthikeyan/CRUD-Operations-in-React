import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"

function App() {

  const [users,setUsers]=useState([])
  const [filterUsers,setFilterUsers]=useState([])
  const [isModelOpen, setIsModelOpen]=useState(false)
  const [userData, setUserData]=useState({name:"",age:"",city:""})

  const getAllUsers=async()=>{
    await axios.get("http://localhost:8000/users").then((res)=>{
      setUsers(res.data)
      setFilterUsers(res.data)
    })
  }

  useEffect(()=>{
    getAllUsers()
  },[])

  //Search Function
  const handleSearchChange=(e)=>{
    const searchText=e.target.value.toLowerCase()
    const filteredUsers=users.filter((user)=>
      user.name.toLowerCase().includes(searchText)  || user.city.toLowerCase().includes(searchText)
    )
    setFilterUsers(filteredUsers)
  }

  //Delete Function
  const handleDelete=async(id)=>{
    const isConfirmed=window.confirm("Are you sure you want to delete this user?")
    if(isConfirmed){
      await axios.delete(`http://localhost:8000/users/${id}`).then((res)=>{
        setUsers(res.data)
        setFilterUsers(res.data)
      })
    }
  }

  //Add user Detail
  const handleAddRecord=()=>{
    setUserData({name:"",age:"",city:""})
    setIsModelOpen(true)
  }

  const handleData=(e)=>{
    setUserData({...userData,[e.target.name]:e.target.value})
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(userData.id){
      await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then((res)=>{
        console.log(res)
      })
    }
    else{
      await axios.post("http://localhost:8000/users",userData).then((res)=>{
        console.log(res)
      })
    }
    getAllUsers()
    setIsModelOpen(false)
    setUserData({name:"",age:"",city:""})
  }

  //Update user
  const handleUpdateRecord=(user)=>{
    setUserData(user)
    setIsModelOpen(true);
  }

  //Close Modal
  const closeModal=()=>{
    getAllUsers()
    setIsModelOpen(false)
  }

  return (
    <>
      <div className='container'>
        <h1>CRUD Application</h1>
        <div className="input-search">
          <input
            type='search'
            placeholder='Search text'
            onChange={handleSearchChange}
          />
          <button onClick={handleAddRecord} className='btn'>Add Record</button>
        </div>
        <table className='table-container'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filterUsers && filterUsers.map((user,index)=>{
              return(
              <tr key={user.id}>
                <td>{index+1}</td>
                <td>{user.name}</td>
                <td>{user.age}</td>
                <td>{user.city}</td>
                <td><button className='btn green' onClick={()=>handleUpdateRecord(user)}>Edit</button></td>
                <td><button onClick={()=>handleDelete(user.id)} className='btn red'>Delete</button></td>
              </tr>
              )
            })}
          </tbody>
        </table>
        {isModelOpen && (
          <div className="modal">
            <div className="modal-content">
              <span onClick={closeModal} className="close">&times;</span>
              <h2>User Record</h2>
              <div className="input-container">
                <label htmlFor='name'>Name : </label>
                <input type='text' name='name' id='name' value={userData.name} onChange={handleData}></input>
              </div>
              <div className="input-container">
                <label htmlFor='age'>Age : </label>
                <input type='number' name='age' id='age' value={userData.age} onChange={handleData}></input>
              </div>
              <div className="input-container">
                <label htmlFor='city'>City : </label>
                <input type='text' name='city' id='city' value={userData.city} onChange={handleData}></input>
              </div>
              <button className='btn green' onClick={handleSubmit}>Add User</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App