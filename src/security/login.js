import React, { useEffect, useState } from 'react';
import "./security.css"
import BackspaceIcon from '@mui/icons-material/Backspace';

const Login = ({ onLogin }) => {
  const [input, setInput] = useState('');
  const correctPin = '2019';
  const davidPin = '1988'

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("auth")
    if (isAuthenticated === "true") {
      window.location.href = '/task-manager';
    }
  }, [])


  useEffect(()=>{

    console.log(input)
  },[input])


  const handleBackspaceClick = () => {
    setInput((prevInput) => prevInput.slice(0, -1));
    const dotIndex = input.length - 1;
    const dotElement = document.getElementById(`dot-${dotIndex}`);
    if (dotElement) {
      dotElement.classList.remove('active');
    }
  };

  const handleNumberClick = (index) => {
    const enteredNumber = index ; // Correctly adjust the entered number
    console.log(enteredNumber);
    setInput((prevInput) => prevInput + enteredNumber);

    const dotIndex = input.length; // Adjust indexing here

    const dotElement = document.getElementById(`dot-${dotIndex}`);
    if (dotElement) {
      dotElement.classList.add('active');
    }
  };

  const handleEnterClick = () => {
    console.log("code entered", input);
    if (input !== correctPin && input !== davidPin) {
      document.body.classList.add('wrong');
      setTimeout(()=>{
        document.body.classList.remove('wrong', 'correct');
        setInput('');
         document.querySelectorAll('.dot').forEach((dot) => {
               dot.classList.remove('active', 'wrong', 'correct');
              });
      },1000)
     
    } else {
      document.body.classList.add('correct');
      console.log("correct");
      onLogin(input);
    }
  }

  const handleNumberButtonClick = (index) => {
    console.log("check index,", index);
    const numberElement = document.getElementById(`number-${index}`);
    
    if (numberElement) {
      numberElement.classList.add('grow');
    }
  
    handleNumberClick(index);
  
    setTimeout(() => {
      const dotIndex = input.length;
      const dotElement = document.getElementById(`dot-${dotIndex}`);
      console.log(dotElement);
  
      if (dotElement) {
        dotElement.classList.add('active');
      }
  
  
      if (numberElement) {
        numberElement.classList.remove('grow');
      }
    }, 1000);
  };
  

  return (
    <div id="pin" className="pin-container">
      <div className="dots">
        {[...Array(4).keys()].map((_, index) => (
          <div key={index} id={`dot-${index}`} className="dot"></div>
        ))}
      </div>
      <p>Enter the password</p>
      <div className="numbers">
      <div
            key={1}
            id={`number-${1}`}
            className="number"
            onClick={() => handleNumberButtonClick(1)}
          >
            {1}
          </div>

          <div
            key={2}
            id={`number-${2}`}
            className="number"
            onClick={() => handleNumberButtonClick(2)}
          >
            {2}
          </div>
          <div
            key={3}
            id={`number-${3}`}
            className="number"
            onClick={() => handleNumberButtonClick(3)}
          >
            {3}
          </div>
          <div
            key={4}
            id={`number-${4}`}
            className="number"
            onClick={() => handleNumberButtonClick(4)}
          >
            {4}
          </div>
          <div
            key={5}
            id={`number-${5}`}
            className="number"
            onClick={() => handleNumberButtonClick(5)}
          >
            {5}
          </div>
          <div
            key={6}
            id={`number-${6}`}
            className="number"
            onClick={() => handleNumberButtonClick(6)}
          >
            {6}
          </div>
          <div
            key={7}
            id={`number-${7}`}
            className="number"
            onClick={() => handleNumberButtonClick(7)}
          >
            {7}
          </div>
          <div
            key={8}
            id={`number-${8}`}
            className="number"
            onClick={() => handleNumberButtonClick(8)}
          >
            {8}
          </div>
          <div
            key={9}
            id={`number-${9}`}
            className="number"
            onClick={() => handleNumberButtonClick(9)}
          >
            {9}
          </div>
          <div
            id={`number-${10}`}
            className="number-blank-space"
          >
            {/* {0} */}
          </div>
          <div
            key={0}
            id={`number-${0}`}
            className="number"
            onClick={() => handleNumberButtonClick(0)}
          >
            {0}
          </div>
          <div
          
            className="number"
            onClick={()=>handleBackspaceClick()}
          >
          <BackspaceIcon />
          </div>
  
      </div>
      <button className="enter-button" onClick={handleEnterClick}>
        Enter
      </button>
    </div>
  );
};

export default Login;
