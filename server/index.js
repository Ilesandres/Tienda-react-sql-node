const express=require("express");
const app=express();
const mysql=require('mysql');
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
app.post('/addProduct',(req,res)=>{
    const nombre=req.body.nombre;
    const stock=req.body.stock;
    const precio=req.body.precio;
    const category=req.body.category;
    const isActivo=req.body.isActivo;
    
    db.query('INSERT INTO product (name, stock, price, isActive) VALUES (?, ?, ?, ?)', [nombre, stock, precio, isActivo], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            const productId = result.insertId;
            db.query('INSERT INTO product_category (categoryId, productId) VALUES (?, ?)', [category, productId], (err2, result1) => {
                if (err2) {
                    console.log(err2);
                } else {
                    res.send('Producto agregado correctamente');
                }
            });
        }
    });
    
});

app.get('/getProducts',(req,res)=>{
        
    const searchData = req.query.search || ''; // Tomamos el dato de búsqueda desde 'query' en lugar de 'body'
  
    // Si searchData está vacío, no filtramos por nombre
    let query = `SELECT  
                product.id AS productId,
                product.name AS productName, 
                product.stock, 
                product.price,
                category.name AS categoryName, 
                product.isActive,
                category.id AS valueCategory
            FROM 
                category
            INNER JOIN 
                product_category ON category.id = product_category.categoryId
            INNER JOIN 
                product ON product_category.productId = product.id
 `;
  
    if (searchData) {
      query += ` WHERE product.name LIKE ?`; // Si hay dato de búsqueda, agregamos la cláusula WHERE
    }
  
    db.query(query, searchData ? [`%${searchData}%`] : [], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error al realizar la búsqueda');
      } else {
        res.send(result);
      }
    });
})

//verificar su funcionamiento
app.delete('/deleteProduct', (req, res) => {
    const idProduct = req.body.idProduct;

    // Verificar si idProduct es válido
    if (!idProduct) {
        return res.status(400).send('ID de producto es requerido');
    }

    // Eliminar primero de PRODUCT_CATEGORY
    db.query(`DELETE FROM PRODUCT_CATEGORY WHERE productId = ?`, [idProduct], (err, result) => {
        if (err) {
            console.error('Error al eliminar de PRODUCT_CATEGORY:', err);
            return res.status(500).send('Error al eliminar la categoría del producto');
        }

        // Si la primera consulta fue exitosa, eliminar de PRODUCT
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

app.put('/updateProduct',(req,res)=>{
    const idProduct=req.body.idProduct;
    const nombre=req.body.nombre;
    const stock=req.body.stock;
    const precio=req.body.precio;
    const category=req.body.category;
    const fecha_Act=moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    db.query(`UPDATE PRODUCT_CATEGORY SET  categoryId=? WHERE productId=?`,[category,idProduct],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            db.query(`UPDATE PRODUCT SET name=?, stock=?, price=?, updatedAt=? WHERE id=? `,[nombre,stock,precio,fecha_Act,idProduct],(err2,result2)=>{
                if(err2){
                    console.log(err2);
                }else{
                    res.send('producto actualizado con exito')
                }
            })
        }
    })
})

/*seccion clientes */

app.get('/getClients', (req, res) => {
    const search = req.query.search || '';

    let query = (`SELECT people.firstName, people.lastName, 
                    people.address, document_type.id AS docValue, document_type.type, 
                    people.documentNumber, people.phone, roles.id AS roleValue, roles.name,
                    people.isActive as peopleIsactive,
                    people.id AS valuePerson, people.createdAt, people.updatedAt 
                FROM people
                INNER JOIN document_type ON people.documentTypeId = document_type.id
                INNER JOIN roles ON roles.id = 1
                INNER JOIN customer ON customer.personId = people.id
                `);

    if (search) {
        query += ` WHERE people.firstName LIKE ? OR people.lastName LIKE ? OR people.documentNumber LIKE ?`;
    }

    const searchData = `%${search}%`;
    db.query(query, search ? [searchData, searchData, searchData] : [], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error en la consulta');
        } else {
            res.send(result);
        }
    });
});

app.put('/changeStateClient', (req, res) => {
    const idClient = req.body.idClient;
    const value = req.body.state;
    const fechaAct = moment().tz('America/Bogota').format('YYYY-MM-DD HH:mm:ss');
    
    db.query('UPDATE people SET updatedAt = ?, isActive = ? WHERE id = ?', [fechaAct, value, idClient], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error al actualizar el estado del cliente');
        } else {
            res.send('Estado actualizado correctamente');
        }
    });
});


app.get('/getTiponit',(re,res)=>{
    
    db.query(`SELECT *FROM document_type`,(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
})

app.post('/addTipoNit',(req,res)=>{
    const nombre=(req.body.nombre).toLowerCase();
    db.query(`INSERT INTO document_type(type) VALUE(?)`,[nombre],(err,result)=>{
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
    const is_Active =true;

    db.query(`INSERT INTO people (firstName, lastName, address, documentTypeId, documentNumber, phone, isActive) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`, [nombre, apellido, direccion, tipoNit, nitCliente, phone, is_Active], (err, result) => {
    if (err) {
        console.log(err);
    } else {
        const clienteId = result.insertId;
        db.query(`INSERT INTO customer (personId) VALUES(?)`, [clienteId], (err1, result1) => {
            if (err1) {
                console.log(err1);
            } else {
                res.send('Cliente agregado con éxito');
            }
        });
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
        phone = ?, updatedAt = ? WHERE id = ?`, 
        [nombre, apellido, direccion, tipoNit, nit, telefono, fechaAct, idCliente], 
        (err, result) => {
          if (err) {
              console.log(err);
          } else {
              res.send('Cliente editado con éxito');
          }
      });
})




app.listen(3001,()=>{
    console.log('corriendo en el puerto 3001')
});