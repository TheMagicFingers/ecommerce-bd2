
module.exports = app => {
    app.post('/totalNotas', (req,res) => {
        const conn = require("../config/connectionFactory");
        console.log(req.body.id)
        conn.query(`call notas(${req.body.id}) `, (err, result) => {
            if(err) console.log(err)
            res.render("notas", {nota : result })
        })
    })   
    //NEW - adiciona uma nota/venda
    app.post('/checkout',(req,res) => {
        let compra = {
            id_produtos : req.body.id_produtos,
            descricao: req.body.descricao,
            url_img: req.body.url_img,
            preco_unit: req.body.preco_unit,
            id_cliente: req.body.id_cliente
        }
        res.render("checkout", {compra: compra})
    })
    app.post('/finalizar', (req,res) => {
        
        let compra = {
            id_produtos : req.body.id_produtos,
            descricao: req.body.descricao,
            url_img: req.body.url_img,
            preco_unit: req.body.preco_unit,
            id_cliente: req.body.id_cliente,
            qtd_compra : req.body.qtd_compra
        }
        const conn = require("../config/connectionFactory");
        conn.query(`call insert_nota('${compra.id_cliente}','${compra.id_produtos}','${compra.qtd_compra}') `, (err,result) => {
            if(err) console.log(err)
            
            res.render("finalizar");
        })
    }) 
    
}
