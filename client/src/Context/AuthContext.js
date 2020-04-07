import { createContext } from 'react';

export default createContext({
  user: {
    name: '',
    email: '',
    id: 0,
    photourl: ''
  },
  token: null,
  signIn: (user, token) => {},
  signOut: () => {}
});
