export function fetchService(method, body) {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;
  return {
    method,
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': token,
    },
    body: JSON.stringify(body)
  }
}