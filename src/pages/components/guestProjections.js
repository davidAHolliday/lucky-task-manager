import React, { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // justifyContent: 'center',
    padding: '20px',
    backgroundColor:"white",
    height:"100vh"
  };
  
  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    textAlign: 'center',
    marginTop: '20px',
  };
  
  const thStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    backgroundColor: '#176B87',
    color:"white"
  };
  
  const tdStyle = {
    fontSize:"large",
    border: '1px solid #ddd',
    padding: '8px',
  };
  
  const inputStyle = {
    fontSize:'large',
    width: '40px',
    marginBottom: '5px', // Added margin for better spacing
  };
  
  const circleStyle = {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5px',
    fontSize: '16px',
  };
  
  // Media Query for smaller screens (e.g., iPhone 13)
  const mediaQueryStyle = {
    '@media (max-width: 414px)': {
      inputStyle: {
        width: '30px', // Adjust width for smaller screens
      },
      circleStyle: {
        width: '50px', // Adjust width for smaller screens
        height: '50px', // Adjust height for smaller screens
        fontSize: '14px', // Adjust font size for smaller screens
      },
    },
  };
  


function GuestProjections() {
  const [prevValue, setPrevValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [percentageDiff, setPercentageDifference] = useState(null);
  const [daysValue, setDaysValue] = useState({
    mon: '',
    tue: '',
    wed: '',
    thur: '',
    fri: '',
    sat: '',
    sun: '',
  });


  const handleNavigate =()=>{
    window.location.href = '/task-manager'
   }

  const handleInputChange = (type, e) => {
    if (type === 'prev') {
      setPrevValue(e.target.value);
    }

    if (type === 'current') {
      setCurrentValue(e.target.value);
    }
    if (type === 'mon') {
      setDaysValue((prev) => ({
        ...prev,
        mon: e.target.value,
      }));
    }
    if (type === 'tue') {
      setDaysValue((prev) => ({
        ...prev,
        tue: e.target.value,
      }));
    }
    if (type === 'wed') {
      setDaysValue((prev) => ({
        ...prev,
        wed: e.target.value,
      }));
    }
    if (type === 'thur') {
      setDaysValue((prev) => ({
        ...prev,
        thur: e.target.value,
      }));
    }
    if (type === 'fri') {
      setDaysValue((prev) => ({
        ...prev,
        fri: e.target.value,
      }));
    }
    if (type === 'sat') {
      setDaysValue((prev) => ({
        ...prev,
        sat: e.target.value,
      }));
    }
    if (type === 'sun') {
      setDaysValue((prev) => ({
        ...prev,
        sun: e.target.value,
      }));
    }
  };

  const calculateDiff = () => {
    if (prevValue !== '' && currentValue !== '') {
      const current = parseFloat(prevValue) + parseFloat(currentValue);
      const diff = current - parseFloat(prevValue);
      const percentageDiff = (diff / parseFloat(prevValue)) * 100;
      setPercentageDifference(percentageDiff.toFixed(2));
    } else {
      setPercentageDifference(null);
    }
  };

  const label = [
    {value:"mon",label:"Monday"},
    {value:"tue",label:"Tuesday"},
    {value:"wed",label:"Wednesday"},
    {value:"thur",label:"Thursday"},
    {value:"fri",label:"Friday"},
    {value:"sat",label:"Saturday"},
    {value:"sun",label:"Sunday"},
  ]

  return (
    <div style={containerStyle}>
        <HomeIcon onClick={()=>handleNavigate()}/>
        
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Previous Guest Count</th>
            <th style={thStyle}>Guest Differences (+/-)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>
              <input
                type="text"
                value={prevValue}
                onChange={(e) => handleInputChange('prev', e)}
                style={inputStyle}
              />
            </td>
            <td style={tdStyle}>
              <input
                type="text"
                value={currentValue}
                onChange={(e) => handleInputChange('current', e)}
                style={inputStyle}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={calculateDiff}
      >
        Calculate
      </button>
      <h1>Differences In Guest Count</h1>
      {prevValue && currentValue && (
        <h2>
          Last Week your actual guest count was{' '}
          {parseFloat(prevValue) + parseFloat(currentValue)}
        </h2>
      )}
      {percentageDiff !== null && (
        <div>
          <div>
            <span style={circleStyle}>{percentageDiff}%</span>
          </div>
        </div>
      )}
      <table style={tableStyle}>
        <thead>
          <tr>
          <th style={thStyle}>Day</th>
        <th style={thStyle}>Projections</th>
      <th style={thStyle}>Modified</th>
      <th style={thStyle}>Diff (+/-)</th>

          </tr>
        </thead>
        <tbody>
         
         {label.map((day,index)=>{
            return(
                <tr style={{backgroundColor:index % 2 == 0? "#86B6F6":"#B4D4FF"}}>
                <td style={tdStyle}>{day.label}</td>
                <td style={tdStyle}>
                  <input
                    type="text"
                    value={daysValue[day.value]}
                    onChange={(e) => handleInputChange(day.value, e)}
                    style={inputStyle}
                  />
    
                </td>
    
                <td style={tdStyle}>
                  {daysValue[day.value] === '' || isNaN(daysValue[day.value])
                    ? '-'
                    : Math.floor(
                        parseFloat(daysValue[day.value]) * (1 + percentageDiff / 100)
                      )}
                </td>
                <td>{Math.floor(
                        parseFloat(daysValue[day.value]) * (1 + percentageDiff / 100)
                      )-(parseFloat(daysValue[day.value]))}</td>
              </tr>
            ) })}


   
           
        </tbody>
      </table>
    </div>
  );
}

export default GuestProjections;