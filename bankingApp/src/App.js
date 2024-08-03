import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql, useApolloClient } from "@apollo/client";
import "./App.css";

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      password
      accounts {
        id
        balance
      }
    }
  }
`;

const ADD_ACCOUNT = gql`
  mutation AddAccount($account: AddAccountInput!) {
    addAccount(account: $account) {
      id
      user_id
      balance
    }
  }
`;

const UPDATE_ACCOUNT = gql`
  mutation updateAccount($id: ID!, $edits: EditAccountInput!) {
    updateAccount(id: $id, edits: $edits) {
      id
      user_id
      balance
    }
  }
`;

const GET_ACCOUNT = gql`
  query accountQuery($id: ID!) {
    account(id: $id) {
      id
      balance
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_USERS);
  const [addAccount, { error: mutationError }] = useMutation(ADD_ACCOUNT);
  const [updateAccount] = useMutation(UPDATE_ACCOUNT);
  const client = useApolloClient();

  const [accountIdDep, setAccountIdDep] = useState("");
  const [amountDep, setAmountDep] = useState("");
  const [accountIdWithDraw, setAccountIdWithDraw] = useState("");
  const [amountWithDraw, setAmountWithDraw] = useState("");
  const [loadingOperation, setLoadingOperation] = useState(false);
  const [operationError, setOperationError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error(error);
    return <p>Error: {error.message}</p>;
  }
  if (mutationError) {
    console.error(mutationError);
    return <p>Mutation Error: {mutationError.message}</p>;
  }

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoadingOperation(true);
    setOperationError(null);

    try {
      const { data: accountData } = await client.query({
        query: GET_ACCOUNT,
        variables: { id: accountIdDep },
      });

      if (!accountData.account) {
        throw new Error("Account not found.");
      }

      const currentBalance = parseFloat(accountData.account.balance);
      const newBalance = currentBalance + parseFloat(amountDep);

      await updateAccount({
        variables: {
          id: accountIdDep,
          edits: {
            balance: newBalance.toString(),
          },
        },
        refetchQueries: [{ query: GET_USERS }],
      });

      setAccountIdDep("");
      setAmountDep("");
    } catch (err) {
      console.error(err);
      setOperationError("Failed to deposit money. Please try again.");
    } finally {
      setLoadingOperation(false);
    }
  };

  const handleWithdrawals = async (e) => {
    e.preventDefault();
    setLoadingOperation(true);
    setOperationError(null);

    try {
      const { data: accountData } = await client.query({
        query: GET_ACCOUNT,
        variables: { id: accountIdWithDraw },
      });

      if (!accountData.account) {
        throw new Error("Account not found.");
      }

      const currentBalance = parseFloat(accountData.account.balance);
      const withdrawalAmount = parseFloat(amountWithDraw);
      const newBalance = currentBalance - withdrawalAmount;

      if (newBalance < 0) {
        throw new Error("Insufficient balance for the withdrawal.");
      }

      await updateAccount({
        variables: {
          id: accountIdWithDraw,
          edits: {
            balance: newBalance.toString(),
          },
        },
        refetchQueries: [{ query: GET_USERS }],
      });

      setAccountIdWithDraw("");
      setAmountWithDraw("");
    } catch (err) {
      console.error(err);
      setOperationError("Failed to withdraw money. Please try again.");
    } finally {
      setLoadingOperation(false);
    }
  };

  return (
    <div className="container">
      <div className="dark-mode-toggle">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          Dark Mode
        </label>
      </div>
      <h1>Users</h1>
      <ul>
        {data.users.map((user) => (
          <li key={user.id}>
            {user.username}
            <ul>
              {user.accounts.map((account) => (
                <li key={account.id}>
                  Account ID: {account.id}, Balance: {account.balance}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <form onSubmit={handleDeposit}>
        <label htmlFor="account">Enter Account Id:</label>
        <input
          type="text"
          name="account"
          value={accountIdDep}
          onChange={(e) => setAccountIdDep(e.target.value)}
        />
        <label htmlFor="amount">Enter Amount: </label>
        <input
          type="text"
          name="amount"
          value={amountDep}
          onChange={(e) => setAmountDep(e.target.value)}
        />
        <button type="submit" disabled={loadingOperation}>
          Deposit Money
        </button>
      </form>
      <form onSubmit={handleWithdrawals}>
        <label htmlFor="account">Enter Account Id:</label>
        <input
          type="text"
          name="account"
          value={accountIdWithDraw}
          onChange={(e) => setAccountIdWithDraw(e.target.value)}
        />
        <label htmlFor="amount">Enter Amount: </label>
        <input
          type="text"
          name="amount"
          value={amountWithDraw}
          onChange={(e) => setAmountWithDraw(e.target.value)}
        />
        <button type="submit" disabled={loadingOperation}>
          Withdraw Money
        </button>
      </form>
      {operationError && <p className="error">{operationError}</p>}
    </div>
  );
}

export default App;
