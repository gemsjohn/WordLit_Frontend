import { gql } from '@apollo/client';



export const GET_ME = gql`
  query Me {
    me {
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

export const GET_USER_BY_ID = gql`
  query Query($id: ID!) {
    user(_id: $id) {
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

export const GET_USERS = gql`
  query Query {
    users {
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

export const GET_USERS_SEARCH = gql`
  query Query($search: String) {
    getUsers(search: $search) {
      users {
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

export const GAMES = gql`
  query Query {
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
  } 
`;

export const LEADERBOARD = gql`
  query Query {
    leaderBoard {
      username
      score
      id
      position
    }
  }
`;
