const tokenKey = "geek_pc";

const getToken = () => {
  return localStorage.getItem(tokenKey);
};

const setToken = (token) => {
  localStorage.setItem(tokenKey, token);
};

const clearToken = () => {
  localStorage.removeItem(tokenKey);
};

export { getToken, setToken, clearToken };
