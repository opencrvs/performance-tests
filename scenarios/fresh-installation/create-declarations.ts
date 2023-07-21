import * as http from "k6/http";
import { check, fail } from "k6";
import { createDeclaration } from "./utils/declaration.js";

const AUTH_API_HOST = "http://localhost:4040";

function getToken(username: string, password: string) {
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

export const options = {
  iterations: 30,
};

export function setup() {
  return { token: getToken("k.mweene", "test") };
}

type Context = ReturnType<typeof setup>;

export default function ({ token }: Context) {
  const response = createDeclaration(token);

  const validResponse = check(response, {
    "is status 200": (r) => r.status === 200,
    "is composition id present": (r) => {
      const json: any = r.json();
      try {
        return json.data.createBirthRegistration.compositionId !== undefined;
      } catch (error) {
        return false;
      }
    },
  });

  if (!validResponse) {
    console.log(response.json());
    fail("Something went wrong when creating a declaration");
  }
}
