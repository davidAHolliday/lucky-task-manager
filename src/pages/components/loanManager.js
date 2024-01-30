import { Box, Button, Card, FormControl, Grid,  MenuItem,  Select, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseUrl, formatDate } from '../../utils/helperFunctions';
import  { BackCard, FlipCardComponent, FrontCard } from './flipCard';
import { flexbox } from '@mui/system';

export const LoanManager = () => {
    const [data, setData] = useState([]);
    const [isAddClient, setIsAddClient] = useState(true);
    const [toast,setToast] = useState({display:false, message:""})
    const [update,setUpdate] = useState(false)
    const [clientList, setClientList] = useState([])
    const [selectedValue, setSelectValue] = useState('')
    const [collectedToday,setCollectedToday] = useState(0)
    const [flipTrigger,setFlipTrigger] = useState({});
    const [flipTriggerSolo,setFlipTriggerSolo] = useState({});
    const [transactionData,setTransactionData] = useState([])
    const [updateTrans,setUpdateTrans] = useState(false);

    const [flipTriggerCollection,setFlipTriggerCollection] = useState({})
    const [formData, setFormData] = useState({
        firstName:'',
        lastName: '',
        email: '',
        phoneNumber: '',
      });
      const [formDataLoan, setFormDataLoan] = useState({
        clientId:'',
        originalAmount: '',
        interestRate: '',
        term: '',
      });


    const fetchClients = () =>{
        const url = `${baseUrl}/banking/v1/clients`;
        axios.get(url)
        .then(response =>{
            const mapToValues = []
            response.data.map(data=>{
             const  {clientId, firstName,lastName} = data;
             const id = clientId
             mapToValues.push({name:`${firstName} ${lastName}`, value:`${id}`})
            })
            setClientList(mapToValues)

            }).catch(error=>{
            console.log("ERROR: ", error)
        })


    }

    const fetchTransactions = () =>{
      const url = `${baseUrl}/banking/v1/transactions`;
      axios.get(url)
      .then(response =>{
          setTransactionData(response.data)

          }).catch(error=>{
          console.log("ERROR: ", error)
      })

  }

    const fetchCollectionAmount = () =>{
      const url = `${baseUrl}/banking/v1/admin`;
      axios.get(url)
      .then(response =>{
            setCollectedToday(response.data.dailyCollection)
          
          
          })

          .catch(error=>{
          console.log("ERROR: ", error)
      })


  }

  const addToCollectedAmount = (amount) =>{
    const url = `${baseUrl}/banking/v1/admin/collections/${amount}`;
    axios.put(url,[])
    .then(response =>response.data)

        .catch(error=>{
        console.log("ERROR: ", error)
    })


}

const resetCollectedAmount = () =>{
  const url = `${baseUrl}/banking/v1/admin/collections/reset`;
  axios.put(url,[])
  .then(response =>{
      setUpdate(prev=>!prev)
      })

      .catch(error=>{
      console.log("ERROR: ", error)
  })


}

    const fetchActiveLoans = () => {
        const url = `${baseUrl}/banking/v1/loans`;
        return axios.get(url)
            .then(response => response.data)
            
            .catch(error => {

                console.error(error);
                return [];
            });
    }

    const handleLoanInputChange =(event)=>{
        const {id, value} = event.target
        setFormDataLoan((prev)=>({
            ...prev,
            [id]:value,
        }))
    }

    const handleInputChange = (e) =>{
        const {id, value } = e.target;
        setFormData((prevData)=> ({
            ...prevData,
            [id]:value,
        }))
    };
    

    const handleNewLoanSubmit=()=>{
        const payload = {
            clientId: selectedValue,
            originalAmount: formDataLoan.originalAmount,
            term: formDataLoan.term,
            interestRate: formDataLoan.interestRate
        }

        const url = `${baseUrl}/banking/v1/loans`;
        axios.post(url,payload)
        .then(response =>{

            window.alert(`The following loan was added: ${payload.originalAmount} ${payload.clientId}`)
            setUpdate(prev=>!prev)

        })

    }

    const handleSubmit=()=>{
        const url = `${baseUrl}/banking/v1/clients`;
        axios.post(url,formData)
        .then(response =>{
            window.alert(`The following client was added: ${formData.firstName} ${formData.lastName}`)
            setUpdate(prev=>!prev)

        })


        const formattedString = `First Name: ${formData.firstName}, Last Name: ${formData.lastName}, Email: ${formData.email}, Phone: ${formData.phoneNumber}`;

        // Log or use the formatted string as needed
        window.alert(`Payload: ${formattedString}}`)
        setFormData({
          firstName:"",
          lastName:"",
          phoneNumber:"",
          email:""
        })
    }

    const toggleForm = () => {
        setIsAddClient(!isAddClient);
      };
    
    


    const handleSelectChange =(event)=>{
        
        setSelectValue(event.target.value)
    }




    const handleQuickPayment = (id,paymentAmount) => {
      addToCollectedAmount(paymentAmount)
        const url = `${baseUrl}/banking/v1/transactions`;
        return axios.post(url,{
            loanId: id,
            type:"Payment",
            amount: paymentAmount,
            note:"Quick Payment"

        })
            .then(response => {
                setToast({display:true,message: "Successfully Made a Payment"})
                setTimeout(()=>{
                    setToast({display:false,message: ""})
                    setUpdate(prev=>!prev)
                },3000)

            })
            .catch(error => {
                console.error(error);
                return [];
            });
    }

    const handleQuickInterest = (id,paymentAmount) => {
        const url = `${baseUrl}/banking/v1/transactions`;
        addToCollectedAmount(paymentAmount)

        return axios.post(url,{
            loanId: id,
            type:"Interest",
            amount: paymentAmount,
            note:"Quick Interest"

        })
            .then(response =>{ 
                setToast({display:true,message: "Successfully Made a Interest Only"})
                setTimeout(()=>{
                    setToast({display:false,message: ""})
                    setUpdate(prev=>!prev)
                },3000)
            })
            .catch(error => {
                console.error(error);
                return [];
            });
    }

    const fetchLoans = (loanId) => {
        const url = `${baseUrl}/banking/v1/summary/${loanId}`;
        const response = axios.get(url)
            .then(response =>
                response.data)
            .catch(error => {
                console.error(error);
                return null;
            });
            return response
    }

    const deleteTransactions = (id) => {
      const url = `${baseUrl}/banking/v1/transactions/${id}`;

      // const url = `${baseUrl}/banking/v1/transaction/${id}`;
      const response = axios.delete(url)
          .then(response =>{
            setUpdateTrans(prev=>!prev)
            setToast(true,"Transaction Delete")
            setTimeout(()=>{
              setToast(false,"")
            },2000)

          }
           )
          .catch(error => {
              console.error(error);
              return null;
          });
          return response
  }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activeLoans = await fetchActiveLoans();
                const displayList = [];

                await Promise.all(activeLoans.map(async (loan) => {
                    const summary = await fetchLoans(loan.loanId);
                    if (summary) {
                        displayList.push({  summary });
                    }
                }));

                setData(displayList)
                } catch (error) {
                console.error(error);
            }
        }


