import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { getDoctorAppointments, getDoctorEarnings } from '../services/api';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const DoctorDashboard = () => {
  const { token } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, earnRes] = await Promise.all([
          getDoctorAppointments(token),
          getDoctorEarnings(token)
        ]);
        if (appRes.data.success) setAppointments(appRes.data.appointments);
        if (earnRes.data.success) setEarnings(earnRes.data.earnings);
      } catch {
        toast.error('Failed to load data');
      }
      setLoading(false);
    };
    if (token) fetchData();
  }, [token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.earning_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">${earnings}</p>
            <p className="text-gray-400">Earnings</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
          <img className="w-14" src={assets.appointments_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">{appointments.length}</p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Latest Bookings</p>
        </div>
        <div className="pt-4 border border-t-0">
          {appointments.slice(0, 5).map((item, index) => (
            <div className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100" key={index}>
              <img className="rounded-full w-10" src={item.userData?.image || assets.profile_pic} alt="" />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.userData?.name}</p>
                <p className="text-gray-600">Booking on {item.slotDate}</p>
              </div>
              <p className={`w-16 py-1 rounded-full text-xs text-center ${item.cancelled ? 'bg-red-500 text-white' : item.isCompleted ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                {item.cancelled ? 'Cancelled' : item.isCompleted ? 'Completed' : 'Pending'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
