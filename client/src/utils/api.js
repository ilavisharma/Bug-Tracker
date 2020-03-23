import axios from 'axios';

const baseURL =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:4000'
    : 'https://api.bugtracker.lavisharma.me';

export default axios.create({
  baseURL
});
