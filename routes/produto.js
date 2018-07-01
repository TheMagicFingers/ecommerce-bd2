module.exports = app => {
    //INDEX - Mostra todos os produtos
    app.get('/api/produtos', (req, res) => {
        let connection = app.infra.connectionFactory()
        let listaDB = app.infra.ListaDB

        listaDB.listaTodosProdutos(connection, (err, result) => {
            if (err) console.log(err)
            res.json(result)
        })
    })
    //NEW - adiciona um produto
    app.post('/api/produtos',(req,res) => {
        let connection = app.infra.connectionFactory()
        let listaDB = app.infra.ListaDB

        let produto = {
            descricao:req.body.descricao,
            preco_unit: req.body.preco_unit,
            qtd_est:'0',
            url_img: req.body.url_img
        }

        listaDB.insereProduto(connection, produto, (err,result) => {
            if (err) console.log(err)
            console.log("Produto adicionado no BD")
            res.json(result)
        })
    })
    // SHOW - mostra apenas um produto pelo id
    app.get('/api/produtos/:id', (req,res) => {
        let connection = app.infra.connectionFactory()
        let listaDB = app.infra.ListaDB
        let id = req.params.id

        listaDB.procuraPorId(connection,id, (err, result) => {
            if(err) return err
            res.json(result)
        })
    })
    //EDIT - mostra form de editar
    app.get('/api/produtos/:id/edit', (req,res) => {
        let connection = app.infra.connectionFactory()
        let listaDB = app.infra.ListaDB
        let id = req.params.id

        listaDB.procuraPorId(connection, id, (err, result) => {
            if(err) return err
            res.json(result)
        })
    })
    //UPDATE - atualizar o produto
    app.patch('/api/produtos/:id', (req,res) => {
        let connection = app.infra.connectionFactory()
        let listaDB = app.infra.ListaDB
        
        let produto = {
            id:req.params.id,
            descricao:req.body.descricao,
            preco_unit: req.body.preco_unit,
            qtd_est:req.body.qtd_est,
            url_img: req.body.url_img
        }

        listaDB.editarProduto(connection, produto, (err, result) => {
            if(err) return err
            res.json(result)
        })
    })
    //DESTROY - deleta produto do id
    app.delete('/api/produtos/:id/delete', (req,res) => {
        let connection = app.infra.connectionFactory()
        let listaDB = app.infra.ListaDB
        let id = req.params.id

        listaDB.deletaProduto(connection,id, (err, result) => {
            if(err) return err
            res.json(result)
        })
    })
    
}