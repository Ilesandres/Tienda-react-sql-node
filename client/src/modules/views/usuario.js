import React,{useState,useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext, { Storecontext, UserProvider } from '../layout/userContext';
import { types } from '../layout/userReducer';

const Usuario = () => {
  
    const [Store, dispatch]=useContext(Storecontext);
    const {user}=Store;
   const [userLog,setUserLog]=useState(user? user.userName : '')
    const [hora, setHora] = useState(20);
    const [minuto, setMinuto] = useState(0);
    const [amPm, setAmPm]=useState('Am');
    const [formData, setFormData] = useState({
      nombre: userLog || '',
      usuario: 'username',
      email: 'email@gmail.com',
      descripcion: 'Value'
    });
    
    useEffect(() => {
        const interval = setInterval(() => {
          const now = new Date();
          let currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          const isAm = currentHour < 12;
    
          setHora(currentHour % 12 || 12);  // Convierte de formato 24h a 12h
          setMinuto(currentMinute);
          setAmPm(isAm ? 'AM' : 'PM');  // Define AM o PM
        }, 1000);  // Actualiza cada segundo
    
        return () => clearInterval(interval);  // Limpia el intervalo cuando el componente se desmonta
      }, []);
      
      
    
    const navigate=useNavigate();
    const [back, setBack]=useState(false);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };

      
      useEffect(()=>{
        if(back){
            navigate('/homePage');
        }
      },[back,navigate]);
    
    
    return (
        <div className="container_user">
        <a className="back_link_user" onClick={()=>{setBack(!back);}}>Atrás</a>
        <a className='log-out_user' onClick={()=>{dispatch({type :types.authLogout})}}>logout</a>
  
        <div className="profile_section_user">
          {/* Icono de usuario */}
          <div className="user_icon_user">
            <div className="icon_circle_user"></div>
          </div>
  
          {/* Selector de hora */}
          <div className="time_picker_user">
            <label>Enter time</label>
            <div className="time_picker_inputs_user">
              <input
              disabled
                type="number"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="hour_input_user"
                min="1"
                max="12"
              />
              :
              <input
                type="number" 
                disabled
                value={minuto}
                onChange={(e) => setMinuto(e.target.value)}
                className="minute_input_user"
                min={0}
                max={59}
              />
              <div className="am_pm_user">
                <button className={`btn_am_user ${amPm === 'AM' ? 'active' : ''}`} onClick={() => setAmPm('AM')}>AM</button>
                <button className={`btn_pm_user ${amPm === 'PM' ? 'active' : ''}`} onClick={() => setAmPm('PM')}>PM</button>
              </div>
            </div>
            <div className="time_picker_actions_user">
              <button className="cancel_btn_user">Cancel</button>
              <button className="ok_btn_user">OK</button>
            </div>
          </div>
  
          {/* Formulario de perfil */}
          <div className="profile_form_user">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="input_user"
            />
  
            <label>Usuario</label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              className="input_user"
            />
  
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="input_user"
            />
  
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="textarea_user"
            ></textarea>
  
            <button className="edit_btn_user">Editar</button>
          </div>
        </div>
      </div>
    );
};

export default Usuario;
