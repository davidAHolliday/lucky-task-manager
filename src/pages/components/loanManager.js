import { Box, Button, Card, FormControl, Grid,  MenuItem,  Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { formatDate } from '../../utils/helperFunctions';

export const LoanManager = () => {
    const [data, setData] = useState([]);
    const [toast,setToast] = useState({display:false, message:""})
    const [update,setUpdate] = useState(false)
    const [selectedValue, setSelectValue] = useState('')
    const [formData, setFormData] = useState({
        firstName:'',
        lastName: '',
        email: '',
        phone: '',
      });
      const [formDataLoan, setFormDataLoan] = useState({
        clientId:'',
        originalAmount: '',
        interestRate: '',
        term: '',
      });

    const fetchActiveLoans = () => {
        const url = "http://localhost:8080/banking/v1/loans";
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

        const formattedString = `ClientID: ${payload.clientId}, Amount: ${payload.originalAmount}, Term: ${payload.term}, Interest Rate: ${payload.interestRate}`;

        // Log or use the formatted string as needed
        window.alert(`Payload: ${formattedString}}`)
    }

    const handleSubmit=()=>{
        const formattedString = `First Name: ${formData.firstName}, Last Name: ${formData.lastName}, Email: ${formData.email}, Phone: ${formData.phone}`;

        // Log or use the formatted string as needed
        window.alert(`Payload: ${formattedString}}`)
    }



    const handleSelectChange =(event)=>{
        
        setSelectValue(event.target.value)
    }

    const clients = [
        {name:'Oliver Hansen',   value:"1"},     
        {name:'Van Henry', value:"2"},
        {name:'mike', value:"3"},
        {name:'Joh Henry', value:"4"},
        {name:'Ull Henry', value:"5"},

     
      ];


    const handleQuickPayment = (id,paymentAmount) => {
        const url = "http://localhost:8080/banking/v1/transactions";
        return axios.post(url,{
            loanId: id,
            type:"Payment",
            amount: paymentAmount,
            note:"Quick Payment"

        })
            .then(response => {
                console.log(response.data)
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
        const url = "http://localhost:8080/banking/v1/transactions";
        return axios.post(url,{
            loanId: id,
            type:"Interest",
            amount: paymentAmount,
            note:"Quick Interest"

        })
            .then(response =>{ 
                console.log(response.data)
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
        const url = `http://localhost:8080/banking/v1/summary/${loanId}`;
        const response = axios.get(url)
            .then(response =>
                response.data)
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

        fetchData();
    }, [update]);

    console.log(data);

    const styles = {
        card: {
          margin: '10px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f0f8ff', // Light blue background
          color: '#808080', // Silver text color
          width:"700px",
        },
        header:{
            backgroundColor:"blue",
            color:"white",
            height:"25px",
            padding:'20px',
            marginTop:'0',
            
        },
        contentContainer:{
            display:"flex",
            flexDirection:"row"

        },
        infoLeft:{
            backgroundColor:"orange"

        }
      };

      return (
        <>
{toast.display && (
  <div className="toast">
    <h1>{toast.message}</h1>
  </div>
)}

{/* ADD CLIENT */}
  <Card style={{ padding: 20}}>
    <Typography variant='h4' padding={1}>Add Client</Typography>
  <Box sx={{ flexGrow: 1 }}>
    <FormControl>
        <Grid container spacing={1}>
            <Grid xs={5} marginBottom={5} marginRight={1} >
            <TextField fullWidth id='firstName' label="First Name" varient="outlined" onChange={handleInputChange}/>
            </Grid> 
            <Grid xs={5} >
                <TextField fullWidth id='lastName' label="Last Name" varient="outlined" onChange={handleInputChange}/>
            </Grid>
            <Grid xs={5} marginBottom={5} marginRight={1} >
                <TextField type="email" fullWidth id='email' label="Email" varient="outlined" onChange={handleInputChange}/>
            </Grid>
            <Grid xs={5} >
                <TextField type="tel" fullWidth id='phone' label="Phone" varient="outlined" onChange={handleInputChange}/>
            </Grid>
        </Grid>

        <Button onClick={handleSubmit}>Submit</Button>
    </FormControl>
    </Box>
    </Card>

{/* ADD LOAN */}
    <Card style={{ padding: 20}}>
    <Typography variant='h4' padding={1}>Add Loan</Typography>
  <Box sx={{ flexGrow: 1 }}>
    <FormControl>
        <Grid container spacing={1}>
            <Grid xs={6} marginBottom={5} marginRight={1} >
            <Select
    value={selectedValue.value}
    onChange={(e) => handleSelectChange(e)}
    variant="outlined"
    style={{ width: '100%' }}
>
    {clients.map((user, index) => (
        <MenuItem name={user.name} value={user.value}>
            {user.name}
        </MenuItem>
    ))}
</Select>

            </Grid>
            <Grid xs={5} >
                <TextField fullWidth id='originalAmount' label="Loan Amount" varient="outlined" onChange={handleLoanInputChange}/>
            </Grid>
            <Grid xs={5} marginBottom={5} marginRight={1} >
                <TextField fullWidth id='interestRate' label="Interest Rate" varient="outlined" onChange={handleLoanInputChange}/>
            </Grid>
            <Grid xs={5} >
                <TextField fullWidth id='term' label="Term" varient="outlined" onChange={handleLoanInputChange}/>
            </Grid>
        </Grid>
        <Button type="submit" onClick={handleNewLoanSubmit}>Submit</Button>
    </FormControl>
    </Box>
    </Card>
{data.sort((a,b)=> a.summary.balance - b.summary.balance)
  .map((record, index) => (                <Card style={{ padding: 10, marginTop:"10px" ,backgroundColor:index %2 ==0? "#ADD8E6":""
         }} key={record.loanId}>
                    <div style={{width:"700px",display:"flex",flexDirection:"row"}} className='record'> 
                    <div  style={{display:"flex",flexDirection:"column"}}className='record-head'>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="button" style={{ marginBottom: 8 }}>Balance</Typography>
                                <Typography variant="h5">${record.summary.balance}</Typography>
                                <Typography variant="button" style={{ marginTop: 16 }}>Payments Left:{record.summary.paymentsleft}</Typography>

                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <div style={{ marginRight: 16 }}>
                                    <i className="ni ni-money-coins"></i>
                                </div>
                            </div>
                        </Grid>
                    </Grid>
                    </div>

                            <div style={{  width:"90%" }}>
                            <h1 style={{textAlign:"center", color:"green"}} >${record.summary.paymentAmount} </h1>
                                <h1 style={{textAlign:"center"}} >{record.summary.client.firstName} {record.summary.client.lastName}</h1>
                                <p style={{textAlign:"center"}}>{record.summary.loan.loanId}</p>
                                <p style={{ textAlign: "center", color: 'blue' }}>
  last update: 
  
  {record.summary.loan.transactions.length > 0 && (
  <>
    {formatDate(record.summary.loan.transactions.slice(-1)[0].createDate)} $
    {record.summary.loan.transactions.slice(-1)[0].amount}{' '}
    {record.summary.loan.transactions.slice(-1)[0].note}
  </>
)}
</p>
               

                            </div>
                            <div style={{ display:"grid", width:"10%",alignContent:"space-between" }}>
                              <button onClick={()=>handleQuickPayment(record.summary.loan.loanId,record.summary.paymentAmount)} style={{justifySelf:"start",height:"40px"}}>
                                Quick Payment</button>
                                <button onClick={()=>handleQuickInterest(record.summary.loan.loanId,record.summary.loan.interestRate * 100)} style={{justifySelf:"end",height:"40px"}}>
                                Interest Only</button>


               

                            </div>
                  
                    </div>

                </Card>

            ))}
        </>
    );
}

export default LoanManager;
