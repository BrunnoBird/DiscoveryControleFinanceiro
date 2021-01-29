const Modal = {
    open(){
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

    },
    close(){
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    }

    // toggle consigo substituir o remove por essa função (implementar depois )
}

const transactions = [
    {
    id: 1,
    description: 'Luz',
    amount: -50000,
    date: '23/01/2021',
    },
    {
    id: 2,
    description: 'Website',
    amount: 500000,
    date: '23/01/2021',
    },
    {
    id: 3,
    description: 'Internet',
    amount: -20000,
    date: '23/01/2021',
    },
]

const Transactional = {
    incomes(){
        //somar as entradas
    },
    expenses(){
        //somar as saidas
    },
    total(){
        //entradas - saidas
    },
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index){ // criar uma TR
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTrasaction(transaction);

        DOM.transactionsContainer.appendChild(tr); // coloco como filho o TR
    },

    // forma de colocar mudar os gastos para lucros
    innerHTMLTrasaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${transaction.amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover transação">
            </td>
        `

        // para usar em outro lugar preciso jogar para fora a função um retorno
        return html;
    }
}

const Utils = {
    //formatação da moeda
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "";
    }
}
// automação para reenderizar os elementos na tabela
transactions.forEach(function(transaction) {
    DOM.addTransaction(transaction);
});