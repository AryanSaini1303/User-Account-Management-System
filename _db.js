let users = [
  {id: "1",username: "john_doe",password: "password123",},
  {id: "2",username: "jane_smith",password: "password456",},
  {id: "3",username: "alice_jones",password: "password789",},
];
let accounts = [
  {id: "1",user_id: "1",balance: 1500.0,},
  {id: "2",user_id: "2",balance: 2500.0,},
  {id: "3",user_id: "3",balance: 3500.0,},
];
let transactions = [
  {id: "1",account_id: "1",user_id:"1",transaction_type: "deposit",amount: "500.00",},
  {id: "2",account_id: "2",user_id:"2",transaction_type: "withdrawal",amount: "300.00",},
  {id: "3",account_id: "3",user_id:"3",transaction_type: "deposit",amount: "700.00",},
  {id: "4",account_id: "1",user_id:"1",transaction_type: "withdrawal",amount: "200.00",},
  {id: "5",account_id: "2",user_id:"2",transaction_type: "deposit",amount: "600.00",},
];
export default {users,accounts,transactions}
// js file to mimic a database