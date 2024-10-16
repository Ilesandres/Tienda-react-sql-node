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

    const [editando, setEditando]=useState(false);
    const [inventario, setInventario]=useState([ ]);

    const [productosAdd, setProductosAdd] = useState([
    ]);

    const [total, setTotal] = useState(15500);
    const [pagaCon, setPagaCon] = useState(20000);
    const [searchC, setSearchC] = useState(false);
    const cambio = pagaCon - total;

    const navigate = useNavigate();
    /*modal */
    const openModalSearch=()=>{
        const modaldata=document.getElementById('ModalSearch');
        const modal=new window.bootstrap.Modal(modaldata);
        if(producto){
            getProducts();
        }
        modal.show();
    }

    const closeModalSearch=()=>{
        const modaldata=document.getElementById('ModalSearch');
        const modal= bootstrap.Modal.getInstance(modaldata);
        if(modal){
            modal.hide();
            setInventario([]);
            setSearchModalData('');
        }
        
    }

    const saveProduct=()=>{
        if(!editando){
            addProduct();
        }

    }


    const selectProduct=(producto)=>{   
        setProductSelectId(producto.productId);
        setProductSelectNombre(producto.productName);
        setProductSelectPrecio(producto.price);
        setProductSelectCategoria(producto.categoryName);
        setProductSelectCategoriaId(producto.valueCategory);
        if(editando){
            setProductSelectCantidad(producto.quantity);
        }
        setModalSearchopen(false);
    }

    const getProducts=()=>{
        Axios.get('http://localhost:3001/getProducts',{
            params:{ search: searchModalData},
        }).then((res)=>{
            setInventario(res.data);
        })
    }

    const clearDataAddProduct=()=>{
        setProductSelectId('');
        setProductSelectNombre('');
        setProductSelectPrecio(0);
        setProductSelectCategoria('');
        setProductSelectCategoriaId('');
        setProductSelectCantidad(0);

        setEditando(false);

    }

    const addProduct=()=>{
        if(productoSelectCantidad>0){
            const data = {
                "productId": productoSelectId,
                "productName": productoSelectNombre,
                "category":productoSelectCategoria,
                "categoryValue":productoSelectCategoriaId,
                "price": productoSelectPrecio,
                "quantity": productoSelectCantidad
            }
            setProductosAdd([...productosAdd,data])
            clearDataAddProduct();
        }
        

    }

    useEffect(()=>{
        if(searchModalData){
            if(producto){
                 getProducts();
            }
           
        }else{
            if(producto){
                 getProducts();
            }
           
        }
    },[searchModalData])

    useEffect(()=>{
        console.log(modalSearchOpen);
        if(modalSearchOpen){
            openModalSearch();
        }else{
            closeModalSearch()
        }
    },[modalSearchOpen])
    

 
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
                    <input id='cantidadProdcuto' value={productoSelectCantidad} onChange={(e)=>{setProductSelectCantidad(e.target.value)}} type="number" />
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
                                <td><button type='button' onClick={()=>{setEditando(true);selectProduct(producto)}}  className='btn btn' >editar</button></td>
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
                        <input type="text" value="Diego Moreno S" />
                        <button onClick={() => { setSearchC(!searchC); setModalSearchopen(true) }}>🔍</button>
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
                                <th scope="row">1</th>
                                <td>Diego Moreno S</td>
                                <td>125</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="buttons_client_search">
                        <button type="button" className="client-btn-ventas"><img src="https://img.icons8.com/color/48/cancel--v1.png" alt="delete" /></button>
                        <button type="button" className="client-btn-ventas"><img src="https://img.icons8.com/color/48/print.png" alt="print" /></button>
                    </div>

                </div>
                <div className="pago-info_ventas">
                    <p>Total a pagar: <span className="total_ventas">${total}</span></p>
                    <label>Paga con:</label>
                    <input readOnly={true} type="number" value={pagaCon} onChange={e => setPagaCon(e.target.value)} />
                    <p>Cambio: <span className="cambio_ventas">${cambio}</span></p>
                </div>
            </div>


            {/* Modal */}
            <div className="modal fade" id="ModalSearch" tabIndex="-1" aria-labelledby="modalSearchLabel" aria-hidden="true">
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
                          <tbody>
                          {inventario.map((producto, index)=>(
                            <tr key={index}>
                              <th scope='row'>{index+1}</th>
                              <th>{producto.categoryName}</th>
                              <td>{producto.productName}</td>
                              <td>{producto.price}</td>
                              <td>{producto.stock}</td>
                              <td><button  className='btn btn-light' onClick={()=>{selectProduct(producto)}} type="button">añadir</button></td>
                            </tr>
                          ))}
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
