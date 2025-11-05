import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { cancelAppointment, getDoctorAppointments, getDoctorEarnings, getUserAppointments } from '../services/api';

const MyAppointments = () => {
  const { token, role } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      console.log('Fetching appointments for role:', role, 'token:', token);
      try {
        if (role === 'patient') {
          console.log('Fetching patient appointments');
          const { data } = await getUserAppointments(token);
          console.log('Patient appointments response:', data);
          if (data.success) {
            setAppointments(data.appointments);
            console.log('Set appointments:', data.appointments);
          } else {
            console.log('Failed to fetch appointments:', data.message);
          }
        } else if (role === 'doctor') {
          console.log('Fetching doctor appointments');
          const { data } = await getDoctorAppointments(token);
          console.log('Doctor appointments response:', data);
          if (data.success) setAppointments(data.appointments);
          const earningsData = await getDoctorEarnings(token);
          if (earningsData.data.success) setEarnings(earningsData.data.earnings);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
      }
      setLoading(false);
    };
    if (token) fetchAppointments();
  }, [token, role]);

  const cancelApp = async (appointmentId) => {
    try {
      const { data } = await cancelAppointment({ appointmentId }, token);
      if (data.success) {
        toast.success('Appointment cancelled');
        setAppointments(appointments.map(app => app._id === appointmentId ? { ...app, cancelled: true } : app));
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Cancellation failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        {role === 'patient' ? 'My Appointments' : 'My Appointments & Earnings'}
      </p>
      {role === 'doctor' && (
        <div className="mt-4">
          <p className="text-lg font-semibold">Total Earnings: ${earnings}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {appointments.map((item, index) => (
          <div key={index} className="border border-zinc-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <img className="w-12 rounded-full" src={item.docData?.image || assets.doc1} alt="" />
              <div>
                <p className="font-semibold">{item.docData?.name}</p>
                <p className="text-sm text-zinc-600">{item.docData?.speciality}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-sm">Date: {item.slotDate}</p>
              <p className="text-sm">Time: {item.slotTime}</p>
              <p className="text-sm">Amount: ${item.amount}</p>
              <p className={`text-sm ${item.cancelled ? 'text-red-500' : item.isCompleted ? 'text-green-500' : 'text-blue-500'}`}>
                {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Pending'}
              </p>
            </div>
            {role === 'patient' && !item.cancelled && !item.isCompleted && (
              <button
                onClick={() => cancelApp(item._id)}
                className="mt-3 bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
