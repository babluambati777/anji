import { createContext, useState, useEffect } from "react";
import { doctors } from "../assets/assets";
import { getDoctors } from "../services/api";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currencySymbol = '$';
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [role, setRole] = useState(localStorage.getItem('role') || '');
    const [doctorsList, setDoctorsList] = useState([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await getDoctors();
                if (data.success) {
                    setDoctorsList(data.doctors);
                }
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
            }
        };
        fetchDoctors();
    }, []);

    const value = {
        doctors: doctorsList.length > 0 ? doctorsList : doctors,
        currencySymbol,
        user,
        setUser,
        token,
        setToken,
        role,
        setRole,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
