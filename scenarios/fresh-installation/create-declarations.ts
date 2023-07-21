import { check, fail } from "k6";
import { createDeclaration } from "./utils/declaration.js";
import { getToken } from "../../utils/auth.js";

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
    "processing < 5s": (r) => r.timings.waiting < 5000,
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
