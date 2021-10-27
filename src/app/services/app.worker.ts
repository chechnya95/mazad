/// <reference lib="webworker" />
import jwt_decode from "jwt-decode";

addEventListener('message', ({ data }) => {
  let token = data;
  let decoded = null;

  if (token)
    decoded = jwt_decode(token);

  let valid = false;

  if (decoded)
    valid = decoded['exp'] > Date.now() / 1000;

  postMessage(valid);
});
