function Deposit() {
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');  

  return (<>
    <Card
      txtcolor="black"
      header="Deposit"
      status={status}
      body={show ? 
        <DepositForm setShow={setShow} setStatus={setStatus}/> :
        <DepositMsg setShow={setShow} setStatus={setStatus}/>}
    />
  </>
  )
}

function DepositMsg() {
  return (<>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => {
          setShow(true);
          setStatus('');
      }}>
        Make Another Deposit
    </button>
  </>);
} 

function DepositForm() {
  const ctx = React.useContext(UserContext);  
  const email = ctx.user.email;
  const [amount, setAmount] = React.useState('');
  const [balance, setBalance] = React.useState(0); 

  getData();

  function handle() {
      fetch(`https://banking-app-3ov2.onrender.com/account/update/${email}/${amount}`);
      getData();
  }

  function getData(){
    fetch(`https://banking-app-3ov2.onrender.com/account/findOne/${email}`)
    .then(response => response.text())
    .then(text => {
        try {
            const data = JSON.parse(text);
            setBalance(data.balance);
           
        } catch(err) {
            props.setStatus(text)
            console.log('err:', text);
        }
    });
  }

  return(<>
    <h5>Current balance: ${parseFloat(balance).toFixed(2)}</h5>
      
    Amount<br/>
    <input type="number" 
      className="form-control" 
      placeholder="Enter amount" 
      value={amount} onChange={e => setAmount(e.currentTarget.value)}/><br/>

    <button type="submit" 
      className="btn btn-light" 
      onClick={handle}>Deposit</button>
  </>);
}

