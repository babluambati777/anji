import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { updateDoctorProfile } from '../services/api';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const MyProfile = () => {
  const { user, setUser, token, role } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // For patients
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // For doctors
  const [speciality, setSpeciality] = useState('');
  const [degree, setDegree] = useState('');
  const [experience, setExperience] = useState('');
  const [about, setAbout] = useState('');
  const [fees, setFees] = useState('');
  const [address, setAddress] = useState({ line1: '', line2: '' });
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setSpeciality(user.speciality || '');
      setDegree(user.degree || '');
      setExperience(user.experience || '');
      setAbout(user.about || '');
      setFees(user.fees || '');
      setAddress(user.address || { line1: '', line2: '' });
      setAvailable(user.available !== false);
    }
  }, [user]);

  const updateUserProfileData = async () => {
    setLoading(true);
    try {
      const updateData = role === 'doctor'
        ? { docId: user._id, speciality, degree, experience, about, fees, address, available }
        : { name, email };
      const { data } = await updateDoctorProfile(updateData, token);
      if (data.success) {
        toast.success('Profile updated');
        setUser({ ...user, ...updateData });
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      {role === 'patient' ? (
        <>
          <img className="w-36 rounded" src={assets.profile_pic} alt="" />
          {isEdit ? (
            <input
              className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="font-medium text-3xl text-neutral-800 mt-4">{name}</p>
          )}
          <hr className="bg-zinc-400 h-[1px] border-none" />
          <div>
            <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
            <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
              <p className="font-medium">Email id:</p>
              {isEdit ? (
                <input
                  className="bg-gray-100 max-w-52"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <p className="text-blue-400">{email}</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <img className="w-36 rounded" src={user?.image || assets.doc1} alt="" />
          {isEdit ? (
            <input
              className="bg-gray-50 text-3xl font-medium max-w-60 mt-4"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          ) : (
            <p className="font-medium text-3xl text-neutral-800 mt-4">{name}</p>
          )}
          <hr className="bg-zinc-400 h-[1px] border-none" />
          <div>
            <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
            <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
              <p className="font-medium">Email id:</p>
              <p className="text-blue-400">{email}</p>
              <p className="font-medium">Speciality:</p>
              {isEdit ? (
                <input
                  className="bg-gray-100 max-w-52"
                  type="text"
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                />
              ) : (
                <p>{speciality}</p>
              )}
              <p className="font-medium">Degree:</p>
              {isEdit ? (
                <input
                  className="bg-gray-100 max-w-52"
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                />
              ) : (
                <p>{degree}</p>
              )}
              <p className="font-medium">Experience:</p>
              {isEdit ? (
                <input
                  className="bg-gray-100 max-w-52"
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              ) : (
                <p>{experience}</p>
              )}
              <p className="font-medium">Fees:</p>
              {isEdit ? (
                <input
                  className="bg-gray-100 max-w-52"
                  type="text"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                />
              ) : (
                <p>{fees}</p>
              )}
              <p className="font-medium">Available:</p>
              {isEdit ? (
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e) => setAvailable(e.target.checked)}
                />
              ) : (
                <p>{available ? 'Yes' : 'No'}</p>
              )}
            </div>
          </div>
          <div>
            <p className="text-neutral-500 underline mt-3">ABOUT DOCTOR</p>
            {isEdit ? (
              <textarea
                className="w-full bg-gray-100"
                rows={5}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            ) : (
              <p className="text-gray-600 max-w-[700px] mt-1">{about}</p>
            )}
          </div>
        </>
      )}
      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save information'}
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
