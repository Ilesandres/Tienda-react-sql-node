import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Axios  from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css'

const Store = () => {
    const navigate=useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    /*default */
    const [searchClient, setSearchClient]=useState('');
    const [editando, setEditando]=useState(false);
    const [clientesCargados, setClientesCargados]=useState([]);
    const [tiposnit, setTiposNit]=useState([]);
        /*modales */
     const [modalAgregarUser , setAgregaruser]=useState(false);
     const [modalAgregarTipoNit , setAgregarTipoNit]=useState(false);  
     
     /*agregar tipoNit */
     const [nombreAgregarTipoNit, setAgregarTipoNitNombre]=useState('');
     /*agregar usuario */
     const [nombreCliente, setNombreCliente]=useState('');
     const [apellidoCliente, setApellidoCliente]=useState('');
     const [direccionCliente, setDireccionCliente]=useState('');
     const [nitCliente,setNitCliente]=useState('');
     const [tipoNitCliente,setTiponitCliente]=useState(0);
     const [telefonoCliente,setTelefonoCliente]=useState(0);
     const [usuario, setusuario]=useState('');
     const [password, setPassword]=useState('');
     const [rol, setRol]=useState(2)
     /*modificar cliente */
     const [clienteEditar, setClienteEditar]=useState([]);
     const [idClienteEditar, setIdClientEditar]=useState();

     //storeInfo
     const [storeinfo, setStoreInfo]=useState(null);
     const [storeName, setStoreName]=useState('');
     const [storeDescription, setStoreDescription]=useState('');

     const loadStoreInfo=()=>{
      Axios.get('http://localhost:3001/storeInfo',{
        params:{idStore:1}
      }).then((response)=>{
        setStoreInfo(response.data[0]);
      }).catch((err)=>{
        alert('error comunicate con soporte tecnico')
      })
     }
    
     const modifyProduct=()=>{
      if(nombreCliente !== '' && nitCliente !== '' && tipoNitCliente !== '' && 
        nombreCliente !== 0 && nitCliente !== 0 && tipoNitCliente !== 0){
        Axios.put('http://localhost:3001/updateClient',{
          nombre:nombreCliente,
          apellido:apellidoCliente,
          direccion:direccionCliente,
          telefono:telefonoCliente,
          nit:nitCliente,
          tipoNit:tipoNitCliente,
          idCliente:idClienteEditar
        }).then(()=>{
          alert('cliente editado con exito')
          loadClient();
          setAgregaruser(false);
        })
      }
        
     }
  

     const addClient=()=>{

        if (typeof usuario === 'undefined' || usuario.trim() === '') {
            alert('Error: El campo de usuario está vacío o es indefinido');
            return;
        }
        
        if (typeof password === 'undefined' || password.trim() === '') {
            alert('Error: El campo de contraseña está vacío o es indefinido');
            return;
        }
      if(nombreCliente!=='' && telefonoCliente!=='' && tipoNitCliente!==0 && nitCliente!=='' ){
          Axios.post('http://localhost:3001/addCliente',{
          nombre:nombreCliente,
          apellido:apellidoCliente,
          direccion:direccionCliente,
          nitCliente:nitCliente,
          tipoNit:tipoNitCliente,
          telefono:telefonoCliente,
          username:usuario,
          password:password,
          rol:rol
        }).then(()=>{
          alert('cliente agregado con exito');
          loadClient();
          setAgregaruser(false);
        }).catch((err)=>{
          alert(err.response.data)
        })
      }else{
        alert('verifica los datos ingresados, no pueden estar vacios')
      }
      
     }

     const saveProduct=()=>{
      if(!editando){
        addClient();
      }else{
        modifyProduct();
      }
     }

    const loadClient=()=>{
      Axios.get('http://localhost:3001/getClients',{
        params:{ search: searchClient}
      }).then((response)=>{
        setClientesCargados(response.data[0]);
      })
    }

 

    const changeState=(id, value)=>{
      Axios.put('http://localhost:3001/changeStateClient',{
        idClient:id,
        state:value,
      }).then(()=>{
        console.log('changed '+value);
        loadClient();
      });

    }

    const loadTipoNit=()=>{
      Axios.get('http://localhost:3001/getTiponit').then((response)=>{
        setTiposNit(response.data);
      })
    }

    const addTipoNit=()=>{
      Axios.post('http://localhost:3001/addTipoNit',{
        nombre:nombreAgregarTipoNit
      }).then(()=>{
        alert('tipo agregado correctamente ');
        loadTipoNit();
        setAgregarTipoNit(false);
      })
    }

    /*clientes */
    const mostratModalAddClient=()=>{
        const modal=document.getElementById('ModalAgregar');
        const modalData=new window.bootstrap.Modal(modal)
        modalData.show();
      }
  
      const cerrarModalAddClient=()=>{
        const modalData=document.getElementById('ModalAgregar');
        const modal= bootstrap.Modal.getInstance(modalData);
        if(modal){
          modal.hide();
          
          setNombreCliente('');
          setApellidoCliente('');
          setDireccionCliente('');
          setNitCliente(0);
          setTiponitCliente(0)
          setTelefonoCliente('');
        }
        if(clienteEditar){
          setClienteEditar([]);//
          setIdClientEditar();
        }
  
      }
  
  
      /*tipos nit */
      const cerrarModalNitAdd=()=>{
          const modalData=document.getElementById('AgregarTipoNit');
          const modal= bootstrap.Modal.getInstance(modalData);
          if(modal){
            modal.hide();
            setAgregarTipoNitNombre('');
          }
  
      }
  
      const abrirModalNitAdd=()=>{
          const modalData=document.getElementById('AgregarTipoNit');
          const modal=new window.bootstrap.Modal(modalData);
          modal.show();
      }
      
      const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
      };



      useEffect(()=>{
        setStoreName(storeinfo?.name || '')
        setStoreDescription(storeinfo?.description || '')
      },[storeinfo])

    useEffect(()=>{
        if(modalAgregarUser){
          mostratModalAddClient();
        }else{
          cerrarModalAddClient();
        }
      },[modalAgregarUser])

          useEffect(()=>{
      if(modalAgregarTipoNit){
        abrirModalNitAdd();
      }else{
        cerrarModalNitAdd();
      }

    },[modalAgregarTipoNit])

    useEffect(()=>{
        loadClient();
      loadTipoNit();
      loadStoreInfo();
      },[])



    return (
        <div>
         <div className='center-wrapper'>
        <div className="store-container_info">
          <div>
            <img src="https://i.pinimg.com/550x/cd/96/7b/cd967bb943e0850dabfdce84badf9b0c.jpg" alt="" />
          </div>
                <h1 className="store-title_info">Tienda: {storeName}</h1>
                <p className="store-description_info">
                    Bienvenido a nuestra tienda.
                </p>
                <div className="store-buttons_info">
                    <button className="btn-back_info" onClick={()=>{navigate('/homePage')}}>Regresar</button>
                    <button className="btn-add-user_info" onClick={()=>{setAgregaruser(true)}}>Agregar Usuario</button>
                </div>
            </div>
        </div>


      {/*modal de agregar tipo de cliente */}
      <div className="modal fade" id="ModalAgregar" data-bs-backdrop='static' data-bs-keyboard='false' tabIndex="-1" aria-labelledby="ModalAgregarLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalAgregarLabel">{editando? 'editando cliente':' agregar cliente'}</h5>
              <button type="button" className="btn-close" onClick={()=>{setAgregaruser(false); setEditando(false);}}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="" className="form-label">Name</label>
                <input type="text"  value={nombreCliente} onChange={(e)=>{setNombreCliente(e.target.value)}} className="form-control" placeholder="nombre" aria-describedby="helpId" />
                <small id="helpId" className="text-muted">Help text</small>
              </div>
              <div className="mb-3">
                <label htmlFor=""  className="form-label">Apellido</label>
                <input type="text" value={apellidoCliente} onChange={(e)=>{setApellidoCliente(e.target.value)}} className="form-control" placeholder="Apellido" aria-describedby="helpId" />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">direccion</label>
                <input type="text" value={direccionCliente} onChange={(e)=>{setDireccionCliente(e.target.value)}} className="form-control" placeholder="direccion" aria-describedby="helpId" />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">telefono</label>
                <input type="number" value={telefonoCliente} onChange={(e)=>{setTelefonoCliente(e.target.value)}} className="form-control" placeholder="Telefono" aria-describedby="helpId" />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">Nit</label>
                <input type="text" value={nitCliente} onChange={(e)=>{setNitCliente(e.target.value)}} className="form-control" placeholder="Nit" aria-describedby="helpId" />
              </div>
              <div className="mb-3">
                <label htmlFor="" className="form-label">Tipo de ID</label>
                <select value={tipoNitCliente} onChange={(e)=>{setTiponitCliente(e.target.value)}} className="form-select form-select-lg" name=""  id=""  >
                  <option value={0} >Select one</option>
                  {tiposnit.map((nit,index)=>(
                    <option value={nit.id} key={nit.id}>{nit.type}</option>
                  ))}
                </select>
              </div>
              
              <button type='button' onClick={()=>{setAgregarTipoNit(true); setEditando(false);}} className='btn btn-light' ><img src="https://img.icons8.com/ios/50/add--v1.png" alt="" /></button>
            <div className='mb-3'>
                <label className='form-label'>UserName</label>
                <input type="text" value={usuario} onChange={(e)=>{setusuario(e.target.value)}} className='form-control' placeholder='Usuario de login'/>
              </div> 
              <div className='mb-3 position-relative'>
                <label className='form-label'> Password</label>
                <input className='form-control' type={isPasswordVisible?'text':'password'} value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='password for login'/>
                <i className={`bi ${isPasswordVisible ? 'bi-eye-slash' : 'bi-eye'} position-absolute`}
                    onClick={togglePasswordVisibility} style={{right: '10px', top: '30px',cursor: 'pointer',fontSize: '1.2em',color: '#666', }}></i>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={()=>{setAgregaruser(false)}}>Close</button>
              <button type="button" className="btn btn-primary" onClick={()=>{saveProduct()}}>{editando? 'guardar cambios':'guardar cliente'}</button>
            </div>
          </div>
        </div>
      </div>


      <div className="modal fade" id="AgregarTipoNit" data-bs-backdrop='static' tabIndex="-1" aria-labelledby="AgregarTipoNitLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content bg-secondary text-white">
            <div className="modal-header">
              <h5 className="modal-title" id="AgregarTipoNitLabel">agregar tiponit</h5>
              <button type="button" className="btn-close" onClick={()=>{setAgregarTipoNit(false)}}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="" className="form-label">Name</label>
                <input type="text" value={nombreAgregarTipoNit} onChange={(e)=>{setAgregarTipoNitNombre(e.target.value)}} id="" className="form-control" placeholder="nombre" aria-describedby="helpId" />
                <small id="helpId" className="text-muted">Help text</small>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={()=>{setAgregarTipoNit(false)}}>Close</button>
              <button type="button" onClick={()=>{addTipoNit()}} className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>

        </div>
       
       
    );
}

export default Store;
