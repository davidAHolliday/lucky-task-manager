import React, { useEffect, useState } from 'react';

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor:"blue",
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
    backgroundColor: '#f2f2f2',
  };
  
  const tdStyle = {
    border: '1px solid #ddd',
    padding: '8px',
  };
  
  const inputStyle = {
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
  
  const landscapeStyles = {
    // Landscape mode styles
    transform: 'rotate(-90deg)',
    transformOrigin: 'left top',
    width: '100vh',
    height: '100vw',
    overflowX: 'hidden',
    position: 'absolute',
    top: '100%',
    marginTop: '-100vw',
    left: 0,
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



  useEffect(() => {
    // Add a class to the body element when the component mounts
    document.body.classList.add('landscape-mode');

    // Cleanup: Remove the class when the component unmounts
    return () => {
      document.body.classList.remove('landscape-mode');
    };
  }, []);


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

  return (
    <div style={{ ...(containerStyle), ...(document.body.classList.contains('landscape-mode') && landscapeStyles) }}>
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
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Mon</th>
            <th style={thStyle}>Tue</th>
            <th style={thStyle}>Wed</th>
            <th style={thStyle}>Thurs</th>
            <th style={thStyle}>Fri</th>
            <th style={thStyle}>Sat</th>
            <th style={thStyle}>Sun</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>Projections</td>
            <td style={tdStyle}>
              <input
                type="text"
                value={daysValue.mon}
                onChange={(e) => handleInputChange('mon', e)}
                style={inputStyle}
              />
            </td>
            <td style={tdStyle}>
              <input
                type="text"
                value={daysValue.tue}
                onChange={(e) => handleInputChange('tue', e)}
                style={inputStyle}
              />
            </td>

            <td style={tdStyle}>
              <input
                type="text"
                value={daysValue.wed}
                onChange={(e) => handleInputChange('wed', e)}
                style={inputStyle}
              />
            </td>
            <td style={tdStyle}>
              <input
                type="text"
                value={daysValue.thur}
                onChange={(e) => handleInputChange('thur', e)}
                style={inputStyle}
              />
            </td>
            <td style={tdStyle}>
              <input
                type="text"
                value={daysValue.fri}
                onChange={(e) => handleInputChange('fri', e)}
                style={inputStyle}
              />
            </td>
            <td style={tdStyle}>
              <input
                type="text"
                value={daysValue.sat}
                onChange={(e) => handleInputChange('sat', e)}
                style={inputStyle}
              />
            </td>
            <td style={tdStyle}>
              <input
                type="text"
                value={daysValue.sun}
                onChange={(e) => handleInputChange('sun', e)}
                style={inputStyle}
              />
            </td>
          </tr>
          <tr>
            <td style={tdStyle}>Modified</td>
            <td style={tdStyle}>
              {daysValue.mon === '' || isNaN(daysValue.mon)
                ? '-'
                : Math.floor(
                    parseFloat(daysValue.mon) * (1 + percentageDiff / 100)
                  )}
            </td>
            <td style={tdStyle}>
              {daysValue.tue === '' || isNaN(daysValue.tue)
                ? '-'
                : Math.floor(
                    parseFloat(daysValue.tue) * (1 + percentageDiff / 100)
                  )}
            </td>
            <td style={tdStyle}>
              {daysValue.wed === '' || isNaN(daysValue.wed)
                ? '-'
                : Math.floor(
                    parseFloat(daysValue.wed) * (1 + percentageDiff / 100)
                  )}
            </td>
            <td style={tdStyle}>
              {daysValue.thur === '' || isNaN(daysValue.thur)
                ? '-'
                : Math.floor(
                    parseFloat(daysValue.thur) * (1 + percentageDiff / 100)
                  )}
            </td>
            <td style={tdStyle}>
              {daysValue.fri === '' || isNaN(daysValue.fri)
                ? '-'
                : Math.floor(
                    parseFloat(daysValue.fri) * (1 + percentageDiff / 100)
                  )}
            </td>
            <td style={tdStyle}>
              {daysValue.sat === '' || isNaN(daysValue.sat)
                ? '-'
                : Math.floor(
                    parseFloat(daysValue.sat) * (1 + percentageDiff / 100)
                  )}
            </td>
            <td style={tdStyle}>
              {daysValue.sun === '' || isNaN(daysValue.sun)
                ? '-'
                : Math.floor(
                    parseFloat(daysValue.sun) * (1 + percentageDiff / 100)
                  )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default GuestProjections;