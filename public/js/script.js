options = {}
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, options);
  });
function comprar(produto,id_cliente){
  let compra = {
    produto: JSON.parse(produto),
    id_cliente: id_cliente
  }
  fetch('http://localhost:8080/checkout',{
    method: 'POST',
    body: JSON.stringify(compra),
    headers:{'Content-Type': 'application/json'}
  })
  .then(response => {
    return response.json();
  }).then(data => {
    console.log(JSON.stringify(data))
  }). catch(err => {
    console.log(err);
  })
}