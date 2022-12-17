import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        role
        username
        email
        profilepicture
        games {
          _id
          userid
          username
          w1
          w2
          w3
          time
          score
          date
          difficulty
        }
        resetToken
        resetTokenExpiry
      }
    }
  }
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation UpdateUserPassword($password: String) {
    updateUserPassword(password: $password) {
      _id
      role
      username
      email
      profilepicture
      games {
        _id
        userid
        username
        w1
        w2
        w3
        time
        score
        date
        difficulty
      }
      resetToken
      resetTokenExpiry
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($username: String, $email: String, $profilepicture: String) {
    updateUser(username: $username, email: $email, profilepicture: $profilepicture) {
      _id
      role
      username
      email
      profilepicture
      games {
        _id
        userid
        username
        w1
        w2
        w3
        time
        score
        date
        difficulty
      }
      resetToken
      resetTokenExpiry
    }
  }
`;

export const REQUEST_RESET = gql`
  mutation RequestReset($email: String) {
    requestReset(email: $email) {
      _id
      role
      username
      email
      profilepicture
      games {
        _id
        userid
        username
        w1
        w2
        w3
        time
        score
        date
        difficulty
      }
      resetToken
      resetTokenExpiry
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String, $password: String, $confirmPassword: String, $resetToken: String) {
    resetPassword(email: $email, password: $password, confirmPassword: $confirmPassword, resetToken: $resetToken) {
      _id
      role
      username
      email
      profilepicture
      games {
        _id
        userid
        username
        w1
        w2
        w3
        time
        score
        date
        difficulty
      }
      resetToken
      resetTokenExpiry
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!, $role: [String!], $profilepicture: String) {
    addUser(username: $username, email: $email, password: $password, role: $role, profilepicture: $profilepicture) {
      token
      user {
        _id
        role
        username
        email
        profilepicture
        games {
          _id
          userid
          username
          w1
          w2
          w3
          time
          score
          date
          difficulty
        }
        resetToken
        resetTokenExpiry
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation Mutation($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId)
  }
`;

export const ADD_GAME = gql`
  mutation AddGame($userid: String, $username: String, $w1: String, $w2: String, $w3: String, $time: String, $score: String, $date: String, $difficulty: String) {
    addGame(userid: $userid, username: $username, w1: $w1, w2: $w2, w3: $w3, time: $time, score: $score, date: $date, difficulty: $difficulty) {
      _id
      userid
      username
      w1
      w2
      w3
      time
      score
      date
      difficulty
    }
  }
`;
export const DELETE_GAME = gql`
  mutation Mutation($deleteGameId: ID!) {
    deleteGame(id: $deleteGameId)
  }
`;


