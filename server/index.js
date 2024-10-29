const express=require("express");
const app=express();
const mysql=require('mysql2');
const cors=require("cors");
const http=require("http");
const socketIo=require("socket.io");
const moment=require('moment-timezone')


app.use(cors(
    {
        origin: 'http://localhost:3000', // Especifica la URL del frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
));
app.use(express.json());

const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'store_dani'
})

/*categorias */

app.post('/createCategory',(req,res)=>{
    const category=req.body.category;
    const description=req.body.description;
    
    db.query('INSERT INTO category(name, description) VALUES (?,?)',[category,description],
        (err,result)=>{
            if(err){
                console.log(err);
            }else{
                res.send('categoria registrada con exito')
            }
        }
    );
});

app.get('/leerCategorias',(req,res)=>{    
    db.query('SELECT * FROM category',(err,result)=>{
        if(err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})

/*productos */
app.post('/addProduct', (req, res) => {
    const { nombre, stock, precio, category, isActivo } = req.body;

    db.query(`INSERT INTO product (name, stock, price, isActive) VALUES (?,?,?,?)`, 
    [nombre, stock, precio, isActivo], 
    (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al insertar producto');
        }

        const productId = result.insertId;
        const queries = category.map(categoria => {
            return new Promise((resolve, reject) => {
                db.query(`INSERT INTO productcategory (categoryId, productId) VALUES (?, ?)`, 
                [categoria, productId], 
                (err1, result1) => {
                    if (err1) {
                        return reject(err1);
                    }
                    resolve(result1);
                });
            });
        });

        Promise.all(queries)
            .then(() => {
                res.status(200).send('Producto y categorías insertados correctamente');
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Error al insertar categorías');
            });
    });
});


app.get('/getProducts', (req, res) => {
    const searchData = req.query.search || '';
    const store=1;
    
    let query = `SELECT  
                product.id AS productId,
                product.name AS productName, 
                product.stock, 
                product.price,
                GROUP_CONCAT(category.name ORDER BY category.name ASC SEPARATOR ', ') AS categoryName, 
                GROUP_CONCAT(category.id  ORDER BY category.name ASC SEPARATOR ',') AS valueCategories,
                product.isActive
            FROM 
                category
            INNER JOIN 
                productCategory ON category.id = productCategory.categoryId
            INNER JOIN 
                product ON productCategory.productId = product.id
                INNER JOIN 
		    productsstore ON product.id=productsstore.productId`;
    
    if (searchData) {
        query += ` WHERE product.name LIKE ? AND productsstore.storeId=?`; 
    }else{

    }
    
    // Add GROUP BY after WHERE clause or at the end
    query += ` GROUP BY product.id`;
  
    db.query(query, searchData ? [`%${searchData}%`,store] : [], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error al realizar la búsqueda');
      } else {
        if(result.length>0){
            result.forEach((producto)=>{
                let categories=producto.valueCategories.split(',');
                producto.dataCategory=categories;
                producto.cantCategories=categories.length;
                
            })
        }
        res.send(result);
      }
    });
});


//verificar su funcionamiento
app.delete('/deleteProduct', (req, res) => {
    const idProduct = req.body.idProduct;

    if (!idProduct) {
        return res.status(400).send('ID de producto es requerido');
    }
    db.query(`DELETE FROM productCategory WHERE productId = ?`, [idProduct], (err, result) => {
        if (err) {
            console.error('Error al eliminar de PRODUCT_CATEGORY:', err);
            return res.status(500).send('Error al eliminar la categoría del producto');
        }

        db.query(`DELETE FROM product WHERE id = ?`, [idProduct], (err2, result2) => {
            if (err2) {
                console.error('Error al eliminar de PRODUCT:', err2);
                return res.status(500).send('Error al eliminar el producto');
            }

            // Envío de respuesta exitosa
            res.status(200).send('Producto eliminado con éxito');
        });
    });
});


app.put('/changeState',(req,res)=>{
    const idProduct=req.body.idProduct;
    const valor=req.body.valor;
    const fecha_Act=moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    db.query(`UPDATE product SET isActive=?, updatedAt=? WHERE id=?`,[valor,fecha_Act,idProduct],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send('estado del producto cambiado')
        }
    })
    
    
})

