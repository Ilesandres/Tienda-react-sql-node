import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

const Ventas = () => {


    const [modalSearchOpen, setModalSearchopen]=useState(false);
    const [searchModalData,setSearchModalData]=useState('');

    /*VALORES PARA PRODUCTO */
    const [producto, setProducto]=useState(false)
    const [productoSelectId, setProductSelectId]=useState(0);
    const [productoSelectNombre, setProductSelectNombre]=useState('');
    const [productoSelectPrecio, setProductSelectPrecio]=useState(0);
    const [productoSelectCantidad, setProductSelectCantidad]=useState(0);
    const [productoSelectCategoria, setProductSelectCategoria]=useState('');
    const [productoSelectCategoriaId, setProductSelectCategoriaId]=useState(0);
    const [modifyIndexProduct, setModifyIndexProduct]=useState();
    const [metodoPago, setMetodoPago]=useState(0);
    const [metodosDePago,setMetodosDePago]=useState([]);
    {/*## UUID */}
    const [estadoFactura, setEstadoFactura]=useState(0);

    const [statusInvoice, setStatusInvoice]=useState([]);

    /* clientes */
    const [clientes, setClientes]=useState([]);
    const [idClienteSelect, setIdClienteSelect]=useState();
    const [nombreClienteSelect, setnombreClienteSelect]=useState('');
    const [nit, setNit]=useState('');

    const [editando, setEditando]=useState(false);
    const [inventario, setInventario]=useState([ ]);

    const [productosAdd, setProductosAdd] = useState([
    ]);

    const [total, setTotal] = useState(0);
    const [pagaCon, setPagaCon] = useState(0);
    const [searchC, setSearchC] = useState(false);
    const cambio = pagaCon - total;

    const navigate = useNavigate();

    const agregarVenta=()=>{
        
        if(typeof idClienteSelect==='undefined' || idClienteSelect==='' || isNaN(idClienteSelect)){
            alert('el cliente no esta definido');
            return;
        }
        if(typeof metodoPago==='undefined' || metodoPago===0 || metodoPago==='' || isNaN(metodoPago)){
            alert('el metodo de pago es obligatorio');
            return;
        }
        if(typeof estadoFactura==='undefined' || estadoFactura==='' || isNaN(estadoFactura) || estadoFactura===0){
            alert('debes seleccionar un estado en la factura');
            return;
        }
        if(typeof total==='undefined' || total.trim==='' || isNaN(total)){
            alert('error interno por favor comunicate con soporte');
            return;
        }
        if(!Array.isArray(productosAdd) || productosAdd.length===0){
            alert('tienes que seleccionar productos');
            return;
        }
        if(typeof pagaCon==='undefined' || pagaCon<0){
            alert('verifica el valor con el cual se paga');
            return;
        }
        if(typeof cambio==='undefined' || cambio<0){
            alert('revisa el valor pagado');
            return;
        }

         Axios.post('http://localhost:3001/addInvoice',{
            cliente:idClienteSelect,
            estado:estadoFactura,
            total:total,
            productos:productosAdd,
            metodoPago:metodoPago
         }).then((res)=>{
            clearProductsAdd();
            clearDataClient();
         })
    }

    /*modal */
    const openModalSearch=()=>{
        const modaldata=document.getElementById('ModalSearch');
        const modal=new window.bootstrap.Modal(modaldata);
        if(producto){
            getProducts();
        }
        if(searchC){
            getClients();
        }
        modal.show();
    }

    const getPaymentMethod=()=>{
        Axios.get('http://localhost:3001/getPaymentMethod').then((res)=>{
            if(res){
                setMetodosDePago(res.data);
            }
         })
    }



    const closeModalSearch=()=>{
        const modaldata=document.getElementById('ModalSearch');
        const modal= bootstrap.Modal.getInstance(modaldata);
        if(modal){
            modal.hide();
            setInventario([]);
            setSearchModalData('');
            setClientes([]);
        }
        
    }


    const saveProduct=()=>{
        if(!editando){
            addProduct();
        }else{
            modfyProduct();
        }

    }

    const modfyProduct = () => {
        console.log('Editando producto con posición: ' + modifyIndexProduct);
    

        const updatedProduct = {
            productId: productoSelectId,
            productName: productoSelectNombre,
            category: productoSelectCategoria,
            categoryValue: productoSelectCategoriaId,
            price: productoSelectPrecio,
            quantity: Math.floor(productoSelectCantidad)
        };
    

        setProductosAdd((prevProducts) =>
            prevProducts.map((producto, i) => 
                i === modifyIndexProduct ? updatedProduct : producto 
            )
        );
    
 
        clearDataAddProduct();
        setEditando(false);
        setModifyIndexProduct(null);
    };
    


    const selectProduct=(producto,index)=>{   
        let productBussy=false;
        
        productosAdd.forEach((productoA)=>{
            if(productoA.productId==producto.productId){
                productBussy=true;
                return;
            }
        })
        
        if(!productBussy){
                setProductSelectId(producto.productId);
                setProductSelectNombre(producto.productName);
                setProductSelectPrecio(producto.price);
                setProductSelectCategoria(producto.categoryName);
                setProductSelectCategoriaId(producto.valueCategories);

                setModalSearchopen(false);
                setProducto(false)

            
        }else{
            alert('el producto ya ha sido seleccionado,\n selecciona otro producto o modifica el existente')
            
        }
        
    }

    const getProducts=()=>{
        Axios.get('http://localhost:3001/getProducts',{
            params:{ search: searchModalData},
        }).then((res)=>{
            setInventario(res.data);
        })
    }

    const getClients=()=>{
        Axios.get('http://localhost:3001/getClients',{
            params: {search: searchModalData},
        }).then((res)=>{
            setClientes(res.data);
        })

    }
    const getStatus=()=>{
        Axios.get('http://localhost:3001/getStatusInvoice').then((res)=>{
            setStatusInvoice(res.data);
        })
    }

    const clearDataAddProduct=()=>{
        setProductSelectId('');
        setProductSelectNombre('');
        setProductSelectPrecio(0);
        setProductSelectCategoria('');
        setProductSelectCategoriaId('');
        setProductSelectCantidad(0);
        setModifyIndexProduct();

        setEditando(false);

    }

    const clearDataClient=()=>{
        setIdClienteSelect();
        setnombreClienteSelect();
        setEstadoFactura(0);
        setNit();
    }

    const selectCliente=(cliente)=>{
        setIdClienteSelect(cliente.valuePerson);
        setnombreClienteSelect(cliente.firstName+' '+cliente.lastName);
        setNit(cliente.documentNumber)
        setModalSearchopen(false);
    }

    const clearProductsAdd=()=>{
        setProductosAdd([]);
        setPagaCon(0);
    }

    const addProduct=()=>{
        if(productoSelectCantidad>0){
            const data = {
                productId: productoSelectId,
                productName: productoSelectNombre,
                category:productoSelectCategoria,
                categoryValue:productoSelectCategoriaId,
                price: productoSelectPrecio,
                quantity: Math.floor(productoSelectCantidad)
            }
            setProductosAdd([...productosAdd,data])
            clearDataAddProduct();
        }
        

    }

    useEffect(()=>{
        if(searchModalData){
            if(producto){
                 getProducts();
            }else{
                getClients();
            }
           
        }else{
            if(producto){
                 getProducts();
            }else{
                getClients();
            }
           
        }
    },[searchModalData])

    useEffect(()=>{
        if(modalSearchOpen){
            openModalSearch();
        }else{
            closeModalSearch()
        }
    },[modalSearchOpen])

    useEffect(()=>{
        if(editando){
            if(modfyProduct){
                
                const productIndexModify=(productosAdd[modifyIndexProduct])
                console.log(productIndexModify);

                setProductSelectNombre(productIndexModify.productName);
                setProductSelectCantidad(productIndexModify.quantity);
                setProductSelectCategoria(productIndexModify.category);
                setProductSelectCategoriaId(productIndexModify.categoryValue);
                setProductSelectPrecio(productIndexModify.price);
                setProductSelectId(productIndexModify.productId);
            }
            console.log('editando : '+editando);
            console.log(modifyIndexProduct);
        }


    },[editando])
    

    useEffect(()=>{
        let total1=0;
        productosAdd.forEach((producto)=>{
            total1+=producto.price*producto.quantity;
        })
        setTotal(total1);
    },[productosAdd])

    useEffect(()=>{
        getStatus();
        getPaymentMethod();
    },[])

    const formatCurrency = (value) => {
        const numberString = value.replace(/\D/g, ''); 
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
    };

    const handlePagaConChange = (e) => {
        const rawValue = e.target.value;
        const formattedValue = formatCurrency(rawValue);
        setPagaCon(formattedValue);
    };
 
    return (
        <div className="ventas-container_ventas">
            {/* Encabezado */}
            <header className="header_ventas">
                <button className="back-btn_ventas" onClick={() => { navigate('/'); }}>
                    Back
                </button>
                <h1>Ventas</h1>
                <div className="user-info_ventas">
                    <span>usuario: MATIXTA</span>
                    <span>Rol: Administrador</span>
                    <span>1234</span>
                </div>
            </header>

            {/* Información de venta */}
            
            <div className="venta-info_ventas">
                <h3>Ingrese la información de la venta</h3>
                <div className="input-group_ventas">
                    <label>Producto</label>
                    <input value={productoSelectNombre} type="text" id='inputProduct' readOnly />
                    <button  onClick={()=>{setProducto(true); setModalSearchopen(true)}} className="search-btn_ventas">🔍</button>
                </div>
                <div className="input-group_ventas">
                    <label>Cantidad</label>
                    <input id='cantidadProdcuto' value={productoSelectCantidad} onChange={(e)=>{Number(setProductSelectCantidad(e.target.value)) }} type="number" />
                </div>
                <div className="input-group_ventas">
                    <label>Precio</label>
                    <input value={productoSelectPrecio} type="text" id='precioProducto' readOnly={true} />
                </div>
                <div className="action-buttons_ventas">
                    <button onClick={()=>{saveProduct();}} className="add-btn_ventas">➕</button>
                    <button onClick={()=>{clearDataAddProduct();}} className="clear-btn_ventas">🧹</button>
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="productos-table_ventas">
                <table>
                    <thead>
                        <tr>
                            <th>categoria</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio Unidad</th>
                            <th>opcion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosAdd.map((producto, index) => (
                            <tr key={index}>
                                <td>{producto.category}</td>
                                <td>{producto.productName}</td>
                                <td>{producto.quantity}</td>
                                <td>{`$${producto.price}`}</td>
                                <td><button type='button' onClick={()=>{setEditando(true); setModifyIndexProduct(index)}}  className='btn btn' >editar</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Información del cliente y pago */}
            <div className="cliente-pago_ventas">
                <div className="cliente-info_ventas">
                    <h4>Cliente</h4>
                    <div className="client-seacrh-table">
                        <input type="text" value={nombreClienteSelect} readOnly='true' />
                        <button onClick={() => { setSearchC(true); setModalSearchopen(true) }}>🔍</button>
                    </div>

                    <table className="table bg-light">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Nombre </th>
                                <th scope="col">Nit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr key="cliente">
                                <th scope="row">{nombreClienteSelect?'1':'*/*'}</th>
                                <td>{nombreClienteSelect}</td>
                                <td>{nit}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="buttons_client_search">
                        <button type="button" onClick={()=>{clearDataClient()}} className="client-btn-ventas"><img src="https://img.icons8.com/color/48/cancel--v1.png" alt="delete" /></button>
                        <button type="button"  className="client-btn-ventas"><img src="https://img.icons8.com/color/48/print.png" alt="print" /></button>
                    </div>
                </div>
                <div>
                     <div className='mb-3'>
                        <label>estado de la factura</label>
                        <select className='form-select' value={estadoFactura} onChange={(event)=>{setEstadoFactura(event.target.value)}}>
                            <option value={0}> selecciona</option>
                            {statusInvoice.map((estado, index)=>(
                                <option key={index} value={estado.statusValue}>{estado.name}</option>
                            ))}
                        
                    </select>
                    </div>
                    <div className='mb-3'>
                        <label>metodo de pago</label>
                        <select className='form-select' value={metodoPago} onChange={(event)=>{setMetodoPago(event.target.value)}}>
                            <option value={0}> selecciona</option>
                            {metodosDePago.map((metodo, index)=>(
                                <option key={index} value={metodo.methodValue}>{metodo.method}</option>
                            ))}
                        
                    </select>
                    </div>
                    <h2>guardar venta</h2>
                    <button className='back-btn_ventas' onClick={()=>{agregarVenta()}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 13.34c-.63-.22-1.3-.34-2-.34V5H5v13.26l1-.66l3 2l3-2l1.04.69c-.04.21-.04.47-.04.71c0 .65.1 1.28.3 1.86L12 20l-3 2l-3-2l-3 2V3h18zM18 15v3h-3v2h3v3h2v-3h3v-2h-3v-3z"/></svg></button>
                    
                   
                    
                </div>
                <div className="pago-info_ventas">
                    <p>Total a pagar: <span className="total_ventas">${total}</span></p>
                    <label>Paga con:</label>
                    <input  type="number" value={pagaCon} onChange={(e)=>{setPagaCon(e.target.value)}} />
                    <p>Cambio: <span className="cambio_ventas">${cambio}</span></p>
                </div>
            </div>


            {/* Modal */}
            <div className="modal fade" id="ModalSearch" tabIndex="-1" aria-labelledby="modalSearchLabel" aria-hidden="true" data-bs-backdrop='static'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="ModalSearchLabel">Buscar {producto? 'productos':'clientes'}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={()=>{setProducto(false); setModalSearchopen(false)}} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        <div className='mb-3'>
                        <label htmlFor="search" className='form-label'>Buscar</label>
                          <input type='search' value={searchModalData} onChange={(e)=>{setSearchModalData(e.target.value); }} name='search' placeholder={producto?'producto a buscar':'cliente a buscar'} className='form-control'/>
                          
                        </div>
                        <div className='form-group'>
                        <table className='table'>
                          
                          
                            {producto?
                            <thead>
                            <tr>
                                <th scope='col'>#</th>
                                <th scope='col'>categoria</th>
                                <th scope='col'>nombre</th>
                                <th scope='col'>precio</th>
                                <th scope='col'>stock</th>
                                <th scope='col'>añadir</th>
                              </tr>
                          </thead>

                        :  
                        <thead>
                            <tr>
                                <th scope='col'>#</th>
                                <th scope='col'>Nombre</th>
                                <th scope='col'>Apellido</th>
                                <th scope='col'>Type</th>
                                <th scope='col'>Nit</th>
                                <th scope='col'>seleccionar</th>
                              </tr>
                          </thead>}
                            
                          <tbody>
                          { producto ? inventario.map((producto, index)=>(
                            <tr key={index}>
                              <th scope='row'>{index+1}</th>
                              <th>{producto.categoryName}</th>
                              <td>{producto.productName}</td>
                              <td>{producto.price}</td>
                              <td>{producto.stock}</td>
                              <td><button  className='btn btn-light' onClick={()=>{selectProduct(producto)}} type="button">añadir</button></td>
                            </tr>
                          )) : clientes.map((cliente, index)=>(
                            <tr key={index}>
                                <th scope='row'>{index}</th>
                                <th>{cliente.firstName}</th>
                                <th>{cliente.lastName}</th>
                                <th>{cliente.type}</th>
                                <th>{cliente.documentNumber}</th>
                                <th><button onClick={()=>{selectCliente(cliente)}}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512"><path fill="currentColor" d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0m149.3 277.3c0 11.8-9.5 21.3-21.3 21.3h-85.3V384c0 11.8-9.5 21.3-21.3 21.3h-42.7c-11.8 0-21.3-9.6-21.3-21.3v-85.3H128c-11.8 0-21.3-9.6-21.3-21.3v-42.7c0-11.8 9.5-21.3 21.3-21.3h85.3V128c0-11.8 9.5-21.3 21.3-21.3h42.7c11.8 0 21.3 9.6 21.3 21.3v85.3H384c11.8 0 21.3 9.6 21.3 21.3z"/></svg></button></th>
                            </tr>
                          )) }
                          </tbody>
                            
                        </table>
                          
                        </div>
                            ...
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={()=>{setModalSearchopen(false); setProducto(false); }} >Cerrar</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ventas;
