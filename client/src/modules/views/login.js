import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { Storecontext } from '../layout/userContext';
import { types } from '../layout/userReducer';

const LoginPage = () => {
    const [Store, dispatch]=useContext(Storecontext);
    const {user}=Store;
    const [userData, setuserData] = useState(null)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate =useNavigate();

    const handleLogin = (e) => {
        console.log('Logging in with:', { email, password });
        Axios.post('http://localhost:3001/verifyLogin',{
            user : email  ,
            password: password,
        }).then((res)=>{
            setuserData(res.data)
            dispatch({type:types.authLogin, payload: res.data})
            navigate('/homePage');
        }).catch((err)=>{
            alert(err.response.data);
        })
        //navigate('/homepage')

    };



    return (
        <div>
            
            
            <div style={styles.container}>
            <div style={styles.loginBox}>
                <h2 style={styles.title}>Login</h2>
                <form  style={styles.form}>
                    <label style={styles.label}>UserName</label>
                    <input type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <label style={styles.label}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="button" onClick={()=>{handleLogin();}} style={styles.button}>Log In</button>
                </form>
            </div>
        </div>
        </div>
        
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f3f4f6',
    },
    loginBox: {
        width: '300px',
        padding: '2rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        textAlign: 'center',
    },
    title: {
        fontSize: '1.5rem',
        marginBottom: '1rem',
        color: '#333333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
        color: '#555555',
    },
    input: {
        padding: '0.5rem',
        marginBottom: '1rem',
        border: '1px solid #cccccc',
        borderRadius: '4px',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        backgroundColor: '#007bff',
        color: '#ffffff',
        fontSize: '1rem',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default LoginPage;
