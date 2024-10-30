import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const Facturas = () => {
    const [facturas, setFacturas] = useState([]);
    const [search, setSearch]=useState('');
      
      const [back, setBack]=useState(false);
      const navigate=useNavigate();
    
      const loadFacturas=()=>{
          Axios.get('http://localhost:3001/getInvoice',{
            params:{
              search:search
            }
          }
          ).then((response)=>{
            setFacturas(response.data)
          })
      }

      useEffect(()=>{
        if(back){
            navigate('/');
        }
      },[back,navigate]);

      useEffect(()=>{
        loadFacturas();
      },[search])

      useEffect(()=>{
        loadFacturas();
      },[])


      
    
    return (
        <div className="container_facturas">
      {/* Filtros */}
      <div className="sidebar_facturas">
        <h3>Categoría</h3>
        <div className="tags_facturas">
          <span className="tag_facturas">Spring</span>
          <span className="tag_facturas">Smart</span>
          <span className="tag_facturas">Modern</span>
        </div>

        <div className="checkboxes_facturas">
          <label><input type="checkbox" defaultChecked /> Comestibles</label>
          <label><input type="checkbox" defaultChecked /> Aseo</label>
          <label><input type="checkbox" defaultChecked /> Herramientas</label>
        </div>

        <div className="slider_facturas">
          <label>Precio</label>
          <input type="range" min="0" max="100" />
          <p>$0 - $100</p>
        </div>
      </div>

      {/* Sección principal */}
      <div className="main-section_facturas">
        <div className="controls_facturas">
          <input type="search" className="search-bar_facturas" value={search} onChange={(e)=>{setSearch(e.target.value)}} placeholder="Buscar... por nit" />
          <div className="sort-buttons_facturas">
            <button>New</button>
            <button>Precio ascendente</button>
            <button>Precio descendente</button>
            <button onClick={()=>{setBack(!back);}}>Volver</button>
          </div>
        </div>

        {/* Lista de factras */}
        <h2>Facturas</h2>
        <div className="product-list_facturas">
          {facturas.map((factura) => (
            <div key={factura.invoiceId} className="product-card_facturas">
              <div className="product-image_facturas" >
                
              </div>
              <p>{factura.name}</p>
              <p>${factura.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
};

export default Facturas;