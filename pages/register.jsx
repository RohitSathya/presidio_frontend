import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
export default function Register() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setpassword] = useState('');
    const [phone, setPhone] = useState('');
    const [usertype, setUsertype] = useState('');
    const navigate=useNavigate()

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        const re = /^[0-9\b]+$/;
        return re.test(phone) && phone.length === 10;
    };

    const handleRegister = async() => {
        if (!firstname || !lastname || !email || !phone || !usertype || !password) {
            toast.error('All fields are required!');
            return;
        }
        if (!validateEmail(email)) {
            toast.error('Invalid email format!');
            return;
        }
        if (!validatePhone(phone)) {
            toast.error('Phone number must be 10 digits!');
            return;
        }
        else{
           
            const response=await axios.post('https://presidio-backend-1.onrender.com/api/register',{firstname:firstname,lastname:lastname,email:email,password:password,phone:phone,usertype:usertype})
            const {message,ud}=response.data
            if(message=='User Created Succesfully'){
                toast.success('Registration Completed Successfully')
                navigate('/login')
            }
            else{
                toast.error('UserEmail Already Exists')
            }

        }
       
       
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header text-center bg-dark text-white">
                            <h4>Register</h4>
                        </div>
                        <div className="card-body">
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Firstname"
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Lastname"
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </div>
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
                            <div className="form-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="PhoneNo"
                                    value={phone}
                                    maxLength='10'
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <div className="form-group mb-4">
                                <select
                                    className="form-control"
                                    value={usertype}
                                    onChange={(e) => setUsertype(e.target.value)}
                                >
                                    <option value="" disabled>Select User Type</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="seller">Seller</option>
                                </select>
                            </div>
                            <button
                                className="btn btn-dark btn-block"
                                onClick={handleRegister}
                            >
                                Register
                            </button><br/>
                            <button style={{marginTop:'10px'}}
                                className="btn btn-dark btn-block"
                                onClick={()=>navigate('/login')}
                            >
                                Already Registered ? Login Here
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
