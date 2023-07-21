import * as http from "k6/http";
import { check } from "k6";
import { Gauge, Counter } from "k6/metrics";
import { getToken } from "../../utils/auth.js";

export const GaugeContentSize = new Gauge("ContentSize");
export const CounterErrors = new Counter("Errors");

function fetchDeclaration(token: string, id: string) {
  return http.post(
    `http://localhost:7070/graphql`,
    JSON.stringify({
      operationName: "fetchBirthRegistrationForReview",
      variables: {
        id: id,
      },
      query:
        "query fetchBirthRegistrationForReview($id: ID!) {\n  fetchBirthRegistration(id: $id) {\n    _fhirIDMap\n    id\n    child {\n      id\n      name {\n        use\n        firstNames\n        familyName\n        __typename\n      }\n      birthDate\n      gender\n      __typename\n    }\n    informant {\n      id\n      relationship\n      otherRelationship\n      individual {\n        id\n        identifier {\n          id\n          type\n          otherType\n          fieldsModifiedByIdentity\n          __typename\n        }\n        name {\n          use\n          firstNames\n          familyName\n          __typename\n        }\n        occupation\n        nationality\n        birthDate\n        ageOfIndividualInYears\n        exactDateOfBirthUnknown\n        address {\n          type\n          line\n          district\n          state\n          city\n          postalCode\n          country\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    mother {\n      id\n      name {\n        use\n        firstNames\n        familyName\n        __typename\n      }\n      multipleBirth\n      birthDate\n      maritalStatus\n      occupation\n      detailsExist\n      reasonNotApplying\n      ageOfIndividualInYears\n      exactDateOfBirthUnknown\n      dateOfMarriage\n      educationalAttainment\n      nationality\n      identifier {\n        id\n        type\n        otherType\n        fieldsModifiedByIdentity\n        __typename\n      }\n      address {\n        type\n        line\n        district\n        state\n        city\n        postalCode\n        country\n        __typename\n      }\n      telecom {\n        system\n        value\n        __typename\n      }\n      __typename\n    }\n    father {\n      id\n      name {\n        use\n        firstNames\n        familyName\n        __typename\n      }\n      birthDate\n      maritalStatus\n      occupation\n      detailsExist\n      reasonNotApplying\n      ageOfIndividualInYears\n      exactDateOfBirthUnknown\n      dateOfMarriage\n      educationalAttainment\n      nationality\n      identifier {\n        id\n        type\n        otherType\n        fieldsModifiedByIdentity\n        __typename\n      }\n      address {\n        type\n        line\n        district\n        state\n        city\n        postalCode\n        country\n        __typename\n      }\n      telecom {\n        system\n        value\n        __typename\n      }\n      __typename\n    }\n    registration {\n      id\n      informantType\n      otherInformantType\n      contact\n      contactRelationship\n      contactPhoneNumber\n      duplicates {\n        compositionId\n        trackingId\n        __typename\n      }\n      informantsSignature\n      informantsSignatureURI\n      attachments {\n        data\n        uri\n        type\n        contentType\n        subject\n        __typename\n      }\n      status {\n        comments {\n          comment\n          __typename\n        }\n        type\n        timestamp\n        office {\n          name\n          alias\n          address {\n            district\n            state\n            __typename\n          }\n          partOf\n          __typename\n        }\n        __typename\n      }\n      type\n      trackingId\n      registrationNumber\n      mosipAid\n      __typename\n    }\n    attendantAtBirth\n    weightAtBirth\n    birthType\n    eventLocation {\n      id\n      type\n      address {\n        line\n        district\n        state\n        city\n        postalCode\n        country\n        __typename\n      }\n      __typename\n    }\n    questionnaire {\n      fieldId\n      value\n      __typename\n    }\n    history {\n      otherReason\n      requester\n      hasShowedVerifiedDocument\n      date\n      action\n      regStatus\n      dhis2Notification\n      ipAddress\n      statusReason {\n        text\n        __typename\n      }\n      reason\n      location {\n        id\n        name\n        __typename\n      }\n      office {\n        id\n        name\n        alias\n        address {\n          state\n          district\n          __typename\n        }\n        __typename\n      }\n      system {\n        name\n        type\n        __typename\n      }\n      user {\n        id\n        role {\n          _id\n          labels {\n            lang\n            label\n            __typename\n          }\n          __typename\n        }\n        systemRole\n        name {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        avatar {\n          data\n          type\n          __typename\n        }\n        __typename\n      }\n      signature {\n        data\n        type\n        __typename\n      }\n      comments {\n        user {\n          id\n          username\n          avatar {\n            data\n            type\n            __typename\n          }\n          __typename\n        }\n        comment\n        createdAt\n        __typename\n      }\n      input {\n        valueCode\n        valueId\n        valueString\n        __typename\n      }\n      output {\n        valueCode\n        valueId\n        valueString\n        __typename\n      }\n      certificates {\n        hasShowedVerifiedDocument\n        collector {\n          relationship\n          otherRelationship\n          individual {\n            name {\n              use\n              firstNames\n              familyName\n              __typename\n            }\n            telecom {\n              system\n              value\n              use\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      duplicateOf\n      potentialDuplicates\n      __typename\n    }\n    __typename\n  }\n}\n",
    }),
    { headers: { authorization: `Bearer ${token}` } }
  );
}

export const options = {
  iterations: 100,
};

type Context = ReturnType<typeof setup>;

export function setup() {
  const token = getToken("k.mweene", "test");
  return { token };
}

export default function ({ token }: Context) {
  const response = fetchDeclaration(
    token,
    "f52fb06e-142b-419f-81d7-8f6ed9250335"
  );

  check(response, {
    "is status 200": (r) => r.status === 200,
    /*
     * Download times of 0.5 MB
     * 256 kbit/s	00:00:16
     * 512 kbit/s	00:00:08
     * 1 Mbit/s	00:00:04
     * 2 Mbit/s	00:00:02
     */

    "is size < 0.5MB": (r) => (r.body && r.body.length < 500000) || false,
    "processing < 5s": (r) => r.timings.waiting < 5000,
  });
}