fetchCollectionAmount();
        fetchData();
        fetchClients();
        fetchTransactions();
    }, [update]);


    useEffect(()=>{
      fetchTransactions();

    },[updateTrans])
    

    const sortedData = [...data].sort((a, b) => {
      const firstNameA = a.summary.client.firstName.toLowerCase();
      const firstNameB = b.summary.client.firstName.toLowerCase();
      return firstNameA.localeCompare(firstNameB);
    });

      return (
        <div style={{ backgroundColor: '#e3f2fd', height: '100vh', padding: '20px' }}>
          {toast.display && (
            <div className="toast" style={{ backgroundColor: '#64b5f6', color: '#fff' }}>
              <h1>{toast.message}</h1>
            </div>
          )}
    
    {sortedData.map((record,index)=>{
        const lastTransaction = record.summary.loan.transactions.slice(-1)[0];

        const isToday = lastTransaction && lastTransaction.createDate &&
        new Date(lastTransaction.createDate).toDateString() === new Date().toDateString();
        
        const backgroundColor = isToday ? "green" : index % 2 === 0 ? '#bbdefb' : '';
      
      return(
        <FlipCardComponent index={index} setFlipTrigger={setFlipTrigger} flipTrigger={flipTrigger[index]} side={flipTrigger[index]?"front":"back"}>

        { !flipTrigger[index] ?    
              <FrontCard >
                <div style={{display:"flex", flexDirection:"row", backgroundColor:backgroundColor,height:"301px"}} className='card-container-loan'>
                  <div style={{width:"20%",backgroundColor:"",textAlign:"center"}} className='left-stub'>
                          <div style={{display:"flex", flexDirection:"column",fontSize:"30px",height:"33%",backgroundColor:"white", color:"#333",alignItems: 'center', justifyContent: 'center'}}>Balance: <span>{record.summary.balance}</span></div>
                        <div style={{display:"flex", flexDirection:"column",fontSize:"30px",height:"33%",backgroundColor:"white" , color:"#333",alignItems: 'center', justifyContent: 'center'}}>Other</div>
                        <div  style={{display:"flex", flexDirection:"column",fontSize:"30px",height:"33%",backgroundColor:"white" , color:"#333",alignItems: 'center', justifyContent: 'center'}}>
                          Payments Left: {record.summary.paymentsleft.toFixed(2)}
                        </div>
                  </div>
                  <div style={{display:"flex", flexDirection:"column",width:"70%",backgroundColor:"",alignItems: 'center', justifyContent: 'center'}} className='ticket'>
                  <div style={{ fontSize: '', color: 'green' }}>${record.summary.paymentAmount}</div>
                  <div>{record.summary.client.firstName} {record.summary.client.lastName}</div>
                  <div style={{fontFamily:"monospace",fontSize:"15px"}}> _Id: {record.summary.loan.loanId}</div>
                  <div style={{ fontSize: '20px', color: '#2196f3' }}>
                    Last update:{' '}
                    {record.summary.loan.transactions.length > 0 && (
                      <>
                        {formatDate(record.summary.loan.transactions.slice(-1)[0].createDate)} $
                        {record.summary.loan.transactions.slice(-1)[0].amount}{' '}
                        {record.summary.loan.transactions.slice(-1)[0].note}
                      </>
                    )}
                  </div>

                  </div>
                  <div style={{ width: "10%" }} className='right'>
    <button 

    onClick={() => 
      handleQuickPayment(record.summary.loan.loanId, record.summary.paymentAmount)
    }
    style={{ pointerEvents: 'auto',width: '100%', height: '40px', backgroundColor: '#4caf50', marginBottom: '5px' }}
  >
    Quick Payment
  </button>
  <button 
    onClick={() =>
       handleQuickInterest(record.summary.loan.loanId, record.summary.loan.interestRate * 100)
      }
    style={{pointerEvents: 'auto', width: '100%', height: '40px', backgroundColor: '#2196f3', marginTop: 'auto' }}
  >
    Interest Only
  </button>
</div>


                </div>


        
        </FrontCard>
        :
        <BackCard>
  <div className='table-container'>
             <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='table-body'>
                {transactionData.filter((x)=> x.loanId === record.summary.loan.loanId).map((transaction,index)=>{
                  console.log("mapping trans", transaction,record.summary.loan.loanId)
                  return(
                  <TableRow>
                    <TableCell>{formatDate(transaction.createDate)}</TableCell>
                    <TableCell>{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{transaction.note}</TableCell>
                    <TableCell><button onClick={()=>deleteTransactions(transaction.transactionId)}>Delete</button></TableCell>


                  </TableRow>
                  )


                })}
              
              </TableBody>
             </Table>
                    </div>
        </BackCard>     
              
             } 
              </FlipCardComponent>


      )
          

    })}

{[1].map((data, index) => (
  <FlipCardComponent
    key={index}  // Don't forget to add a unique key prop when mapping over elements
    index={index}
    setFlipTrigger={setFlipTriggerSolo}
    flipTrigger={flipTriggerSolo[index]}
    side={flipTriggerSolo[index] ? "front" : "back"}
  >
    {!flipTriggerSolo[index] ? (
      <FrontCard>
        <h1 onClick={()=>console.log("CLICK")}>
          Collected Yesterday $ {collectedToday.toFixed(2)}
          <Button onClick={() => resetCollectedAmount()}>Clear</Button>
        </h1>
      </FrontCard>
    ) : (
      <BackCard>
        <div>{/* Add content for the back side of the card */}</div>
      </BackCard>
    )}
  </FlipCardComponent>
))}





 

        



    
          <div className="card" style={{ marginTop: '20px', transition: 'transform 0.5s', transformStyle: 'preserve-3d' }}>
            <div
              className="content"
              style={{
                transition: isAddClient ? '0.5s' : '',
                transform: isAddClient ? 'rotateY(0deg)' : 'rotateY(180deg)',
              }}
            >
              <div className="front">
                <div
                  className={`card-container ${isAddClient ? 'add-client' : 'add-loan'}`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.5s',
                  }}
                >
                  <div className="card" style={{ transform: isAddClient ? 'rotateY(0deg)' : 'rotateY(180deg)' }}>
                    <FormControl>
                      <Typography variant="h4" padding={1} style={{ color: '#2196f3' }}>
                        Add Loan
                      </Typography>
    
                      <Select
                        value={selectedValue.value}
                        onChange={(e) => handleSelectChange(e)}
                        variant="outlined"
                        style={{ width: '100%' }}
                      >
                        {clientList.map((user, index) => (
                          <MenuItem name={user.name} value={user.value}>
                            {user.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <TextField
                        fullWidth
                        id="originalAmount"
                        label="Loan Amount"
                        variant="outlined"
                        onChange={handleLoanInputChange}
                      />
                      <TextField
                        fullWidth
                        id="interestRate"
                        label="Interest Rate"
                        variant="outlined"
                        onChange={handleLoanInputChange}
                      />
                      <TextField fullWidth id="term" label="Term" variant="outlined" onChange={handleLoanInputChange} />
                      <div className='button-container'>
                      <Button type="submit" onClick={handleNewLoanSubmit} style={{ marginRight:"10px", color:"white",backgroundColor: '#4caf50' }}>
                        Submit
                      </Button>
    
                      <Button onClick={toggleForm} style={{ color:"white",backgroundColor: '#4caf50' }}>
                        Switch to Add Client
                      </Button>
                      </div>

                    </FormControl>
                  </div>
                </div>
              </div>
              <div className="back">
                <div className="card" style={{ transform: isAddClient ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  <FormControl>
                    <Typography variant="h4" padding={1} style={{ color: '#2196f3' }}>
                      Add Client
                    </Typography>
                    <TextField fullWidth id="firstName" label="First Name" variant="outlined" onChange={handleInputChange} />
                    <TextField fullWidth id="lastName" label="Last Name" variant="outlined" onChange={handleInputChange} />
                    <TextField type="email" fullWidth id="email" label="Email" variant="outlined" onChange={handleInputChange} />
                    <TextField type="tel" fullWidth id="phoneNumber" label="Phone" variant="outlined" onChange={handleInputChange} />
    <div className='button-container'>
    <Button onClick={handleSubmit} style={{marginRight:"10px", color:"white", backgroundColor: '#2196f3' }}>
                      Submit
                    </Button>
                    <Button onClick={toggleForm} style={{ color:"white", backgroundColor: '#2196f3'}}>
                      Switch to Add Loan
                    </Button>
                    </div>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default LoanManager;
