import http from 'k6/http';

function randomString() {
  return (Math.random() + 1).toString(36).substring(7)
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// https://stackoverflow.com/a/8809472
function uuidv4() {
  var d = new Date().getTime();
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}



function sub(date, years) {
  const newDate = new Date();
  newDate.setDate(date.getDate());
  newDate.setFullYear(date.getFullYear() - years);
  return newDate
}

export function createDeclaration(token) {
  const familyName = randomString()
  const firstNames = randomString()
  const birthDate = randomDate(new Date('1980-01-01T00:00:00.000Z'), new Date('2022-01-01T00:00:00.000Z'))

  return http.post("https://gateway.farajaland.opencrvs.org/graphql", JSON.stringify({
    "operationName": "createBirthRegistration",
    "variables": {
      "details": {
        "createdAt": "2022-05-31T11:55:07.097Z",
        "registration": {
          "informantType": "MOTHER",
          "otherInformantType": "",
          "contact": "MOTHER",
          "contactPhoneNumber": "+260700000000",
          "status": [
            {
              "timestamp": "2022-05-31T11:55:07.099Z",
              "timeLoggedMS": 85368
            }
          ],
          draftId: uuidv4(),
        },
        "child": {
          "birthDate": birthDate.toISOString().split('T')[0],
          name: [
            {
              use: 'en',
              firstNames,
              familyName
            }
          ],
          "gender": "male"
        },
        "eventLocation": {
          "_fhirID": "ea7648d3-d045-4e94-bcd8-a0ff34a5496d"
        },
        "mother": {
          "nationality": [
            "FAR"
          ],
          "birthDate": sub(birthDate, 20)
            .toISOString()
            .split('T')[0],
          name: [
            {
              use: 'en',
              firstNames: randomString(),
              familyName: familyName
            }
          ],
          "address": [
            {
              "type": "PRIMARY_ADDRESS",
              "line": [
                "",
                "",
                "",
                "",
                "",
                "URBAN"
              ],
              "country": "FAR",
              "state": "001e44bd-35b5-496d-80a8-c36d4e2d6e18",
              "district": "f5febe4f-b079-46bd-84ce-8cda56c99841"
            }
          ]
        },
        "father": {
          "detailsExist": false,
          "reasonNotApplying": "khjkhj"
        }
      }
    },
    "query": "mutation createBirthRegistration($details: BirthRegistrationInput!) {\n  createBirthRegistration(details: $details) {\n    trackingId\n    compositionId\n    __typename\n  }\n}\n"
  }), {
    timeout: '180s',
    "headers": {
      'Content-Type': 'application/json',
      "authorization": `Bearer ${token}`,
    }
  });
}