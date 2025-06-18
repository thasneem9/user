import './styles/logincard.css';
import { useState } from 'react';
import api from '../utils/axiosInstance.jsx'
import { useSetRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom.js';
import { authScreenAtom } from '../atoms/authScreenAtom.js';


const LoginCard = () => {
  const setUser = useSetRecoilState(userAtom);
  const setScreen = useSetRecoilState(authScreenAtom);
  const [form, setForm] = useState({ username: '', password: '' });
  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
     const { data } = await api.post('/users/login', form, {
      withCredentials: true, 
     });

     localStorage.setItem('accessToken', data.accessToken);

    setUser({ username: form.username }); 

    alert("Login successful!");
  } catch (err) {
    console.error(err.response?.data || err);
    alert(err.response?.data?.message || 'Login failed');
  }
};


  return (
    <div className="card">
      <h2 className="mb-4">Log in</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
        />
        <button type="submit">Log in</button>
      </form>

      <p className="text-sm mt-3"> No account?
        <button
          className="underline"
          onClick={() => setScreen('signup')}
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginCard;
