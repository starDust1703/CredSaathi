"use client";
import { useState } from 'react'

const signup = () => {
    const [showPass, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (btn) => {
        console.log(email, password);
        setEmail('');
        setPassword('');
        btn.disabled = true;
    }
    return (
        <div className='flex flex-col justify-center items-center h-screen gap-6 '>
            <div className='bg-zinc-800 flex flex-col justify-center items-center p-4 rounded-2xl gap-4'>
                <h1 className='font-semibold text-3xl'>Cred Saathi</h1>
                <h2 className='text-3xl'>Sign Up</h2>

                <input
                    id='name'
                    value={name}
                    placeholder='Name'
                    onChange={e => setName(e.target.value)}
                    className='w-[340px] border border-gray-300 rounded-4xl p-4 outline-none' />

                <input
                    id='email'
                    type="email"
                    value={email}
                    placeholder='Email address'
                    onChange={e => setEmail(e.target.value)}
                    className='w-[340px] border border-gray-300 rounded-4xl p-4 outline-none' />

                <div id='passBox' className='flex items-center w-[340px] border border-gray-300 rounded-4xl'>
                    <input
                        id='pass'
                        type={showPass ? "text" : "password"}
                        value={password}
                        className='w-1/1 p-4 border-0 outline-none'
                        placeholder='Password'
                        onChange={e => setPassword(e.target.value)} />

                    <div className='flex items-center justify-center cursor-pointer border-gray-300 h-full mr-1' onClick={() => setShowPassword(!showPass)}>
                        {(showPass) ? <img src='eyeOff.svg' className='size-12 p-2 invert' /> : <img src='eyeOn.svg' className='size-12 p-2 invert' onClick={() => setShowPassword(!showPass)} />}
                    </div>

                </div>
                <button className='w-[340px] p-4 bg-gray-950 text-white cursor-pointer rounded-4xl' onClick={(e) => handleSubmit(e.target)}>Continue</button>
            </div>
        </div>
    )
}

export default signup
