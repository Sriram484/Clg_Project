import React, { useRef, useState, useEffect } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from 'rive-react';
import RivetBear from "../Assets/Rivets/bear4.riv";
import "../Assets/CSS/Login.css";
import "bootstrap/dist/css/bootstrap.min.css"


const STATE_MACHINE_NAME = 'Login Machine';
const LOGIN_PASSWORD = 'teddy';
const LOGIN_TEXT = 'Login';

const LoginTeacherAdmin = (riveProps = {}) => {
    const { rive: riveInstance, RiveComponent } = useRive({
      src: RivetBear,
      stateMachines: STATE_MACHINE_NAME,
      autoplay: true,
      layout: new Layout({
        fit: Fit.Cover,
        alignment: Alignment.Center,
      }),
      ...riveProps,
    });
  
  
    const [passValue, setPassValue] = useState('');
    const [inputLookMultiplier, setInputLookMultiplier] = useState(0);
    const [loginButtonText, setLoginButtonText] = useState(LOGIN_TEXT);
    const inputRef = useRef(null);
  
    const isCheckingInput = useStateMachineInput(
      riveInstance,
      STATE_MACHINE_NAME,
      'isChecking'
    );
    const numLookInput = useStateMachineInput(
      riveInstance,
      STATE_MACHINE_NAME,
      'numLook'
    );
    const trigSuccessInput = useStateMachineInput(
      riveInstance,
      STATE_MACHINE_NAME,
      'trigSuccess'
    );
    const trigFailInput = useStateMachineInput(
      riveInstance,
      STATE_MACHINE_NAME,
      'trigFail'
    );
    const isHandsUpInput = useStateMachineInput(
      riveInstance,
      STATE_MACHINE_NAME,
      'isHandsUp'
    );
  
    // Divide the input width by the max value the state machine looks for in numLook.
    // This gets us a multiplier we can apply for each character typed in the input
    // to help Teddy track progress along the input line
    useEffect(() => {
      if (inputRef.current && !inputLookMultiplier) {
        setInputLookMultiplier(
          inputRef.current.offsetWidth / 100
        );
      }
    }, [inputRef, inputLookMultiplier]);
  
    // As the user types in the username box, update the numLook value to let Teddy know
    // where to look to according to the state machine
    const onSigChange = (e) => {
      const newVal = e.target.value;
      console.log(e.target.name);
      setSigData({
        ...sigData,
        [e.target.name]: newVal,
      });
      if (!isCheckingInput.value) {
        isCheckingInput.value = true;
      }
      const numChars = newVal.length;
      numLookInput.value = numChars * inputLookMultiplier;
    };

  
    // Start Teddy looking in the correct spot along the username input
    const onSigFocus = (event) => {
      const curVal = event.target.value;
      isCheckingInput.value = true;
      if (numLookInput.value !== curVal.length * inputLookMultiplier) {
        numLookInput.value = curVal.length * inputLookMultiplier;
      }
    };
  
    //Sign Up Data Handling
    const [sigData, setSigData] = useState({
      email: '',
      password: ''
    });
  
    // When submitting, simulate password validation checking and trigger the appropriate input from the
    // state machine
    const handleSigSubmit = (e) => {
      e.preventDefault();
      console.log(sigData);
    };
  
  
    //Onblur
    const handleBlur = (e) => {
      isCheckingInput.value = false;
    }

  
    return (
      <>
  
          <div
            className="Auth-form-container"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div className='Riv-container'>
              <RiveComponent className="rive-container" />
            </div>
            <form
              className="Auth-form"
            >
              <div className="Auth-form-content">
                <h3 className="Auth-form-title">Log In</h3>
                <div className="form-group mt-3">
                  <label>Email address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control mt-1"
                    id="email"
                    placeholder="Enter email"
                    value={sigData.email}
                    onChange={onSigChange}
                    onFocus={onSigFocus}
                    onBlur={handleBlur}
                    ref={inputRef}
                  />
                </div>
                <div className="form-group mt-3">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control mt-1"
                    placeholder="Enter password"
                    value={sigData.password}
                    onChange={onSigChange}
  
                    onFocus={() => (isHandsUpInput.value = true)}
                    onBlur={() => (isHandsUpInput.value = false)}
                  />
                </div>
                <div className="d-grid gap-2 mt-3">
                  <button type="submit" className="btn btn-primary" onClick={handleSigSubmit}>
                    Submit
                  </button>
                </div>
                <p className="text-center mt-2">
                  <a href="#">Are you teacher/admin?</a>
                </p>
              </div>
            </form>
          </div>
      </>
    );
  };

export default LoginTeacherAdmin
