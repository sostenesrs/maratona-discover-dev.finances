const Modal={
    open(){ //abrir modal
        document //documento (objeto que abre funcionalidades da DOM)
        .querySelector('.modal-overlay') //procura pelo seletor a classe modal-overlay
        .classList.add('active')            //abre a lista de classes e adiciona a class 'active' ao modal-overlay
    },
    close(){ //fecha o modal
        document.querySelector('.modal-overlay')
        .classList.remove('active')               //remove a class active do modal
    }

    //existe a funcionalidade classlist.toogle e ativa ou desativa
}

//array de objetos (transações feitas), informações saem do html e são substituidas pelas informações dos objetos JS

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions", transactions, JSON.stringify(transactions))
    }
}


/* Objetivo do objeto transaction:
    -somar as entradas
    -somar as saídas
    -abater o valor
    -exibir saldo */


//add o objeto transaction para controlar as transações:
const Transaction = {
        all: Storage.get(),

    add(transaction){
        Transaction.all.push(transaction)
        
        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1) //splice busca a posição no array e a quantidade
        App.reload()
    },


    incomes(){      //  funcionalidade do objeto: soma as entradas
        //pegar todas as transacoes
        //verificar se é maior que zero
        //se sim somar e retornar o total
            let income = 0;

            Transaction.all.forEach(transaction => {
                if(transaction.amount > 0){
                    income = income + transaction.amount;
                }

            })

            return income;
    }, 


    expenses(){     // outra function: soma as saídas
        let expense = 0;
            Transaction.all.forEach(transaction => {
                if(transaction.amount < 0){
                    expense = expense + transaction.amount;
                }
            })
            return expense;
    },

            
    total(){    //  incomes - expenses

        return Transaction.incomes() + Transaction.expenses();
    }

}

const DOM = {
    //funcionalidades do objeto DOM:
    transactionContainer: document.querySelector('#data-table tbody'), //variavel container que absorve os valores que estavam em tbody 

    addTransaction(transaction, index){ //recebe incomes, expense e index
            

            const tr = document.createElement('tr') //add a variavel tr e cria com createEelemnt ('tr')
            tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) //tr dentro do html recebe o valor da função inneerHTMLTransaction do objeto DOM
                                                        //que tem retorno html
            tr.dataset.index=index
            DOM.transactionContainer.appendChild(tr)
            
    },

    innerHTMLTransaction(transaction,index){ 
        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)

                    //mascara que vai ser usada no html, pega-se os dados do objeto transactions e cria a linha na página HTML quando chamada
        const html = ` 
            
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td>
                    <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
                </td>
        `
        return html
    },

    updateBalance(){

        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())
    
        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())
    
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())

    },

    clearTrnasactions(){
        DOM.transactionContainer.innerHTML = ""
    }
}


const Utils = {
    formatAmount(value){
        value = Number(value)*100
        return value
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },


    formatCurrency(value){

        const signal = Number(value) < 0 ? "-" : ""
        
        value = String(value).replace( /\D/g, "") // :\D acha tudo que não é numero e troca por o que esta "", no caso pegou o (-)
        
        value = Number(value)/100

        value = value.toLocaleString("pt-BR", { //passa para o formato de dinheiro
            style: "currency",
            currency: "BRL"
        })

        return signal + value        
    }
}

const Form = {
    description:document.querySelector('input#description'),
    amount:document.querySelector('input#amount'),
    date:document.querySelector('input#date'),

    getValues(){
        return{
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateField(){
        const{description,amount,date} = Form.getValues()
        if(description.trim()===""||
        amount.trim()===""||
        date.trim()===""){
            throw new Error("Preencha todos os campos")
        }
    },

    formatValues(){
        let{description,amount,date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }
        
    },
    
    clearFields(){
    Form.description.value=""
    Form.amount.value=""
    Form.date.value=""

    },




    submit(event){
        event.preventDefault()

        try {
        //verificar se as informações foram preenchidas desc, valor, data
        Form.validateField()
        //formatar os dados para salvar
        const transaction = Form.formatValues()
        //salvar os dados da transação
        Transaction.add(transaction)
        //apaga os dados do formulario para nova transação
        Form.clearFields()
        //modal feche a janela
        Modal.close()
        //atualizar a aplicação > ja esta no add o App.reload()
        

        } catch (error) {
            alert(error.message)
        }


        
        
    }

}




const App = {
    init(){

        Transaction.all.forEach((transaction, index ) =>{
            DOM.addTransaction(transaction)
        })

        DOM.updateBalance()
        
        Storage.set(Transaction.al)
    },

    reload(){
        DOM.clearTrnasactions()
        App.init()

    },
}

App.init()

 //---nova transação que não foi pro html pois está depoi sdo foreach que add na pagina transactions.foreach

//Transaction.remove(4)