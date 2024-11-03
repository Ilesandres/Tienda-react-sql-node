const express=require("express");
const app=express();
const mysql=require('mysql2');
const cors=require("cors");
const http=require("http");
const moment=require('moment-timezone');
const bcrypt=require('bcrypt');
const saltRounds=13;
const { resolve } = require("path");
const { rejects } = require("assert");


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
    const idTienda=1;


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

                db.query(`INSERT INTO productsstore(productId, storeId) VALUES(?,?)`,[productId,idTienda],(err2,result2)=>{
                    if(err2){
                        console.log(err2)
                        res.status(500).send('error');
                    }else{
                        res.status(200).send('Producto y categorías insertados correctamente');
                    }
                })
                
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
		    productsstore ON product.id=productsstore.productId WHERE productsstore.storeId=? `;
    
    if (searchData) {
        query += ` AND product.name LIKE ? `; 
    }else{

    }
    
    // Add GROUP BY after WHERE clause or at the end
    query += ` GROUP BY product.id`;
  
    db.query(query, searchData ? [store,`%${searchData}%` ] : [store], (err, result) => {
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


        db.query(`DELETE FROM productsstore WHERE productId = ?`, [idProduct], (err2, result2) => {
            if (err2) {
                console.error('Error al eliminar de PRODUCTS_STORE:', err2);
                return res.status(500).send('Error al eliminar el producto de la tienda');
            }


            db.query(`DELETE FROM product WHERE id = ?`, [idProduct], (err3, result3) => {
                if (err3) {
                    console.error('Error al eliminar de PRODUCT:', err3);
                    return res.status(500).send('Error al eliminar el producto');
                }

           
                res.status(200).send('Producto eliminado con éxito');
            });
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
        INNER JOIN roles ON  userroles.rolId=roles.id 
                `);

    if (search) {
        query += ` WHERE people.firstName LIKE ? OR people.lastName LIKE ? OR people.documentNumber LIKE ? AND roles.id=1`;
    }else{
        query+=` WHERE roles.id=1 `;
    }
    
    const searchData = `%${search}%`;
    db.query(query, search ? [searchData, searchData,searchData] : [], (err, result) => {
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
    
    db.query('UPDATE people SET updatedAt = ?, isActive = ? WHERE userId=?', [fechaAct, value, idClient], (err, result) => {
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



app.post('/addCliente', (req, res) => {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const direccion = req.body.direccion;
    const nitCliente = req.body.nitCliente;
    const tipoNit = req.body.tipoNit;
    const phone = req.body.telefono;
    const rol = req.body.rol || 1;
    const username = req.body.username || null;
    let password = req.body.password || null;
    const is_Active = true;
    db.query(`SELECT COUNT(*) AS count FROM user WHERE username = ?`, [username], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en la consulta');
        }
    
        const count = result[0].count;
        if (count > 0) {
            return res.status(400).send('El nombre de usuario ya existe');
        }
        const hashPassword = (password) => {
        return new Promise((resolve, reject) => {
            if (password) {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        reject('Error al hashear la contraseña');
                    } else {
                        resolve(hash);
                    }
                });
            } else {
                resolve(null); 
            }
        });
    };


    hashPassword(password)
        .then((hashedPassword) => {
            return new Promise((resolve, reject) => {
                db.query(`INSERT INTO user(username, password) VALUES(?, ?)`, [username, hashedPassword], (err1, result1) => {
                    if (err1) {
                        reject(err1);
                    } else {
                        resolve(result1.insertId);
                    }
                });
            });
        })
        .then((idUser) => {
            return new Promise((resolve, reject) => {
                db.query(`INSERT INTO people (firstName, lastName, address, documentTypeId, documentNumber, phone, isActive, userId) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                          [nombre, apellido, direccion, tipoNit, nitCliente, phone, is_Active, idUser], 
                          (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(idUser);
                    }
                });
            });
        })
        .then((idUser) => {
            return new Promise((resolve, reject) => {
                db.query(`INSERT INTO userroles(rolId, userId) VALUES(?, ?)`, [rol, idUser], (err2, result2) => {
                    if (err2) {
                        reject(err2);
                    } else {
                        resolve('Cliente agregado con éxito');
                    }
                });
            });
        })
        .then((message) => {
            res.status(200).send(message);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error al crear el usuario');
        });
        
    });
  


}
);



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
        phone = ?, updatedAt = ? WHERE userId = ?`, 
        [nombre, apellido, direccion, tipoNit, nit, telefono, fechaAct, idCliente], 
        (err, result) => {
          if (err) {
              console.log(err);
              res.status(500).send('error')
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

app.get('/getInvoiceMax',(req,res)=>{
    db.query('SELECT MAX(i.total) AS maxInvoice FROM invoice AS i',(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send('error de consulta de maxima factura');
        }else{
            if(result.length>0){
                result.forEach((invoice)=>{
                    let valor=parseFloat(invoice.maxInvoice);
                    valor=Math.ceil(valor);
                    invoice.maxInvoice=valor;
                })
            }
            res.status(200).send(result);
        }
    })
})

app.get('/getInvoice',(req,res)=>{
    const search= req.query.search || '';
    const precioAsc=req.query.precioAsc;
    const precioDesc=req.query.precioDesc;
    const limit=req.query.limit;

    const tiendaId=1;
    let query=`SELECT i.id AS invoiceId, i.createdAt, i.updatedAt,
            i.uuid AS invoiceUuid,GROUP_CONCAT(p.id) AS productsId, GROUP_CONCAT(p.name SEPARATOR ', ') AS productsNames,
            GROUP_CONCAT(p.price) AS productPrices,i.total, pm.id AS paymentId, pm.method,
            u.id AS userId, CONCAT(pe.firstName, ' ', pe.lastName) AS name, pe.documentNumber
            FROM invoice AS i
            INNER JOIN invoiceproduct AS ip ON ip.invoiceId = i.id
            INNER JOIN  product AS p ON ip.productId = p.id
            INNER JOIN  USER AS u ON i.userId = u.id
            INNER JOIN  people AS pe ON u.id = pe.userId
            INNER JOIN  paymentmethod AS pm ON i.paymentMethod = pm.id
            INNER JOIN  productsstore AS ps ON p.id = ps.productId
            INNER JOIN  store AS s ON ps.storeId = s.id
            WHERE  s.id = ?`;
            
    if(search){
        query +=` AND pe.documentNumber LIKE ?`
    }
    if(limit){
        query +=` AND i.total BETWEEN 0 AND ?`
    }

    query+= ` GROUP BY 
                i.id, i.createdAt, i.updatedAt, i.uuid, i.total, pm.id, pm.method, u.id, pe.firstName, pe.lastName `;
    
    if(precioAsc==='true'){
            query+= ` ORDER BY  i.total ASC `;
    }
    if(precioDesc==='true'){
        query+=` ORDER BY i.total DESC `;
    }
                const searchData = `%${search}%`;
    db.query(query, search?[tiendaId, searchData,limit] : [tiendaId,limit],(err,result)=>{
         if(err){
            console.log(err);
            res.status(500).send('error de consulta de las facturas');
        }else{
            if(result.length>0){
                result.forEach((producto)=>{
                    let productsValues=producto.productsId.split(',');
                    let productsPrices=producto.productPrices.split(',');
                    producto.productsValues=productsValues;
                    producto.productPrices=productsPrices;
                })
            }
            res.status(200).send(result);
        }
    })
})


app.post('/addInvoice', async (req, res) => {
    const { productos, cliente, total, estado, metodoPago } = req.body;
    const cantproduct=[];
    const products = [];
    productos.map((producto) => {
        products.push(producto.productId);
        cantproduct.push(producto.quantity);
    });

    try {
        const stockActual = await Promise.all(
            products.map((productId) => {
                return new Promise((resolve, reject) => {
                    db.query(`SELECT stock FROM product WHERE id=?`, [productId], (err, result) => {
                        if (err) {
                            reject('Error de stocks');
                        } else {
                            resolve(result[0]?.stock);
                        }
                    });
                });
            })
        )

        let stockAvalaible=true;
        for(let i=0; i<products.length; i++){
           if(cantproduct[i]>stockActual[i]){
            stockAvalaible=false;
            break;
           }
        }

        if(!stockAvalaible){
            return res.status(400).send({message:'insuficient stock'});
        }
        
        
        try {
                     await Promise.all(
            products.map((productId, index)=>{
                return new Promise((resolve, reject) => {
                    const newStock=stockActual[index]-cantproduct[index];
                    const updateProduct=`UPDATE product SET stock=? WHERE id=?`;
                    db.query(updateProduct,[newStock,productId],(err,result)=>{
                        if(err){
                            reject('error updating stock')
                        }else{
                            resolve(result);
                        }
                    })
                })
            })
         )
         
                const insertInvoice=`INSERT INTO invoice(statusId,total,paymentMethod, userId) VALUES(?,?,?,?)`;
                const invoiceResult=await new Promise((resolve, reject) => {
                    db.query(insertInvoice,[estado,total,metodoPago,cliente],(err,result)=>{
                    if(err){
                        reject('error al crear la factura');
                    }else{
                        resolve(result)
                    }
                });
                });
                const invoiceId=invoiceResult.insertId;
                const insertProductInvoice=`INSERT INTO invoiceproduct(productId,invoiceId, quantity) VALUES(?,?,?)`;
                try {
                    await Promise.all(
                        products.map((productId,index)=>{
                            return new Promise((resolve, reject) => {
                                db.query(insertProductInvoice,[productId,invoiceId,cantproduct[index]],(err,result)=>{
                                    if(err){
                                        reject('error al insertar los productos');
                                    }else{
                                        resolve(result);
                                    }
                                })
                            })
                        })
                    )
                    res.status(200).send({ message: 'Invoice processed successfully', stockActual });
                } catch (error) {
                    console.log(error);
                }
         
        } catch (error) {
            
            console.log(error);
            res.status(500).send('err');
        }

        

        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});



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




app.delete('/deleteInvoice',(req,res)=>{
    const invoiceId=req.body.invoiceId;
    console.log('eliminando factura con id : '+invoiceId);
    db.query(`DELETE FROM invoiceProduct WHERE invoiceId =?`,[invoiceId], (err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send('error al elimar los productos de la factura');
        }else{
            db.query(`DELETE FROM invoice WHERE id=?`,[invoiceId],(err1,res1)=>{
                if(err1){
                    console.log(err1);
                    res.status(500).send('error al eliminar la factura');
                }else{
                    res.status(200).send('factura eliminada con exito')
                }
            })
        }
    })
})

app.post('/verifyLogin',(req, res)=>{
    const username=req.body.user;
    const password=req.body.password;
    db.query(`SELECT username, password, uuid FROM user WHERE username=?`,[username],(err,result)=>{
        if(err){
            console.log(err);
            return res.status(204).send('user not avalaible');
        }else{
            if(result.length===0 || result.length>1){
                res.status(404).send('user not avalaible please contact with tecnic support')
            }else{
            const user=result[0];
            const passAlmacenada=user.password;
            bcrypt.compare(password, passAlmacenada,(err1,result1)=>{
                if(err){
                    console.log(err1);
                    return res.status(500).send('error de verificacion de password');
                }else if(result1){
                    const dataUser={
                        result:result1,
                        userName: user.username,
                        uuid: user.uuid,
                    }
                    return res.status(202).send(dataUser);
                }else{
                    return res.status(401).send('error de contraseña o usuario')
                }
            })

            }
            
        }
    })
})

//completar
app.get('/storeInfo',(req,res)=>{

    const storeId=req.query.idStore || 1;
    db.query(`SELECT *FROM store WHERE id=1`,(err,result)=>{
        if(err){
            console.log(err);
            res.status(500).send('error interno');
        }else{
            res.status(200).send(result);
        }
    })

})




app.listen(3001,()=>{
    console.log('corriendo en el puerto 3001')
});