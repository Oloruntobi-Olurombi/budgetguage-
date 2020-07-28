import React, {useState, useEffect} from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';
import { v4 as uuidv4 } from "uuid";



//useEffect let's perform side effects
//runs after every render
//first parameter - callback function (runs after render)
//second parameter - array - for letting react know when to run useEffect
//react re-render when state has changed or props

const initialExpenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : [];


function App() {
                 //****************** State value *******************
                 // all expenses, add expense
                 const [expenses, setExpenses] = useState(initialExpenses);

                 //single expense
                 const [charge, setCharge] = useState("");

                 //single amount
                 const [amount, setAmount] = useState("");

                 //Alert
                 const [alert, setAlert] = useState({show: false})
                 
                 //edit
                 const [edit, setEdit] = useState(false)
                 
                 //edit item
                 const [id, setId] = useState(0);

                 useEffect(()=>{
                   console.log('We called useEffect');
                 localStorage.setItem('expenses', JSON.stringify(expenses));
                 })
                 //****************** functionality ******************
                //handle charge
                 const handleCharge = e =>{
                   
                   setCharge(e.target.value);
                 }
                 //handle amount
                 const handleAmount = e =>{
                   
                   setAmount(e.target.value);
                 }

                 //handle alert
                 const handleAlert = ({type, text}) =>{
                    setAlert({ show: true,type,text});
                    setTimeout(()=>{
                        setAlert({
                          show: false
                        })
                    }, 3000)
                 }

                 //handle submit
                 const handleSubmit = e =>{
                   e.preventDefault();
                   if(charge !== "" && amount > 0){
                      if(edit){
                          let tempExpenses = expenses.map(item => {
                            return item.id === id?{...item, charge, amount} : item
                          })
                          setExpenses(tempExpenses);
                          setEdit(false)
                        handleAlert({ type: "success", text: "Item edited" })
                      }else{
                        const singleExpense = { id: uuidv4(), charge: charge, amount: amount };
                        setExpenses([...expenses, singleExpense])
                        handleAlert({ type: "success", text: "Item add" })
                      }
                     
                     setCharge('');
                     setAmount("");
                   }  else {
                     handleAlert({type:"danger", text:"Charge can't be empty value and amount value has to be bigger than zero"})
                   }
                 }

                 //clear all items
                 const clearItems = () =>{
                  setExpenses([])
                  handleAlert({type: "danger", text: "All items deleted"})
                 }
                 //handle delete
                 const handleDelete = (id) =>{
                  const tempExpenses = expenses.filter(item => item.id !== id);
                  setExpenses(tempExpenses)
                  handleAlert({type: "danger", text:"Item deleted"})
                 }

                 const handleEdit = id =>{
                  let expense = expenses.find(item => item.id === id);
                  let{charge,amount} = expense;
                  setCharge(charge);
                  setAmount(amount);
                  setEdit(true);
                  setId(id);
                 }

                 return (
                   <>

                    {alert.show && <Alert type={alert.type} text={alert.text} /> }
                     <Alert />
                     <h1>budgetGuage</h1>
                     <main className="App">
                       <ExpenseForm 
                       charge={charge} 
                       amount={amount} 
                      handleAmount={handleAmount}
                      handleCharge={handleCharge} 
                      handleSubmit={handleSubmit}
                      edit={edit}
                      />
                       <ExpenseList expenses={expenses}
                          handleDelete={handleDelete}
                          handleEdit={handleEdit}
                          clearItems={clearItems}
                       />
                     </main>

                     <h1>
                       total spending:{" "}
                       <span className="total">
                         {expenses.reduce((acc, currValue) => {
                           return (acc += parseInt(currValue.amount));
                         }, 0)}
                       </span>
                     </h1>
                   </>
                 );
               }

export default App;
