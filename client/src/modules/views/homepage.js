import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import UserData from '../layout/userData';

const Homepage = () => {

    const [producto, setProducto]=useState(false);
    const [clientes, setClientes]=useState(false);
    const [envios, setCliente]=useState(false);
    const [facturas, setFacturas]=useState(false);
    const [perfil, setPerfil]=useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        if(producto){
            navigate('/productos');
        }
    },[producto, navigate]);

    useEffect(()=>{
      if(clientes){
        navigate('/clientes');
      }
    },[clientes,navigate]);
    
    useEffect(()=>{
      if(envios){
        navigate('/envios');
      }
    },[envios, navigate]);
    
    useEffect(()=>{
    if(facturas){
      navigate('/facturas');
    }
    },[facturas,navigate]);
    
    useEffect(()=>{
    if(perfil){
      navigate('/perfil');
    }
      
    },[perfil,navigate]);

    
    return (
        <div className="app-container">
          <UserData/>
        {/* Barra lateral */}
        <aside className="sidebar">
          <div className="sidebar-item">
            <button type='button' title='User' onClick={()=>{setPerfil(!perfil);}}>
                <img src='https://img.icons8.com/color/48/user.png'/>Usuario
            </button>
            </div>
            
            <div className="sidebar-item"onClick={()=>{navigate('/ventas');}}>
              <button type='button' title='ventas'>
                  <img src='https://img.icons8.com/fluency/48/shopping-cart.png'/>ventas
              </button>
            </div>
          <div className="sidebar-item">
            <button type='button' title='Bussisnes' onClick={()=>{navigate('/store')}}> 
                <img src='https://img.icons8.com/ios/50/company--v1.png'/>Empresa
            </button>
            </div>
          <div className="sidebar-item">
            <button type='button' title='ticket' onClick={()=>{setFacturas(!facturas);}}>
                <img src='https://img.icons8.com/ios/50/financial-tasks.png' />Facturas
            </button>
            </div>
          <div className="sidebar-item">
            <button type='button' title='clients' onClick={()=>{setClientes(!clientes);}}>
                <img src='https://img.icons8.com/ios/50/crowd.png'/>Clientes
            </button>
            </div>
        </aside>
        
        {/* Contenido principal */}
        <main className="main-content">
          {/* Encabezado */}
          <header className="header_home">
            <h1>Nuestros Productos</h1>
            <p>de Calidad</p>
            <div className="header-buttons">
              <button className="btn" title='delivery' onClick={()=>{setCliente(!clientes);}}><img src='https://img.icons8.com/ios/50/calendar-plus.png'/></button>
              <button className="btn" title='products' onClick={()=>{setProducto(!producto);}}><img src='https://img.icons8.com/ios/50/fast-moving-consumer-goods.png' /></button>
            </div>
          </header>
          
          {/* Filtros de Productos */}
          <div className="filter-section">
            <button className="filter-btn active">Label</button>
            <button className="filter-btn">Label</button>
          </div>
          
          {/* Tarjetas de Productos */}
          <section className="products-section">
            <div className="product-card">
              <div className="product-info">
                <h2>Productos</h2>
                <p>categorías, productos y stock. Actualiza, añade o deshabilita productos.</p>
              </div>
              <div className="product-rating">
                ⭐⭐⭐⭐⭐
                <span className="favorite-icon">❤️</span>
              </div>
            </div>
  
            <div className="product-card">
              <div className="product-info">
                <h2>Pedidos</h2>
                <p>Crea pedidos, modifícalos. Añade pedidos, modifícalos y verifica su estado.</p>
              </div>
              <div className="product-rating">
                ⭐⭐⭐⭐⭐
                <span className="favorite-icon">❤️</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    );



};

export default Homepage;
