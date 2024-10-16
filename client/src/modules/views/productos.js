import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Axios from 'axios';


const Productos = () => {

  const navigate=useNavigate();
  const [back, setBack]=useState(false);
  const [editar, setEditar]=useState(false);
  const [cantCategory, setCantCategory]=useState(1);

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
      const [wideProductliscategory, setwideCategoryProducts]=useState([])
      const [searchProducts, setSearchProduct]=useState('');
      const [productos, setProductos]=useState([]);
      const [editProduct,setProductEdit]=useState([]);

      /*const de estado de modales  */
      const [modalAgregar,setModalAgregar]=useState(false);
      const [modalCategory,setModalCategory]=useState(false);
      
      const addProduct = () => {
        if (typeof nombreProducto === 'undefined' || nombreProducto.trim() === '') {
          alert('El nombre del producto es obligatorio.');
          return;
        }
        if (typeof stockProducto === 'undefined' || stockProducto === '' || isNaN(stockProducto) || stockProducto <= 0) {
          alert('El stock debe ser un número positivo.');
          return;
        }
        if (typeof precioProducto === 'undefined' || precioProducto === '' || isNaN(precioProducto) || precioProducto <= 0) {
          alert('El precio debe ser un número positivo.');
          return;
        }
        if (!Array.isArray(wideProductliscategory) || wideProductliscategory.length === 0) {
          alert('Debe seleccionar al menos una categoría válida.');
          return;
        }
        let clearCategory = true;
        for (let i = 0; i < wideProductliscategory.length; i++) {
          if (wideProductliscategory[i] === 0 || wideProductliscategory[i] === null || typeof wideProductliscategory[i] === 'undefined') {
            clearCategory = false;
            break;
          }
        }
        if (!clearCategory) {
          alert('Verifica que todas las categorías seleccionadas sean válidas.');
          return;
        }
        if (typeof enabledProducto === 'undefined') {
          alert('El estado del producto (activo/inactivo) es obligatorio.');
          return;
        }
        Axios.post('http://localhost:3001/addProduct', {
          nombre: nombreProducto,
          stock: stockProducto,
          precio: precioProducto,
          category: wideProductliscategory,
          isActivo: enabledProducto
        })
        .then(() => {
          alert('Producto agregado correctamente');
          setModalAgregar(false); 
        })
        .catch((error) => {
          console.error("Error al agregar producto:", error);
          alert('Error al agregar el producto. Por favor, intenta nuevamente.');
        });
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
          category: wideProductliscategory,
        }).then(()=>{
          alert('producto editado correctamente');
          setModalAgregar(false);
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
                setNombreProducto('');
                setStockProducto(0);
                setPrecioProducto(0);
                setCategoriaProduct(0);
                setIdProductEdit(0);
                setEditar(false)
                setwideCategoryProducts([]);
                setProductEdit([]);
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

        const adSwalCategory=()=>{
          setwideCategoryProducts((prevCategorias)=>[...prevCategorias, 0])
        }

        const deleteOneCategory=()=>{
          const lastPosition=wideProductliscategory.length-1;
          setwideCategoryProducts((prevCategorias)=>prevCategorias.filter((_ ,i)=>i !==lastPosition));
          console.log('ultima '+lastPosition)

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
        console.log(editProduct);
        setIdProductEdit(editProduct.productId);
        setNombreProducto(editProduct.productName);
        setCategoriaProduct(editProduct.valueCategory);
        setStockProducto(editProduct.stock);
        setPrecioProducto(editProduct.price);
        setCantCategory(editProduct.cantCategories || 1);
        setwideCategoryProducts(editProduct.dataCategory || [0]);
      },[editProduct]);

      useEffect(()=>{
        console.log(cantCategory);
        
      },[cantCategory])


      useEffect(()=>{
        console.log(' const categories');
        console.log(wideProductliscategory)
        console.log('posision 1 ')
        console.log(editProduct.dataCategory)
      },[wideProductliscategory])

     
      


      
     
      
      
  


          getProducts();
          getCatecogia();

        
      
      

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
              <tr key={product.productId}>
                <td className='index_product'>{index+1}</td>
                <td className="product-name">
                  <div className="product-icon">A</div>
                  {product.productName}
                </td>
                <td>{product.stock}</td>
                <td className='productCategories'>{product.categoryName}</td>
                <td>{product.price}</td>
                <td>
                  <button className="edit-button" onClick={()=>{
                    setEditar(true); 
                     setProductEdit(product);
                    setModalAgregar(true)}} 
                    >Editar</button>
                  <button type="button"  className="delete-button_product" onClick={()=>{deleteProduct(product.productId);}}>Eliminar</button>

                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={product.isActive}
                    onChange={(event) => {
                      changeStateProduct(product.productId, event.target.checked);
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
                <input type="number"  onChange={(event)=>{setStockProducto(event.target.value);}} value={stockProducto} className='form-control' placeholder='cantidad' />
                <label htmlFor="precio">precio</label>
                <input type="number"  onChange={(event)=>{setPrecioProducto(event.target.value);}} value={precioProducto}  className='form-control' placeholder='$ precio' />

                <div className="mb-3 ">
                <label htmlFor="categoria" className="form-label">categoria</label>
                    {Array.from({length : cantCategory}).map((_ ,index1)=>(
                      <div className='mb-3' key={index1}>
                        <select value={wideProductliscategory[index1]}
                        className="form-select"
                        name="categoria"
                        id="categoria"
                        onChange={(event)=>{
                          const selectValue=event.target.value;
                          setwideCategoryProducts((prevCategorias)=>{
                            const newCategories=[...prevCategorias];
                            for(let i=0; i<wideProductliscategory.length; i++){
                              if(wideProductliscategory[i]===selectValue){
                                alert('seleciona una categoria sin seleccionar')
                                newCategories[index1]=0;
                                return newCategories;
                              }else{
                                newCategories[index1]=selectValue;
                                return newCategories
                              }
                            }
                            
                          })
                        }}
                      >
                       <option  value={0}>seleccione</option>
                      {categorias.map((categoria,index)=>(
                        <option value={categoria.id} key={categoria.ID}> <b className='fs-6'>{categoria.name}</b>  ::: <b>{categoria.description}</b></option>
                      ))}
                       
                      
                      </select>
                      </div>

                    ))}
                    
                      
                      <div className='conatiner-buttons'>
                        <button type='button' className='child-button' title='add category to product'><
                         img src="https://img.icons8.com/wired/64/add.png" onClick={()=>{setCantCategory(cantCategory+1); adSwalCategory();}} alt="add category" /></button>
                         <button className='child-button' title='remove category'
                         onClick={()=>{cantCategory>1? setCantCategory(cantCategory-1):setCantCategory(1); deleteOneCategory();}}
                         ><img src="https://img.icons8.com/dotty/80/minus.png" alt="" /></button>
                         <button type="button" onClick={()=>{setModalCategory(true)}} className=' child-button'><img src="https://img.icons8.com/color/48/add--v1.png" alt="" /></button>
                  
                      </div>
                      
                      
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
