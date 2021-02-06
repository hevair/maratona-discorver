function Modal() {
    const modal = document.querySelector('.modal-overlay')
    modal.classList.toggle('active')

}

const Storage = {
    get() {
       return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    },
}

const Transaction = {
    all: Storage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0
        Transaction.all.forEach(tran => {
            if (tran.amount > 0) {
                income += tran.amount
            }
        })
        return income
    },

    expenses() {
        //Subtrair os valores dos gastos
        let expense = 0
        Transaction.all.forEach(tran => {
            if (tran.amount < 0) {
                expense += tran.amount
            }
        })
        return expense
    },

    total() {

        return Transaction.incomes() + Transaction.expenses();

    }
}

const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        // console.log(transaction)
        const tr = document.createElement('tr');

        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index) {
        const CSSClass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrent(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `
        return html
    },

    updateBalance() {
        document.getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrent(Transaction.incomes())
        console.log('updateBalance', Transaction.incomes())
        document.getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrent(Transaction.expenses())
        document.getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrent(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }

}

const Utils = {
    formatCurrent(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

        return signal + value
    },
    formatAmount(value) {

        value = value = Number(value) * 100
        return value

    },

    formatDate(date){
        const formatDate = date.split('-')
        return `${formatDate[2]}/${formatDate[1]}/${formatDate[0]}`
    }
}


const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getVlues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const {description, amount, date} = Form.getVlues()
        
        if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
            throw new Error("Por favor, Preencha todos os campos")
        }

    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    formatFields(){
        let {description, amount, date} = Form.getVlues()

        amount = Utils.formatAmount(amount)

         date = Utils.formatDate(date)

         return {
             description,
             amount,
             date
         }
    },

    submit(e) {
        e.preventDefault()
        
        try {
             Form.validateFields()
            const transaction = Form.formatFields()
            Transaction.add(transaction)
            Form.clearFields()
            Modal()
            App.reload()
            
        } catch (error) {
            alert(error.message)    
        }
    }
}


Storage.get()

const App = {
    init() {

        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()


// Transaction.Remove(0)