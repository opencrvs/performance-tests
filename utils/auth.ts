import * as http from "k6/http";

const AUTH_API_HOST = "http://localhost:4040";

export function getToken(username: string, password: string) {
  const authenticateResponse = http.post(`${AUTH_API_HOST}/authenticate`, {
    username,
    password,
  });

  const { nonce } = authenticateResponse.json() as { nonce: string };

  const verifyResponse = http.post(`${AUTH_API_HOST}/verifyCode`, {
    nonce,
    code: "000000",
  });
  const data = verifyResponse.json() as { token: string };

  if (!data.token) {
    throw new Error(
      `Failed to get token for user ${username}, password ${password}`
    );
  }

  return data.token;
}
