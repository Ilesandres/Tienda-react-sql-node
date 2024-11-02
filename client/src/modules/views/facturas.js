import React,{useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const Facturas = () => {
    const [facturas, setFacturas] = useState([]);
    const [search, setSearch]=useState('');
    const [precioAsc, setPrecioAsc]=useState(false);
    const [precioDes, setPrecioDesc]=useState(false);
    const [limit, setLimit]=useState(0);
    const [maxLimit,setMaxLimit]=useState(0);

      
      const [back, setBack]=useState(false);
      const navigate=useNavigate();
    
      const loadFacturas=()=>{
          Axios.get('http://localhost:3001/getInvoice',{
            params:{
              search:search,
              precioAsc:precioAsc,
              precioDesc:precioDes,
              limit:limit,
            }
          }
          ).then((response)=>{
            setFacturas(response.data)
          })
      }

      const getinvoiceTotalMax=()=>{
          Axios.get('http://localhost:3001/getInvoiceMax').then((res)=>{
            setMaxLimit(res.data[0].maxInvoice);
            setLimit(res.data[0].maxInvoice)
          })
      }

      const deletefactura=(idFactura)=>{
        Axios.delete('http://localhost:3001/deleteInvoice',{
          data:{invoiceId:idFactura},
          
        }).then((response)=>{
          loadFacturas();
          alert(response.data)
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
      },[precioDes,precioAsc,limit])



      useEffect(()=>{
        loadFacturas();
        getinvoiceTotalMax();
      },[])


      
    
    return (
        <div className="container_facturas">
      {/* Filtros */}
      <div className="sidebar_facturas">



          <h2>rango de busqueda de facturas</h2>
        <div className="slider_facturas">
          <label>Precio</label>
          <input type="range" min="0" max={maxLimit} onChange={ ((e)=>{setLimit(e.target.value)})}  value={limit}/>
          <p>$0 - ${limit}</p>
        </div>
      </div>

      {/* Sección principal */}
      <div className="main-section_facturas">
        <div className="controls_facturas">
          <input type="search" className="search-bar_facturas" value={search} onChange={(e)=>{setSearch(e.target.value)}} placeholder="Buscar... por nit" />
          <div className="sort-buttons_facturas">
            <button onClick={()=>{navigate('/ventas')}}>New</button>
            <button type='button' color='blue' onClick={()=>{setPrecioDesc(false);setPrecioAsc(!precioAsc)}}>Precio ascendente</button>
            <button type='button' onClick={()=>{setPrecioAsc(false); setPrecioDesc(!precioDes)}}>Precio descendente</button>
            <button onClick={()=>{setBack(!back);}}>Volver</button>
          </div>
        </div>

        {/* Lista de factras */}
        <h2>Facturas</h2>
<div className="product-list_facturas">
  {facturas.length > 0 ? facturas.map((factura, index) => (
    <div key={factura.invoiceId} className="product-card_facturas">
      <h3>Factura #{index+1}</h3>
      <div className="product-image_facturas">
        <p><span>id factura:</span>{factura.invoiceUuid}</p>
        <p><span>Cliente:</span> {factura.name}</p>
        <p><span>NIT Cliente:</span> {factura.documentNumber}</p>
        <p><span>Productos:</span> {factura.productsNames}</p>
      </div>
      
      <div className="product-details_facturas">
        <label>Fecha de Creación</label>
        <input 
          type="datetime-local" 
          value={new Date(factura.createdAt).toISOString().slice(0, 16)} 
          readOnly
        />
      </div>

      <div className="total-section_facturas">
        <span>Total:</span>
        <span>${factura.total || 0}</span>
        <span><button type='button' title='eliminar' onClick={()=>{deletefactura(factura.invoiceId)}} ><img src="https://img.icons8.com/plasticine/100/filled-trash.png" alt="delete" /></button></span>
      </div>
      
    </div>
  )) : ''}
</div>
{facturas.length < 1 ? (
  <div className='product-card_error'>
    No se han encontrado facturas, por favor verifica los datos de búsqueda o agrega una nueva factura desde ventas.
  </div>
) : ''}

      </div>
    </div>
    );
};

export default Facturas;