import { useState } from "react";
import { register } from "../api/auth.api";
import GoogleButton from "./GoogleButton";


export default function RegisterModal({ onClose }) {

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async () => {
    try {
      await register(form);
      alert('Check your email to verify account.');
      onClose();
      alert('Registration successfully');
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className="fixed inset-0 bg-mybg/50 flex justify-center items-center z-50">
      <div className="bg-mylight p-6 rounded-xl w-100 relative flex flex-col items-center">
        <h2 className="text-xl font-bold mb-10 text-mybg">Create account</h2>

        <input name="username" onChange={handleChange} className="border p-2 w-full mb-2 border-mybg text-mybg rounded" placeholder="Username" />
        <input name="email" onChange={handleChange} className="border p-2 w-full mb-2 border-mybg text-mybg rounded" placeholder="Email" />
        <input name="password" onChange={handleChange} className="border p-2 w-full mb-4 border-mybg text-mybg rounded" type="password" placeholder="Password" />

        <button onClick={handleSubmit} className="bg-mybg text-mylight w-full py-3 rounded mb-5 flex items-center justify-center gap-2 cursor-pointer hover:bg-mybg2 duration-200">
          <img className="w-5" src="/icons/login.png" alt="login_img" />
          Register
        </button>

        <div className="w-full h-0.5 bg-mybg mb-5 rounded-2xl"></div>

        <GoogleButton/>

        <img onClick={onClose} className="absolute top-3 right-3 w-4 cursor-pointer hover:scale-105 duration-200" src="/icons/close.png" alt="close_icon" />

      </div>
    </div>
  );
}