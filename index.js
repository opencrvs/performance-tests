import http from 'k6/http';
import { check, fail } from 'k6';
import { createDeclaration } from './declaration.js'

const AUTH_API_HOST = 'https://auth.farajaland.opencrvs.org'

function getToken(
  username,
  password
) {
  const authenticateResponse = http.post(`${AUTH_API_HOST}/authenticate`, {
    username,
    password
  })

  const { nonce } = authenticateResponse.json()

  const verifyResponse = http.post(`${AUTH_API_HOST}/verifyCode`, {
    nonce,
    code: '000000'
  })
  const data = verifyResponse.json()


  if (!data.token) {
    throw new Error(
      `Failed to get token for user ${username}, password ${password}`
    )
  }

  return data.token

}


export const options = {
  scenarios: {
    peak: {
      executor: 'ramping-arrival-rate',

      // Our test with at a rate of 30 iterations started per `timeUnit` (e.g minute).
      startRate: 30,

      // It should start `startRate` iterations per minute
      timeUnit: '1m',

      // It should preallocate 2 VUs before starting the test.
      preAllocatedVUs: 2,

      // It is allowed to spin up to 50 maximum VUs in order to sustain the defined
      // constant arrival rate.
      maxVUs: 15,

      stages: [
        { target: 40, duration: '2m' },
        { target: 60, duration: '2m' },
        { target: 100, duration: '2m' },
        { target: 200, duration: '4m' },
        { target: 0, duration: '2m' }
      ],
    },
  },
  ext: {
    loadimpact: {
      projectID: 3588066,
      name: "OpenCRVS"
    }
  }
};


export function setup() {
  return { token: getToken('kennedy.mweene', 'test') }

}


export default function ({ token }) {
  const response = createDeclaration(token)

  const validResponse = check(response, {
    'is status 200': (r) => r.status === 200,
    'is composition id present': (r) => {
      try {
        return r.json().data.createBirthRegistration.compositionId !== undefined
      } catch (error) {
        return false
      }
    },
  });

  if (!validResponse) {
    console.log(response.json());
    fail("Something went wrong when creating a declaration")
  }
}