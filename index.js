import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import db from "./_db.js";

const resolvers = {
  Query: {
    users() {
      // This is our first resolver function which is kind of the url endpoint which we can use to access the users data from the database
      return db.users;
    },
    user(_, args) {
      // resolver function can have 3 parameters which are parent, args, context (currently we just need args so using "_" instead of "parent")
      return db.users.find((element) => element.id === args.id);
    },
    accounts() {
      return db.accounts;
    },
    account(_, args) {
      return db.accounts.find((element) => element.id === args.id);
    },
    transactions() {
      return db.transactions;
    },
    transaction(_, args) {
      return db.transactions.find((element) => element.id === args.id);
    },
  },
  // Here we are creating a new object to handle the nested requests for a User like the user's transactions and accounts
  User: {
    transactions(parent) {
      // here parent will have the argument given to the parent resolver i.e. user
      return db.transactions.filter((element) => element.user_id === parent.id); // then we just filter out the data useful to us based on the id provided
    },
    accounts(parent) {
      return db.accounts.filter((element) => element.user_id === parent.id);
    },
  },
  Account: {
    transactions(parent) {
      return db.transactions.filter(
        (element) => element.account_id === parent.id
      );
    },
    user(parent) {
      return db.users.find((element) => element.id === parent.id); // use ".find" instead of ".filter" when expecting a single response instead of an array
    },
  },
  Mutation: {
    deleteAccount(_, args) {
      return (db.accounts = db.accounts.filter(
        (element) => element.id != args.id
      )); // this will remove the account with given id but as soon as the server restarts then it'll appear again as data will be fetched again from "_db.js"
    },
    addAccount(_, args) {
      let account = {
        ...args.account,
        id: Math.floor(Math.floor(1) * 1000).toString(),
      };
      db.accounts.push(account);
      return account;
    },
    updateAccount(_,args){
        db.accounts=db.accounts.map((element)=>{
            if(element.id===args.id){
                return {...element,...args.edits}// this will spread the original element i.e. ...element, and replace the attribtes of ...args.edits in ...element i.e. the original object/data
            }
            return element
            // so here we map through the accounts and return each element either by updating the element or returning it as it is which eventually creates an array which is stored in db.accounts
        })
        return db.accounts.find((element)=>element.id===args.id);
    }
  },
};
/* 
1.if we query like below then apollo server will automatically handle this and will only return attribute "title" of the data "users" from the database
    users{
        title
    }
2.query to fetch all the user's username
    query userQuery{
        users{
            username
        }
    }
3.query to fetch a single user based on the id of the user
    query particularUserQuery($id:ID!){
        user(id:$id) {
            username,
            password
        }
    }
4. query to fetch an account, all it's transactions and the user who own that account
    query accountQuery($id:ID!){
        account(id:$id){
            balance,
            transactions {
                transaction_type,
                amount
            },
            user{
                username,
                password
            }
        }
    }
5. query to a user, his/her accounts and the transactions done with those accounts
    query userQuery($id:ID!){
        user(id:$id){
            username
            accounts {
                id,
                balance,
                transactions {
                    transaction_type,
                    amount
                }
            }
        }
    }
7. mutation to add an account
    mutation addAccountMutation($account:AddAccountInput!){
        addAccount(account:$account) {
            id,
            user_id,
            balance
        }
    }
8. mutation to remove/delete an account
    mutation deleteAccountMutation($id:ID!){
        deleteAccount(id: $id) {
            id,
            user_id,
            balance
        }
    }
9. mutation to update an account
    mutation editAccount($id:ID!, $edits:EditAccountInput!){
        updateAccount(id:$id, edits:$edits){
            id,
            user_id,
            balance
        }
    }
*/

// server setup
const server = new ApolloServer({
  typeDefs, // type definitions
  resolvers, // resolvers
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("Sever:", url);
