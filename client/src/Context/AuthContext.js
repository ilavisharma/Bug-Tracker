import { createContext } from 'react';

export default createContext({
  user: {
    name: '',
    email: '',
    id: 0,
    photourl: '',
    role: ''
  },
  token: null,
  role: null,
  signIn: (user, token) => {},
  signOut: () => {},
  api: () => {}
});
