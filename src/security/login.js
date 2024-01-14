import React, { useEffect, useState } from 'react';
import "./security.css"

const Login = ({onLogin}) => {
  const [input, setInput] = useState('');
  const correctPin = '2019';


useEffect(()=>{
  const isAuthenticated = sessionStorage.getItem("auth")
  if(isAuthenticated==="true"){
    window.location.href = '/task-manager';
  }



},[])

  const handleNumberClick = (index) => {
    console.log(index + 1);
    setInput((prevInput) => prevInput + (index + 1));

    const dotIndex = input.length; // Adjust indexing here

    const dotElement = document.getElementById(`dot-${dotIndex}`);
    if (dotElement) {
      dotElement.classList.add('active');
    }
  };

  const handleEnterClick = () => {
    console.log("code entered", input);
    if (input !== correctPin) {
      document.body.classList.add('wrong');
      console.log("wrong");
    } else {
      document.body.classList.add('correct');
      console.log("correct");
      onLogin(input)
    }

    setTimeout(() => {
      document.body.classList.remove('wrong', 'correct');
      setInput('');
      document.querySelectorAll('.dot').forEach((dot) => {
        dot.classList.remove('active', 'wrong', 'correct');
      });
    }, 1000);
  };

  const handleNumberButtonClick = (index) => {
    document.getElementById(`number-${index}`).classList.add('grow');
    handleNumberClick(index);
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
        {[...Array(9).keys()].map((index) => (
          <div
            key={index}
            id={`number-${index}`}
            className="number"
            onClick={() => handleNumberButtonClick(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>
      <button className="enter-button" onClick={handleEnterClick}>
        Enter
      </button>
    </div>
  );
};
export default Login;
