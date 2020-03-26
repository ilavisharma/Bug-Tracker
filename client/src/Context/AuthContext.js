import { createContext } from 'react';

export default createContext({
  user: {
    name: '',
    email: ''
  },
  token: null,
  signIn: (user, token) => {},
  signOut: () => {}
});
