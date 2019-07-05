import {authService} from "../services/authService.js"

export function fetchService(method, body) {
  return {
    method,
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': authService.getUserToken(),
    },
    body: JSON.stringify(body)
  }
}