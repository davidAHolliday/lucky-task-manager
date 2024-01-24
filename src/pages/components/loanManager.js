import { Card, Grid, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

export const LoanManager = () => {
    const [data, setData] = useState([]);

    const fetchActiveLoans = () => {
        const url = "http://localhost:8080/banking/v1/loans";
        return axios.get(url)
            .then(response => response.data)
            .catch(error => {
                console.error(error);
                return [];
            });
    }

    const fetchLoans = (loanId) => {
        const url = `http://localhost:8080/banking/v1/summary/${loanId}`;
        const response = axios.get(url)
            .then(response => response.data)
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

                setData(displayList);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

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
            {data.map((record) => (
                <Card style={{ padding: 10 }} key={record.loanId}>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="button" style={{ marginBottom: 8 }}>Today's Money</Typography>
                                <Typography variant="h5">${record.originalAmount}</Typography>
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
                    <Typography variant="button" style={{ marginTop: 16 }}>+55%</Typography>
                    <Typography variant="body2" style={{ color: 'green' }}>since yesterday</Typography>
                </Card>
            ))}
        </>
    );
}

export default LoanManager;
