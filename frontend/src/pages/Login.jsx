import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/Appcontext';
import { loginUser, registerUser } from '../services/api';


const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);

  const { setToken, setRole: setUserRole, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log('Form submitted with state:', state);
    console.log('Form data:', { name, email, password, role });
    try {
      if (state === 'Sign Up') {
        console.log('Attempting to register user');
        const { data } = await registerUser({ name, email, password, role });
        console.log('Register response:', data);
        if (data.success) {
          toast.success(data.message);
          setState('Login');
        } else {
          toast.error(data.message);
        }
      } else {
        console.log('Attempting to login user');
        const { data } = await loginUser({ email, password, role });
        console.log('Login response:', data);
        if (data.success) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('role', data.role);
          setToken(data.token);
          setUserRole(data.role);
          setUser(data.userData);
          toast.success('Login successful');
          if (data.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/');
          }
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('An error occurred');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>
        {state === 'Sign Up' && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        {state === 'Sign Up' && (
          <div className="w-full">
            <p>Role</p>
            <select
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              onChange={(e) => setRole(e.target.value)}
              value={role}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
          disabled={loading}
        >
          {loading ? 'Loading...' : state === 'Sign Up' ? 'Create account' : 'Login'}
        </button>
        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span
              onClick={() => setState('Login')}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span
              onClick={() => setState('Sign Up')}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
