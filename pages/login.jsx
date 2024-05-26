import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function login() {
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const navigate=useNavigate()

    async function handleLogin(){
        if ( !email || !password) {
            toast.error('All fields are required!')
        }
        else{
            const response=await axios.post('https://presidio-backend-1.onrender.com/api/login',{email:email,password:password})
            const {message,ud}=response.data
            if(message=='Login Failed'){
                toast.error('Login Failed')
            }
            else{
                toast.success('Login Successful')
                localStorage.setItem('UserDetail',JSON.stringify(ud))
                const uds=localStorage.getItem('UserDetail')
                const parse=JSON.parse(uds)
                if(parse.usertype=='seller'){
                    console.log(1)
                    navigate('/homeseller')
                }
                else{
                    console.log(123)
                    navigate('/homebuyer')

                }
             
            }
        }
    }
  return (
    <>
     <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center bg-dark text-white">
                            <h4>Login</h4>
                        </div>
                        <div className="card-body">
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setpassword(e.target.value)}
                                />
                            </div>
                        
                            <button
                                className="btn btn-dark btn-block"
                                onClick={handleLogin}
                            >
                                Login
                            </button><br/>
                            <button style={{marginTop:'10px'}}
                                className="btn btn-dark btn-block"
                                onClick={()=>navigate('/')}
                            >
                                New User ? Register Here
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    </>
  )
}
