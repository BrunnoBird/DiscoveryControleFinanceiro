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
    
const Storage = {
        get() {
            return JSON.parse(localStorage.getItem('dev.finances:transaction')) || [] // transformar uma string em um array novamente. 
        },
        set(transactions) {
            localStorage.setItem("dev.finances:transaction", JSON.stringify(transactions)); //json.stringfy transforma em json as minhas strings
        },
}

const Transaction = {
        all: Storage.get(), // limpar
        add(transaction){
        Transaction.all.push(transaction); // push coloca algo dentro do array

        App.reload();
        console.log(Transaction.all)
    },

    remove(index){
        Transaction.all.splice(index, 1);

        App.reload();
    },

    incomes(){
        let income = 0;
        // pegar todas as transacoes
        // para cada transacao, verificar se a transacao é maior que zero
        Transaction.all.forEach(transaction => {
        // se for maior que zero 
            if(transaction.amount > 0) {
             //somar a uma variavel e retornar a variavel
                income += transaction.amount;
            }

        })
        return income;
    },

    expenses(){
        let expenses = 0;

        Transaction.all.forEach(transaction => {
            if(transaction.amount < 0) {
                expenses += transaction.amount;
            }
        })
        return expenses;
    },

    total(){
        return Transaction.incomes() + Transaction.expenses();
    },
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){ // criar uma TR
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTrasaction(transaction, index);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr); // coloco como filho o TR
    },

    // forma de colocar mudar os gastos para lucros
    innerHTMLTrasaction(transaction, index){ //}{
        const CSSclass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `

        // para usar em outro lugar preciso jogar para fora a função um retorno
        return html;
    },

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes()) // formatCurrency para fazer o tratamento dos valores
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = "";
    }
}

const Utils = {

    formatAmount(value){
        value = Number(value) * 100;
        return value;
    },

    //formatação da moeda
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""
        value = String(value).replace(/\D/g, "") //Rejex -> expressão regular | G = Global para pegar todos | Contra barra \ = Scape | D = tudo oque não é numero

        value = Number(value) / 100 // divisão para deixar as casas decimas 
        value = value.toLocaleString("pt-BR", {
            style: "currency", //moeda
            currency: "BRL" //tipo de moeda
        }) // funcionalidade p

        return signal + value;
    },

    formatDate(date){
        const splittedDate = date.split("-"); // para remover os traços da datas
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}` // colocar a ordem que deseja que apareça
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    validadeFields(){
        const {description, amount, date} = Form.getValues(); // desestruturação
        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor preencha todos os campos");
        } // trim faz  limpeza de espaços vazios
        console.log(description);
    },

    formatValues(){
        let { description, amount, date} = Form.getValues();

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
                description,
                amount,
                date 
            }
    },

    saveTransaction(transaction){
        Transaction.add(transaction);
    },

    clearFields(){
        Form.description.value = "",
        Form.amount.value = "",
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault();

        try {
            //verificar se todas as informacao foram preenchidas
            Form.validadeFields();
            //formatar os dados para salvar
            const transaction = Form.formatValues();
            //salvar
            Transaction.add(transaction);
            //apagar os dados do formulario
            Form.clearFields();
            // modalfeche
            Modal.close();

        } catch (error) {
            alert(error.message);
        }

    }
}


const App = {
    init(){
        // automação para reenderizar os elementos na tabela
        Transaction.all.forEach(DOM.addTransaction);

        DOM.updateBalance();

        Storage.set(Transaction.all);
    },
    reload(){
        DOM.clearTransactions();
        App.init();
    }
}

App.init();