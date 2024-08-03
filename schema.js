export const typeDefs=`#graphql
    type User{
        id: ID!
        username: String!
        password: String!
        accounts:[Account!]! # a user must be having an account or a number of accounts
        transactions:[Transaction!] # a user may or may not have done any transactions
    }
    type Account{
        id:ID!
        user_id:ID!
        balance: Float!
        user:User!
        transactions:[Transaction!]
    }
    type Transaction{
        id:ID!
        account_id:ID!
        user_id:ID!
        transaction_type: String!
        amount:String!
        user:User!
        account:Account!
    }
    type Query{
        users:[User] # query to fetch a list of all the users
        user(id:ID!):User # query to fetch a particular user based on user id, which is defined as query variable with it's type
        accounts:[Account] # query to fetch a list of allthe accounts
        account(id:ID!):Account
        transactions:[Transaction] # query to fetch a list of allthe transactions
        transaction(id:ID!):Transaction
    }
    type Mutation{
        deleteAccount(id:ID!):[Account] # this will delte the account with the given id and return the remaining accounts
        addAccount(account: AddAccountInput!):Account # this will add an account and return newly added account
        updateAccount(id: ID!, edits: EditAccountInput! ):Account # this will update the account and return the updated account
    }
    input AddAccountInput{ # this is used to sorta group the arguments/inputs for the "addAccount" resolver, we can also give an object directly in the addAccount resolver instead of using of using this
        user_id:String!,
        balance:String!
    }
    input EditAccountInput{
        user_id:String,
        balance:String
    }
`
// int, float, string, booleaN, Id =>Basic graphql types
// [String] => array of string
// [String]! => should have an array 
// [String!]! => should have a string in an array which itself is mandatory
// type => its like a table of entities with some attributes
// type Query => its where we define entry points like which tables we want to expose to access through an alias for example we will use "users" to access "User" data/table