app.put('/updateProduct', (req, res) => {
    const idProduct = req.body.idProduct;
    const nombre = req.body.nombre;
    const stock = req.body.stock;
    const precio = req.body.precio;
    const category = req.body.category; // list of category IDs
    const fecha_Act = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

    

    const updateProductQuery = `UPDATE product SET name = ?, stock = ?, price = ?, updatedAt = ? WHERE id = ?`;

    db.query(updateProductQuery, [nombre, stock, precio, fecha_Act, idProduct], (err, result) => {
        if (err) {
            console.log('Error al actualizar el producto');
            return res.status(500).send('Error al actualizar el producto');
            
        } 

        // Delete all existing category associations for the product with ids
        const deleteCategoriesQuery = `DELETE FROM productcategory WHERE productId = ?`;
        db.query(deleteCategoriesQuery, [idProduct], (err, result) => {
            if (err) {
                console.log('Error al eliminar las categorías asociadas al producto');
                return res.status(500).send('Error al eliminar las categorías asociadas al producto');
                
            }
           
            //insert he new values for the category and product
            const insertCategoryPromises = category.map((categoriaId) => {
                return new Promise((resolve, reject) => {
                    const insertCategoryQuery = `INSERT INTO productcategory (productId, categoryId) VALUES (?, ?)`;
                    db.query(insertCategoryQuery, [idProduct, categoriaId], (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
            });

            // Wait for all category insertions to complete
            Promise.all(insertCategoryPromises)
                .then(() => {
                    res.status(200).send('Producto editado con éxito');
                })
                .catch((err) => {
                    res.status(500).send('Error al actualizar las categorías del producto');
                    console.log('Error al actualizar las categorías del producto')
                });
        });
    });
});

/*seccion clientes */

app.get('/getClients', (req, res) => {
    const search = req.query.search || '';

    let query = (`SELECT people.firstName, people.lastName,
        people.address, documentType.id AS docValue, documentType.type,
        people.documentNumber,people.phone, roles.id AS roleValue, roles.name,
        user.id AS valuePerson, people.createdAt, people.updatedAt, people.isActive
        FROM people
        INNER JOIN documentType ON people.documentTypeId=documentType.id
        INNER JOIN user ON people.userId=user.id
        INNER JOIN userroles ON user.id=userroles.userId
        INNER JOIN roles ON  userroles.rolId=roles.id WHERE roles.id=1
                `);

    if (search) {
        query += ` AND people.firstName LIKE ? OR people.lastName LIKE ? OR people.documentNumber LIKE ?`;
    }
    query+=` ORDER BY people.updatedAt DESC `;

    const searchData = `%${search}%`;
    db.query(query, search ? [searchData, searchData, searchData] : [], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error en la consulta');
        } else {
            res.status(200).send(result);
        }
    });
});

app.put('/changeStateClient', (req, res) => {
    const idClient = req.body.idClient;
    const value = req.body.state;
    const fechaAct = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    
    db.query('UPDATE people SET updatedAt = ?, isActive = ? WHERE id =  (SELECT user.peopleId FROM user WHERE user.id=?)', [fechaAct, value, idClient], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al actualizar el estado del cliente');
        } else {
            res.send('Estado actualizado correctamente');
        }
    });
});


app.get('/getTiponit',(re,res)=>{
    
    db.query(`SELECT *FROM documentType`,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

app.post('/addTipoNit',(req,res)=>{
    const nombre=(req.body.nombre).toLowerCase();
    db.query(`INSERT INTO documentType(type) VALUE(?)`,[nombre],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send('categoria agregada correctamente')
        }
    })
})

//modificar todo esta seccion
app.post('/addCliente',(req,res)=>{
    const nombre =req.body.nombre;
    const apellido =req.body.apellido;
    const direccion =req.body.direccion;
    const nitCliente =req.body.nitCliente;
    const tipoNit =req.body.tipoNit;
    const phone =req.body.telefono;
    const rol =1;
    const username='';
    const password='';
    const is_Active =true;

    db.query(`INSERT INTO  user(username, password) VALUES(?,?)`,[username,password],(err1,result1)=>{
        if(err1){
            console.log(err1);
            res.status(500).send('error al crear el usuario');
        }else{
            const idUser=result1.insertId;

                db.query(`INSERT INTO people (firstName, lastName, address, documentTypeId, documentNumber, phone, isActive,userId) 
                VALUES (?, ?, ?, ?, ?, ?, ?,?)`, [nombre, apellido, direccion, tipoNit, nitCliente, phone, is_Active,idUser], (err, result) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('error al insertar la persona')
                } else {
                    
                    db.query(`INSERT INTO userroles(rolId, userId) VALUES(?,?)`,[rol,idUser],(err2, rsult2)=>{
                        if(err2){
                            console.log(err2);
                            res.status(500).send('error al insertar el rol');
                        }else{
                            res.status(200).send('Cliente agregado con éxito');
                        }
                    })
                            
                }
            })
        }
    })


})

app.put('/updateClient',(req,res)=>{
    const nombre =req.body.nombre;
    const apellido =req.body.apellido;
    const direccion =req.body.direccion;
    const telefono =req.body.telefono;
    const nit =req.body.nit;
    const tipoNit =req.body.tipoNit;
    const idCliente =req.body.idCliente;
    const fechaAct=moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');

    db.query(`UPDATE people SET firstName = ?, lastName = ?, address = ?, documentTypeId = ?, documentNumber = ?, 
        phone = ?, updatedAt = ? WHERE id = (SELECT user.peopleId FROM user WHERE user.id=?)`, 
        [nombre, apellido, direccion, tipoNit, nit, telefono, fechaAct, idCliente], 
        (err, result) => {
          if (err) {
              console.log(err);
          } else {
              res.send('Cliente editado con éxito');
          }
      });
})



/*seccion invoice */

app.get('/getPaymentMethod',(req,res)=>{
    db.query('SELECT id AS methodValue, method FROM paymentMethod ',(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send('error de servidor');
        }else{
            res.status(200).send(result);
        }
    })
})

app.get('/getInvoice',(req,res)=>{
    const {search}= req.body.search || '';
    db.query('SELECT *FROM invoice',(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send('error de consulta de las facturas');
        }else{
            res.status(200).send(result);
        }
    })
})

app.post('/addInvoice',(req,res)=>{
    const{productos, cliente, total, estado, metodoPago}=req.body
    const products=[];
    productos.map((producto)=>{
        products.push(producto.productId);
    })
    console.log('productos : ');
    console.log(productos);
    console.log(products);
    console.log('cliente '+cliente)
    console.log('total : '+total)
    console.log('estado '+estado)
    console.log('metodo pago '+metodoPago)
})


app.get('/getStatusInvoice',(req,res)=>{
    db.query(`SELECT invoicestatus.id as statusValue, invoicestatus.name, invoicestatus.description, invoicestatus.uuid
        from invoicestatus
        `,(err,result)=>{
            if(err){
                console.log(err);
                res.status(500).send('error')
            }else{
                res.status(200).send(result)
            }
        })
})

app.listen(3001,()=>{
    console.log('corriendo en el puerto 3001')
});