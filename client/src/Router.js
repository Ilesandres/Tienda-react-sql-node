import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Homepage from './modules/views/homepage';
import Clientes from './modules/views/clientes';
import Login from './modules/views/login';
import Productos from './modules/views/productos';
import Envios from './modules/views/envios';
import Facturas from './modules/views/facturas';
import Usuario from './modules/views/usuario';
import Ventas from './modules/views/ventas';
import Store from './modules/views/store';
import UserData from './modules/layout/userData';
import StoreProvider, { Storecontext } from './modules/layout/userContext';

const PrivateRoute = ({ element }) => {
    const [Store] = useContext(Storecontext);
    const { user } = Store;
    const navigate = useNavigate();

    useEffect(() => {
        if (user==null || !user.userName) {
            navigate('/');
        }
    }, [user, navigate]);

    return element;
};

const AppRouter = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/clientes' element={<PrivateRoute element={<Clientes />} />} />
            <Route path='/homePage' element={<PrivateRoute element={<Homepage />} />} />
            <Route path='/productos' element={<PrivateRoute element={<Productos />} />} />
            <Route path='/envios' element={<PrivateRoute element={<Envios />} />} />
            <Route path='/facturas' element={<PrivateRoute element={<Facturas />} />} />
            <Route path='/perfil' element={<PrivateRoute element={<Usuario />} />} />
            <Route path='/ventas' element={<PrivateRoute element={<Ventas />} />} />
            <Route path='/store' element={<PrivateRoute element={<Store />} />} />
        </Routes>
    );
};

export default AppRouter;
