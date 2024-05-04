import React, {useState, useEffect} from 'react';
import { TiTick } from "react-icons/ti";
import { BsExclamation } from "react-icons/bs";
import AccountManagerAudit from '../CreatedContracts/AccountManagerAudit';
import web3 from '../web3';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
// import departmentABI from '../ABIs/DepartmentABI';
import departmentManagerABI from '../ABIs/DepartmentManagerABI';
import {AccountType, DEPARTMENT_VERSION} from './Enums';
import {AccountTypeReverse} from './Enums';

const Register = () => {

    // let activeForm = 0;
    const navigate = useNavigate();

    const address0 = "0x0000000000000000000000000000000000000000";

    const [activeForm, setActiveForm] = useState(-1);
    const [emp_depAddress, setEmp_depAddress] = useState('');
    const [emp_accountName, setEmp_accountName] = useState('');
    const [emp_ValidForm, setEmp_ValidForm] = useState(false);
    const [emp_AddressError, setEmp_AddressError] = useState('');

    const [dep_depAddress, setDep_depAddress] = useState('');
    const [dep_accountName, setDep_accountName] = useState('');
    const [dep_ValidForm, setDep_ValidForm] = useState(false);
    const [dep_AddressError, setDep_AddressError] = useState('');

    const [aud_depAddress, setAud_depAddress] = useState('');
    const [aud_accountName, setAud_accountName] = useState('');
    const [aud_ValidForm, setAud_ValidForm] = useState(false);
    const [aud_AddressError, setAud_AddressError] = useState('');

    const accountTypes = ["EMPLOYEE", "DEPARTMENT", "AUDITOR"];

    useEffect(()=>{
      // validateDepartmentAddressEmpForm();
      validateDepartmentAddress(emp_depAddress, setEmp_AddressError);
    },[emp_depAddress]);

    useEffect(()=> {
      if (!emp_AddressError && emp_accountName){
        setEmp_ValidForm(true);
      }
      else{
        setEmp_ValidForm(false);
      }
    }, [emp_AddressError, emp_accountName]);

    //--------
    useEffect(()=>{
      // validateDepartmentAddressDeptForm();
      validateDepartmentAddress(dep_depAddress, setDep_AddressError);
    },[dep_depAddress]);

    useEffect(()=> {
      if (!dep_AddressError && dep_accountName){
        setDep_ValidForm(true);
      }
      else{
        setDep_ValidForm(false);
      }
    }, [dep_AddressError, dep_accountName]);
    //---------
    useEffect(()=>{
      validateDepartmentAddress(aud_depAddress, setAud_AddressError);
    },[aud_depAddress]);

    useEffect(()=> {
      if (!aud_AddressError && aud_accountName){
        setAud_ValidForm(true);
      }
      else{
        setAud_ValidForm(false);
      }
    }, [aud_AddressError, aud_accountName]);

    // const validateDepartmentAddressEmpForm = async() => {
    //   try{
    //     let testContract = new web3.eth.Contract(departmentManagerABI, emp_depAddress);
    //     let testresponse = await testContract.methods.getDepartmentStruct().call();
    //     //checking if it is the instance of department by calling a function that is only present in department contract.
    //     console.log("VALID, NO ERROR");
    //     setEmp_AddressError('');
    //   }catch(error){
    //     console.log("INVALID, ERROR");
    //     setEmp_AddressError(error);
    //   }
    // }
    // const validateDepartmentAddressDeptForm = async() => {
    //   try{
    //     let testContract = new web3.eth.Contract(departmentManagerABI, dep_depAddress);
    //     let testresponse = await testContract.methods.getDepartmentStruct().call();
    //     //checking if it is the instance of department by calling a function that is only present in department contract.
    //     console.log("VALID, NO ERROR");
    //     setDep_AddressError('');
    //   }catch(error){
    //     console.log("INVALID, ERROR");
    //     setDep_AddressError(error);
    //   }
    // }
    const validateDepartmentAddress = async(dep_address, func) => {
        if (!dep_address)
          return;
        try{
          //DEPARTMENT_VERSION
          let testContract = new web3.eth.Contract(departmentManagerABI, dep_address);
          let testresponse = await testContract.methods.version().call().then((res)=>{
            console.log("DEPARTMENT_VERSION: "+res);
            if (res==DEPARTMENT_VERSION)
              func('');    
            else
              func("ERROR");
          }).catch((err)=>{
            func("ERROR");
          });
          // func('');
        }catch(error){
          func("ERROR");
          console.log("ERROR");
        }
    }

    const getEmployeeForm = () => {
        return (
        <form class="form-horizontal container" role="form">
        <div class="form-group row my-3">
          <div class="col-sm-11">
            <input type="text" class="form-control select2-offscreen" id="parentAdddress" placeholder="Parent department address" tabIndex="-1"
                value={emp_depAddress} 
                onChange={(event) => setEmp_depAddress(event.target.value)}
            />
          </div>
          <div class="col-sm-1">
                  {!emp_AddressError && 
                    <div title={"Valid"} data-toggle="popover" data-trigger="hover" data-content="Some content"><TiTick color='green'/></div>
                  }
                  {emp_AddressError && 
                    <div title={emp_AddressError} data-toggle="popover" data-trigger="hover" data-content="Some content"><BsExclamation color='red'/></div>
                  }
              </div>
        </div>
        <div class="form-group row my-3">
            <div class="col-sm-11">
                <input type="text" class="form-control select2-offscreen" id="accountName" placeholder="Employee name" tabIndex="-1"
                    value={emp_accountName} 
                    onChange={(event) => setEmp_accountName(event.target.value)}
                />
            </div>
            <div class="col-sm-1">
              </div>
        </div>
        <div class="form-group row my-3 justify-content-center">
            {/* <div class="col-sm-9"></div> */}
            <div class="col-sm-12">
                <button disabled={!emp_ValidForm} class="btn btn-success mx-1" onClick={registerEmployee}>Register</button>
            </div>
        </div>
      </form>
        );
    }

    const getDepartmentForm = () => {
        return (
        <form class="form-horizontal container" role="form">
        <div class="form-group row my-3">
          <div class="col-sm-11">
            <input type="text" class="form-control select2-offscreen" id="parentAdddress" placeholder="Parent department address" tabIndex="-1"
                value={dep_depAddress} 
                onChange={(event) => setDep_depAddress(event.target.value)}
            />
          </div>
          <div class="col-sm-1">
                  {!dep_AddressError && 
                    <div title={"Valid"} data-toggle="popover" data-trigger="hover" data-content="Some content"><TiTick color='green'/></div>
                  }
                  {dep_AddressError && 
                    <div title={dep_AddressError} data-toggle="popover" data-trigger="hover" data-content="Some content"><BsExclamation color='red'/></div>
                  }
              </div>
        </div>
        <div class="form-group row my-3">
            <div class="col-sm-11">
                <input type="text" class="form-control select2-offscreen" id="accountName" placeholder="Department name" tabIndex="-1"
                    value={dep_accountName} 
                    onChange={(event) => setDep_accountName(event.target.value)}
                />
            </div>
            <div class="col-sm-1">
              </div>
        </div>
        <div class="form-group row my-3 justify-content-center">
            {/* <div class="col-sm-9"></div> */}
            <div class="col-sm-12">
                <button disabled={!dep_ValidForm} class="btn btn-success mx-1" onClick={registerDepartment}>Register</button>
            </div>
        </div>
      </form>
        );
    }
    const getAuditorForm = () => {
      return (
      <form class="form-horizontal container" role="form">
      <div class="form-group row my-3">
        <div class="col-sm-11">
          <input type="text" class="form-control select2-offscreen" id="parentAdddress" placeholder="Parent department address" tabIndex="-1"
              value={aud_depAddress} 
              onChange={(event) => setAud_depAddress(event.target.value)}
          />
        </div>
        <div class="col-sm-1">
                {!aud_AddressError && 
                  <div title={"Valid"} data-toggle="popover" data-trigger="hover" data-content="Some content"><TiTick color='green'/></div>
                }
                {aud_AddressError && 
                  <div title={dep_AddressError} data-toggle="popover" data-trigger="hover" data-content="Some content"><BsExclamation color='red'/></div>
                }
            </div>
      </div>
      <div class="form-group row my-3">
          <div class="col-sm-11">
              <input type="text" class="form-control select2-offscreen" id="accountName" placeholder="Auditor name" tabIndex="-1"
                  value={aud_accountName} 
                  onChange={(event) => setAud_accountName(event.target.value)}
              />
          </div>
          <div class="col-sm-1">
            </div>
      </div>
      <div class="form-group row my-3 justify-content-center">
          {/* <div class="col-sm-9"></div> */}
          <div class="col-sm-12">
              <button disabled={!aud_ValidForm} class="btn btn-success mx-1" onClick={registerAuditor}>Register</button>
          </div>
      </div>
    </form>
      );
  }

  const getToast = (msg, type) => {
    let structure = {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined
    };
    if (type=="ERROR"){
      return toast.error(msg, structure);
    }
    if (type=="SUCCESS"){
      return toast.success(msg, structure);
    }
    return toast.info(msg, structure);
  }

    const registerEmployee = async(event) => {
      //emp_depAddress, emp_accountName
      event.preventDefault();
      let accounts = await web3.eth.getAccounts();
      console.log("Calling registerEmployee()");
      let errorMessage = '';
      getToast("Registering as employee", "INFO");
        console.log(accounts);
        try{
          console.log("Here 1");
          // console.log(AccountType.EMPLOYEE);
          // console.log(AccountType.DEPARTMENT);
      // await AccountManagerAudit.methods.registerEmployee(emp_depAddress, emp_accountName).send({
        await AccountManagerAudit.methods.register(emp_depAddress, emp_accountName, AccountType.EMPLOYEE).send({
        from: accounts[0]
      }).then((response)=>{
        getToast("Registered as employee!", "SUCCESS");
          // window.location.reload();
          navigate("/");
          // window.location.href="";
          window.location="";
      }).catch((error)=>{
        console.log("ERROR:");
        console.log(error);
        getToast(error.message, "ERROR");
      });
    }
    catch(error) {
      console.log("error: ");
      console.log(error);
      // console.log("errormessage: ");
      // console.log(error.message);
      // console.log("ERROR: "+error);
      getToast('Cound not register!', "ERROR");
      }
      //registerEmployee
    }
    const registerDepartment = async(event) => {
      //registerDepartment
      event.preventDefault();
      let accounts = await web3.eth.getAccounts();

      let errorMessage = '';
      getToast('Registering as department', "INFO");
        console.log(accounts);
        try{
      // await AccountManagerAudit.methods.registerDepartment(dep_depAddress, dep_accountName).send({
      await AccountManagerAudit.methods.register(dep_depAddress, dep_accountName, AccountType.DEPARTMENT).send({
        from: accounts[0]
      }).then((response)=>{
        getToast('Registered as departmnet!', "SUCCESS");
          navigate("/")
          // window.location.reload();
          // window.location.href="";
          window.location="";
      }).catch((error)=>{
        console.log("ERROR:");
        console.log(error);
        // errorMessage = error.message;
        getToast(error.message, "ERROR");
      });
      // console.log("Outside:---------");
      // console.log(errorMessage);
    }
    catch(error) {
      console.log("error: ");
      console.log(error);
      // console.log("errormessage: ");
      // console.log(error.message);
      // console.log("ERROR: "+error);
      getToast('Cound not register!', "ERROR");
      }
    }

    const registerAuditor = async(event) => {
      event.preventDefault();
      let accounts = await web3.eth.getAccounts();

      let errorMessage = '';
      getToast('Registering as auditor', "INFO");
        console.log(accounts);
        try{
      // await AccountManagerAudit.methods.registerDepartment(dep_depAddress, dep_accountName).send({
      await AccountManagerAudit.methods.register(aud_depAddress, aud_accountName, AccountType.AUDITOR).send({
        from: accounts[0]
      }).then((response)=>{
        getToast('Registered as auditor', "SUCCESS");
          navigate("/")
          // window.location.reload();
          // window.location.href="";
          // window.location="";
      }).catch((error)=>{
        console.log("ERROR:");
        console.log(error);
        // errorMessage = error.message;
        getToast(error.message, "ERROR");
      });
      // console.log("Outside:---------");
      // console.log(errorMessage);
    }
    catch(error) {
      console.log("error: ");
      console.log(error);
      // console.log("errormessage: ");
      // console.log(error.message);
      // console.log("ERROR: "+error);
      getToast('Cound not register!', "ERROR");
      }
    }

  return (
    <div class="form-horizontal container" role="form">
          {/* <p>Reference: {refernceMail}</p> */}
        <h5 class="text-center">You are not registered!</h5>

        <div class="row">
          <div class="text-end col-md-6 py-4">Register yourself as : </div>
          <div class="col-md-6">
            {accountTypes.map((acc)=>(
              <p>
              <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => setActiveForm(AccountType[acc])}/>
              <label class="form-check-label" for="flexRadioDefault1">
                  {acc} 
              </label>
          </p>
            ))}
              {/* <p>
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => setActiveForm(1)}/>
                  <label class="form-check-label" for="flexRadioDefault1">
                      Employee 
                  </label>
              </p>
              <p>
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => setActiveForm(2)}/>
                  <label class="form-check-label" for="flexRadioDefault1">
                      Department 
                  </label>
              </p>
              <p>
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onClick={() => setActiveForm(3)}/>
                  <label class="form-check-label" for="flexRadioDefault1">
                      Auditor 
                  </label>
              </p> */}
            </div>
        </div>
        {activeForm==AccountType.EMPLOYEE ? getEmployeeForm(): activeForm==AccountType.DEPARTMENT ? getDepartmentForm(): activeForm==AccountType.AUDITOR? getAuditorForm() : <></>}
        {/* <ToastContainer /> */}
      </div>
  )
}

export default Register