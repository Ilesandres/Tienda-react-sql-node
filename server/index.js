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
    
    db.query('INSERT INTO CATEGORY(NAME, DESCRIPTION) VALUES (?,?)',[category,description],
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
    db.query('SELECT * FROM CATEGORY',(err,result)=>{
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
    
    db.query('INSERT INTO PRODUCT(NAME,STOCK,PRICE,IS_ACTIVE) VALUES(?,?,?,?)',[nombre,stock,precio,isActivo],(err,result)=>{
        if(err){
            console.log(err)
        }else{
            const productId=result.insertId;
            db.query('INSERT INTO PRODUCT_CATEGORY(CATEGORY_ID, PRODUCT_ID) VALUES(?,?)',[category, productId],(err2,result1)=>{
                if(err2){
                    console.log(err2)
                }else{
                    res.send('prodcto agregado correctamente')
                }
            })
            
        }
    })
});

app.get('/getProducts',(req,res)=>{
        
    const searchData = req.query.search || ''; // Tomamos el dato de búsqueda desde 'query' en lugar de 'body'
  
    // Si searchData está vacío, no filtramos por nombre
    let query = `SELECT  PRODUCT.id AS PRODUCT_ID,
                        PRODUCT.name AS PRODUCT_NAME, 
                        PRODUCT.STOCK, 
                        PRODUCT.PRICE,
                        CATEGORY.name AS CATEGORY_NAME, 
                        PRODUCT.IS_ACTIVE,
                        CATEGORY.ID AS VALUE_CATEGORY
                    FROM 
                        category
                    INNER JOIN 
                        product_category ON category.id = product_category.category_id
                    INNER JOIN 
                        product ON product_category.product_id = product.id
 `;
  
    if (searchData) {
      query += ` WHERE PRODUCT.NAME LIKE ?`; // Si hay dato de búsqueda, agregamos la cláusula WHERE
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
    db.query(`DELETE FROM PRODUCT_CATEGORY WHERE PRODUCT_ID = ?`, [idProduct], (err, result) => {
        if (err) {
            console.error('Error al eliminar de PRODUCT_CATEGORY:', err);
            return res.status(500).send('Error al eliminar la categoría del producto');
        }

        // Si la primera consulta fue exitosa, eliminar de PRODUCT
        db.query(`DELETE FROM PRODUCT WHERE ID = ?`, [idProduct], (err2, result2) => {
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
    db.query(`UPDATE PRODUCT SET IS_ACTIVE=?, UPDATED_AT=? WHERE ID=?`,[valor,fecha_Act,idProduct],(err,result)=>{
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
    db.query(`UPDATE PRODUCT_CATEGORY SET  CATEGORY_ID=? WHERE PRODUCT_ID=?`,[category,idProduct],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            db.query(`UPDATE PRODUCT SET NAME=?, STOCK=?, PRICE=?, UPDATED_AT=? WHERE ID=? `,[nombre,stock,precio,fecha_Act,idProduct],(err2,result2)=>{
                if(err2){
                    console.log(err2);
                }else{
                    res.send('producto actualizado con exito')
                }
            })
        }
    })
})






app.listen(3001,()=>{
    console.log('corriendo en el puerto 3001')
});