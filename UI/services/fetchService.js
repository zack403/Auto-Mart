export function fetchService(method, body) {
  return {
    method,
    mode: 'cors',
    headers: {'Content-Type' : 'application/json',
    'Accept': 'application/json'
    },
    body: JSON.stringify(body)
  }
}