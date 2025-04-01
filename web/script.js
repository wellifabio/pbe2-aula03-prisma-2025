const uri = "http://localhost:5000";
var clientes = [];

//Obter clientes da API
fetch(uri + "/clientes")
    .then(resp => resp.json())
    .then(dados => {
        clientes = dados;
    });

//Obter título da API
fetch(uri)
    .then(resp => resp.json())
    .then(dados => {
        document.querySelector("header h1").textContent = dados.titulo;
    });

//Colocar a data de hoje no rodapé
document.querySelector("footer p").textContent = new Date().toLocaleDateString();

//Preencher o main com cards de produtos obtidos da pasta assets no próprio front-end
fetch("./assets/produtos.json")
    .then(resp => resp.json())
    .then(dados => {
        const main = document.querySelector("main");
        dados.forEach(produto => {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <h2>${produto.produto}</h2>
                <img src="${produto.imagem}" alt="${produto.nome}">
                <p>${produto.descricao}</p>
                <p>R$ ${produto.preco.toFixed(2)}</p>
                <button onclick="abrirModalPedido()">Comprar</button>
            `;
            main.appendChild(card);
        });
    });

//Enviar dados do cadastro de clientes para a API
const cadCli = document.querySelector("#novoCli form");
cadCli.addEventListener("submit", e => {
    e.preventDefault();
    const dados = {
        nome: cadCli.nome.value,
        cpf: cadCli.cpf.value != "" ? cadCli.cpf.value : null,
    };
    fetch(uri + "/clientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    }).then(resp => resp.status)
        .then(status => {
            if (status == 201) {
                alert("Cliente cadastrado com sucesso!");
            } else {
                alert("Erro ao cadastrar cliente!");
            }
            window.location.reload();
        });

});

//Modal de pedidos
function abrirModalPedido(){
    const body = document.querySelector("body");
    const modal = document.createElement("section");
    modal.id = "novoPedido";
    modal.className = "modal";
    const janela = document.createElement("div");
    janela.className = "janela";
    janela.innerHTML = `
            <div>
                <h2>Novo Pedido</h2>
                <button onclick="window.location.reload()">X</button>
            </div>
            <form>
                <label for="produto">Produto</label>
                <input type="text" name="produto" required>
                <button type="submit">Salvar</button>   
            </form>
    `;
    modal.appendChild(janela);
    body.appendChild(modal);
}