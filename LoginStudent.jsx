import React, { useRef, useState, useEffect } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from 'rive-react';
import RivetBear from "../Assets/Rivets/bear4.riv";
import "../Assets/CSS/Login.css";
import "bootstrap/dist/css/bootstrap.min.css"


const STATE_MACHINE_NAME = 'Login Machine';
const LOGIN_PASSWORD = 'teddy';
const LOGIN_TEXT = 'Login';

const LoginStudent = (riveProps = {}) => {
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
  // As the user types in the username box, update the numLook value to let Teddy know
  // where to look to according to the state machine
  const onRegChange = (e) => {
    const newVal = e.target.value;
    console.log(e.target.name);
    setFormDataError({
      emptyName: false,
      emptyEmail: false,
      emptyPassword: false,
      emptyMobileNumber: false,
      wrongEmail: false,
      wrongPassword: false,
      wrongConfirmPassword: false,
      wrongMobile: false
    })
    if (e.target.name === 'confirm-password') {
      setRegConfirmPassword(newVal);
    }
    else {
      setFormData({
        ...formData,
        [e.target.name]: newVal,
      });
      console.log(formData);
    }
    if (!isCheckingInput.value) {
      isCheckingInput.value = true;
    }
    const numChars = newVal.length;
    numLookInput.value = numChars * inputLookMultiplier;
  };

  // Start Teddy looking in the correct spot along the username input
  const onSigFocus = (event) => {
    const curVal = event.target.value;
    setFormDataError({
      emptyName: false,
      emptyEmail: false,
      emptyPassword: false,
      emptyMobileNumber: false,
      wrongEmail: false,
      wrongPassword: false,
      wrongConfirmPassword: false,
      wrongMobile: false
    })
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
    setTimeout(() => {
      if (formDataError.emptyEmail === false || formDataError.emptyMobileNumber === false || formDataError.emptyName === false || formDataError.emptyPassword ||
        formDataError.wrongConfirmPassword === false || formDataError.wrongEmail === false || formDataError.wrongMobile === false
        || formDataError.wrongMobile === false
      ) {
        trigSuccessInput.fire()
      }
      else {
        trigFailInput.fire();
      }
    }, 1500);

    setTimeout(() => {
      sigData.password === "123"
        ? trigSuccessInput.fire()
        : trigFailInput.fire();
      numLookInput.value = 0;
    }, 1500);
    console.log(sigData);
  };

  //Register Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
    type: 'student',
  });
  const [formDataError, setFormDataError] = useState({
    emptyName: false,
    emptyEmail: false,
    emptyPassword: false,
    emptyMobileNumber: false,
    wrongEmail: false,
    wrongPassword: false,
    wrongConfirmPassword: false,
    wrongMobile: false
  });

  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // When submitting, simulate password validation checking and trigger the appropriate input from the
  // state machine
  const handleFormSubmit = (e) => {
    e.preventDefault();


    if (formData.name === '') {
      setFormDataError((prev) => ({ ...prev, emptyName: true }));
      setTimeout(() => {
        trigFailInput.fire();
        numLookInput.value = 0;
      }, 500);
      return;
      
    }
    else if (formData.email === '') {
      setFormDataError((prev) => ({ ...prev, emptyEmail: true }));
      setTimeout(() => {
        trigFailInput.fire();
        numLookInput.value = 0;
      }, 500);
      return;
      
    }
    else if (formData.password === '') {
      setFormDataError((prev) => ({ ...prev, emptyPassword: true }));
      setTimeout(() => {
        trigFailInput.fire();
        numLookInput.value = 0;
      }, 500);
      return;
      
    }
    else if (formData.password !== regConfirmPassword) {
      setFormDataError((prev) => ({ ...prev, wrongConfirmPassword: true }));
      setTimeout(() => {
        trigFailInput.fire();
        numLookInput.value = 0;
      }, 500);
      return;
    }
    else if (formData.mobileNumber === '') {
      setFormDataError((prev) => ({ ...prev, emptyMobileNumber: true }));
      setTimeout(() => {
        trigFailInput.fire();
        numLookInput.value = 0;
      }, 500);
      return;
      
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const mobileRegex = /^\d{10}$/;
    
    console.log(mobileRegex.test(formData.mobileNumber));
    if (!emailRegex.test(formData.email)) {
      setFormDataError((prev) => ({ ...prev, wrongEmail: true }));
      setTimeout(() => {
        trigFailInput.fire();
        numLookInput.value = 0;
      }, 500);
      return;
    }
    else if (!passwordRegex.test(formData.password)) {
      setFormDataError((prev) => ({ ...prev, wrongPassword: true }));
      setTimeout(() => {
        trigFailInput.fire();
        numLookInput.value = 0;
      }, 500);
      return;
    }
    else if (!mobileRegex.test(formData.mobileNumber)) {
      setFormDataError((prev) => ({ ...prev, wrongMobile: true }))
      setTimeout(() => {
        trigFailInput.fire();
        numLookInput.value = 0;
      }, 500);
      return;
    }
  };

  //Onblur
  const handleBlur = (e) => {
    isCheckingInput.value = false;
  }

  //SignUp <-> Register
  const [authMode, setAuthMode] = useState(true);

  const changeAuthMode = () => {
    setAuthMode(!authMode);
  };

  const [actions, setActions] = useState("idle");
  useEffect(() => {
    setActions("idle");
    if (numLookInput) {
      numLookInput.value = 0;
    }
  }, [authMode]);

  return (
    <>
      {authMode ? (
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
            onSubmit={handleSigSubmit}
          >
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Log In</h3>
              <div className="text-center" style={{ cursor: "pointer" }}>
                Not registered yet?{" "}
                <span className="link-primary" onClick={changeAuthMode} >
                  Sign Up
                </span>
              </div>
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
      ) : (

        <div className="Auth-form-container">
          <div className='Riv-container'>
            <RiveComponent className="rive-container" />
          </div>
          <form className="Auth-form" onSubmit={handleFormSubmit}>
            <div className="Auth-form-content" style={{ textAlign: "left" }}>
              <h3 className="Auth-form-title">Sign Up</h3>
              <div className="text-center">
                <p style={{ cursor: "pointer" }}>
                  Already registered?{" "}
                  <span className="link-primary" onClick={changeAuthMode} >
                    Log In
                  </span>
                </p>
              </div>
              <div className="form-group mt-3">
                <label>User Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control mt-1"
                  placeholder="Enter Your Name"
                  value={formData.name}
                  onChange={onRegChange}
                  onBlur={handleBlur}
                  onFocus={onSigFocus}

                />
                {formDataError.emptyName && (
                  <p className="error" style={{ color: "red" }}>You cant leave this field empty</p>
                )}

              </div>
              <div className="form-group mt-3">
                <label>Email address</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="form-control mt-1"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={onRegChange}
                  onBlur={handleBlur}
                  onFocus={onSigFocus}

                />
                {formDataError.emptyEmail && (
                  <p className="error" style={{ color: "red" }}>You cant leave this field empty</p>
                )}
                {formDataError.wrongEmail && (
                  <p className="error" style={{ color: "red" }}>Email Format is not valid</p>
                )}
              </div>
              <div className="form-group mt-3">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control mt-1"
                  placeholder="Password"
                  value={formData.password}
                  onChange={onRegChange}
                  onFocus={() => (isHandsUpInput.value = true)}
                  onBlur={() => (isHandsUpInput.value = false)}

                />
              </div>
              {formDataError.emptyPassword && (
                <p className="error" style={{ color: "red" }}>You cant leave this field empty</p>
              )}
              {formDataError.wrongPassword && (
                <p className="error" style={{ color: "red" }}>Password Format is not valid</p>
              )}
              <div className="form-group mt-3">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirm-password"
                  className="form-control mt-1"
                  placeholder="Confirm Password"
                  value={regConfirmPassword}
                  onChange={onRegChange}
                  onFocus={() => (isHandsUpInput.value = true)}
                  onBlur={() => (isHandsUpInput.value = false)}

                />
                {formDataError.wrongConfirmPassword && (
                  <p className="error" style={{ color: "red" }}>Password is not matching</p>
                )}

              </div>
              <div className="form-group mt-3">
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  id="mobile-number"
                  className="form-control mt-1"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={onRegChange}
                  onBlur={handleBlur}
                  onFocus={onSigFocus}
                />
                {formDataError.emptyMobileNumber && (
                  <p className="error" style={{ color: "red" }}>You cant leave this field empty</p>
                )}
                {formDataError.wrongMobile && (
                  <p className="error" style={{ color: "red" }}>Mobile Format is not valid</p>
                )}
              </div>
              <div className="d-grid gap-2 mt-3">
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default LoginStudent;
