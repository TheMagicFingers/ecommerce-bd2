
module.exports = app => {
    
    //INDEX - Mostra todos os produtos
    app.get('/', (req, res) => {
        const conn = require("../config/connectionFactory");
        conn.query(`select * from produtos`, (err,result) =>{
            if(err) console.log(err)
           res.render("index",{ data : result})
        })
    })
    app.get('/produtos/:id', (req,res) => {
        const conn = require("../config/connectionFactory");
        let id = req.params.id

        conn.query(`select * from produtos where id_produtos = ${id}`, (err,result) =>{
            if(err) console.log(err)
           res.render("produto",{produto : result})
        })
    })
     //NEW - adiciona um produto
     app.post('/produtos/new',(req,res) => {
        const conn = require("../config/connectionFactory");

        let produto = {
            descricao:req.body.descricao,
            preco_unit: req.body.preco_unit,
            qtd_est:'0',
            url_img: req.body.url_img
        }

        conn.query(`insert into produtos(descricao,preco_unit,qtd_est,url_img) 
        values('${produto.descricao}',${produto.preco_unit},${produto.qtd_est},'${produto.url_img}')`,(err,result) => {
            if (err) console.log(err)
            console.log("Produto adicionado no BD")
            res.redirect("/")
        })
    })

    app.delete('/produtos/:id/delete', (req,res) => {
        const conn = require("../config/connectionFactory");
        let id = req.params.id

        conn.query(`delete from produtos where id_produtos = ${id}`,(err,result) => {
            if (err) console.log(err)
            console.log("Produto removido no BD")
            res.redirect("/")
        })
    })
}