import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Axios from 'axios';


const Productos = () => {

  const navigate=useNavigate();
  const [back, setBack]=useState(false);
  const [editar, setEditar]=useState(false);

  useEffect(()=>{
    if(back){
      navigate('/');
    }

  },[back,navigate]);
     
      
      
      
      /*categoria */
      const [categoria, setCategoria]=useState('');
      const [descripcionCategoria, setDescripcionCategoria]=useState('');
      const [categorias, setCategorias]=useState([]);
      
      /*obtengo las categorias */
      const getCatecogia=()=>{
        Axios.get('http://localhost:3001/leerCategorias').then((response)=>{
          setCategorias(response.data);
        });
      };
      
      /*productos */
      const [idProductEdit,setIdProductEdit]=useState(0);
      const [nombreProducto, setNombreProducto]=useState('');
      const [stockProducto, setStockProducto]=useState(0);
      const [precioProducto, setPrecioProducto]=useState(0);
      const [enabledProducto, setEnabledProducto]=useState(true);
      const [categoriaProduct, setCategoriaProduct]=useState(0);
      const [searchProducts, setSearchProduct]=useState('');
      const [productos, setProductos]=useState([]);
      const [editProduct,setProductEdit]=useState([]);

      /*const de estado de modales  */
      const [modalAgregar,setModalAgregar]=useState(false);
      const [modalCategory,setModalCategory]=useState(false);
      
      const addProduct=()=>{
        const nombreProducto1=nombreProducto.trim();
        if(nombreProducto!==null && nombreProducto1!=='' && categoriaProduct!==0){
          Axios.post('http://localhost:3001/addProduct',{
            nombre:     nombreProducto,
            stock:      stockProducto ,
            precio:     precioProducto,
            category:   categoriaProduct,
            isActivo:   enabledProducto
          }).then(()=>{
            alert('producto agregado correctamente');
           
          });
        }else{
          alert('verifica los datos ingresados');
          
        }
      };
      
      const getProducts=()=>{
        Axios.get('http://localhost:3001/getProducts',{
          params: {search:searchProducts}
        }).then((response)=>{
          setProductos(response.data);
        });
      };
      
      const deleteProduct=(id)=>{
        alert('eliminando producto con id : '+id);
        Axios.delete('http://localhost:3001/deleteProduct',{
          data:{idProduct: id},
        }).then(()=>{
          alert('producto eliminado con exito');
        });
      };
      
      const changeStateProduct=(id, valor)=>{
        Axios.put('http://localhost:3001/changeState',{
          idProduct:id,
          valor:valor
        }).then(()=>{ 
          console.log('state changed');
        });
      };


      const editProducto=()=>{
        Axios.put('http://localhost:3001/updateProduct',{
          idProduct: idProductEdit,
          nombre: nombreProducto,
          stock: stockProducto,
          precio: precioProducto,
          category: categoriaProduct,
        }).then(()=>{
          alert('producto editado correctamente');
        })
      };

      
      const saveProduct=()=>{
        if(!editar){
          addProduct();
        }else{
          editProducto();
        }
      };

      {/*modales */}

      const cerrarModalProduc=()=>{
              const modalData=document.getElementById('ModalAgregar');
              const modal=bootstrap.Modal.getInstance(modalData);
              if(modal){
                modal.hide();
              }
        }

        const abrirModalProduct=()=>{
          const modalData=document.getElementById('ModalAgregar');
          const modal=new window.bootstrap.Modal(modalData);
          modal.show();
        }
            
        const abrirModalCategory=()=>{
            const modalData=document.getElementById('agregarCategoria');
            const modal=new window.bootstrap.Modal(modalData);
            modal.show();
        }

        const cerrarModalCategory=()=>{
            const modalData=document.getElementById('agregarCategoria');
            const modal= bootstrap.Modal.getInstance(modalData);
            if(modal){
              modal.hide();
            }
        }



        useEffect(()=>{
          if(modalCategory){
            abrirModalCategory();
          }else{
            cerrarModalCategory();
            setCategoria('');
            setDescripcionCategoria('');
          }
        },[modalCategory]);

      useEffect(()=>{
        if(modalAgregar){
          abrirModalProduct()
        }else{
          cerrarModalProduc()
        }
      },[modalAgregar])
      
      useEffect(()=>{
      if(searchProducts!==''){
        console.log(searchProducts);
        getProducts();
      }else{
        getProducts();
      }
        
      },[searchProducts]);
      
      
      
      useEffect(()=>{
          if(!editar){
            setEditar(!editar);
            setProductEdit('');
            setProductEdit([]);
            setNombreProducto('');
            setStockProducto(0);
            setPrecioProducto(0);
            setCategoriaProduct(0);
            setIdProductEdit(0);
          }  
      },[editar]);

      useEffect(()=>{
        console.log(editProduct);
        setIdProductEdit(editProduct.PRODUCT_ID);
        setNombreProducto(editProduct.PRODUCT_NAME);
        setCategoriaProduct(editProduct.VALUE_CATEGORY);
        setStockProducto(editProduct.STOCK);
        setPrecioProducto(editProduct.PRICE);
      },[editProduct]);
      


      
     
      
      
  


          getProducts();
          getCatecogia();

        



        
  // Se ejecuta solo cuando el componente se monta
      
      

    return (
        <div className="product-list-container">
        {/* Encabezado */}
        <header className="header">
          <a className="back-link" onClick={()=>{setBack(!back);}}>Back</a>
          <h1>Productos</h1>
          <button className="add-button" onClick={()=>{setModalAgregar(true)}}>Agregar</button>
        </header>
  
        {/* Subtítulo */}
        <p className="subtitle_product">Modifica o actualiza la lista de productos</p>
  
        {/* Barra de búsqueda */}
        <div className="search-bar">
          <input type="search" onChange={(event)=>{setSearchProduct(event.target.value);}} placeholder="Search" className="search-input"/>
        </div>
  
        {/* Tabla de productos */}
        <table className="product-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Stock</th>
              <th>Categoria</th>
              <th>Precio</th>
              <th>Editar</th>
              <th>Habilitado</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((product, index) => (
              <tr key={product.ID_PRODUCT}>
                <td className='index_product'>{index+1}</td>
                <td className="product-name">
                  <div className="product-icon">A</div>
                  {product.PRODUCT_NAME}
                </td>
                <td>{product.STOCK}</td>
                <td>{product.CATEGORY_NAME}</td>
                <td>{product.PRICE}</td>
                <td>
                  <button className="edit-button" onClick={()=>{
                    setEditar(true); 
                     setProductEdit(product);
                    setModalAgregar(true)}} 
                    >Editar</button>
                  <button type="button"  className="delete-button_product" onClick={()=>{deleteProduct(product.PRODUCT_ID);}}>Eliminar</button>

                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={product.IS_ACTIVE}
                    onChange={(event) => {
                      changeStateProduct(product.PRODUCT_ID, event.target.checked);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        {/* seccion de los modales que estaran ocultos */}
        <div className="p-3 mb-2 bg-primary text-white">.bg-primary</div>
        
       
   

    
      <div className="modal fade" id="ModalAgregar"  tabIndex="-1" data-bs-backdrop="static" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="ModalAgregarLabel">{editar?'Editar el producto':'agregar producto'}</h5>
              <button type="button" className="btn-close"  onClick={()=>{setEditar(false); setModalAgregar(false)}} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className='mb-3'>
                <label htmlFor="nombreProducto" className='form-label'>Nombre del producto</label>
                <input type="text"  onChange={(event)=>{setNombreProducto(event.target.value);}} value={nombreProducto} name='nombreProduct' className='form-control' placeholder='nombre producto' />
                <label htmlFor="cantidad" className='form-label'>cantidad</label>
                <input type="number"  onChange={(event)=>{Number(setStockProducto(event.target.value));}} value={stockProducto} className='form-control' placeholder='cantidad' />
                <label htmlFor="precio">precio</label>
                <input type="number"  onChange={(event)=>{Number(setPrecioProducto(event.target.value));}} value={precioProducto}  className='form-control' placeholder='$ precio' />

              
                    <div className="mb-3 ">
                      <label htmlFor="categoria" className="form-label">categoria</label>
                      <select value={categoriaProduct}
                        className="form-select"
                        name="categoria"
                        id="categoria"
                        onChange={(event)=>{setCategoriaProduct(event.target.value);}}
                      >
                       <option  value={0}>seleccione</option>
                      {categorias.map((categoria,index)=>(
                        <option value={categoria.ID} key={categoria.ID}> <b className='fs-6'>{categoria.NAME}</b>  ::: <b>{categoria.DESCRIPTION}</b></option>
                      ))}
                       
                      
                      </select>
                      <button type="button" onClick={()=>{setModalCategory(true)}} className='btn btn'><img src="https://img.icons8.com/color/48/add--v1.png" alt="" /></button>
                  
                </div>
                
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={()=>{setEditar(false); setModalAgregar(false)}} >Close</button>
              <button type="button" className="btn btn-primary" onClick={saveProduct} >{editar? 'Save changes':'save'}</button>
            </div>
          </div>
        </div>
      </div>
      
      {/*modal de categorias para añadir*/}
      
      <div className="modal fade " id="agregarCategoria"  tabIndex="-1" aria-labelledby="agregarCategoriaLabel" aria-hidden="true" data-bs-backdrop='static'>
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content bg-secondary text-white">
            <div className="modal-header">
              <h5 className="modal-title" id="agregarCategoriaLabel">agregar categoria</h5>
              <button type="button" className="btn-close" onClick={()=>{setModalCategory(false)}}></button>
            </div>
            <div className="modal-body">
            <div className='mb-3'>
              <label htmlFor="nombreCategoria" className='form-label'>Nombre de la categoria</label>
              <input type="text" value={categoria} name='nombreCategoria' onChange={(event)=>{
              setCategoria(event.target.value);
              }} className='form-control' placeholder='nombre'/>
              <label htmlFor="descripcion" className='form-label' >descripcion</label>
              <textarea cols="30" name='descripcion' value={descripcionCategoria} onChange={(event)=>{
              setDescripcionCategoria(event.target.value);
              }} rows="10" className='form-control' placeholder='describe brevemente la categoria'></textarea>
            </div>
                
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={()=>{setModalCategory(false)}}>Close</button>
              <button type="button" className="btn btn-primary" onClick={agregarCategory}>Save changes</button>
            </div>
          </div>
        </div>
      </div>

      

      </div>
    );
    

    
    /*min 48:13 */
    function agregarCategory(){
      Axios.post('http://localhost:3001/createCategory',{
        category:categoria,
        description:descripcionCategoria
      }).then(()=>{
        alert('categoria registrado');
      });
    }
    

    
};

export default Productos;
