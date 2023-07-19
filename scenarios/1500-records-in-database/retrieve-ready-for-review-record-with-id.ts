import * as http from "k6/http";
import { check } from "k6";

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

function getDeclarations(token: string) {
  const response = http.post(
    `http://localhost:7070/graphql`,
    JSON.stringify({
      operationName: "registrationHome",
      variables: {
        declarationLocationId: "ebc8324e-992a-4679-ad6d-ca854f552a31",
        pageSize: 10,
        reviewStatuses: ["DECLARED", "VALIDATED"],
        inProgressSkip: 0,
        healthSystemSkip: 0,
        reviewSkip: 0,
        rejectSkip: 0,
        approvalSkip: 0,
        externalValidationSkip: 0,
        printSkip: 0,
        issueSkip: 0,
      },
      query:
        'fragment EventSearchFields on EventSearchSet {\n  id\n  type\n  registration {\n    status\n    contactRelationship\n    contactNumber\n    trackingId\n    eventLocationId\n    registrationNumber\n    registeredLocationId\n    duplicates\n    createdAt\n    modifiedAt\n    assignment {\n      userId\n      firstName\n      lastName\n      officeName\n      __typename\n    }\n    __typename\n  }\n  operationHistories {\n    operationType\n    operatedOn\n    operatorRole\n    operatorName {\n      firstNames\n      familyName\n      use\n      __typename\n    }\n    operatorOfficeName\n    operatorOfficeAlias\n    notificationFacilityName\n    notificationFacilityAlias\n    rejectReason\n    rejectComment\n    __typename\n  }\n  ... on BirthEventSearchSet {\n    dateOfBirth\n    childName {\n      firstNames\n      familyName\n      use\n      __typename\n    }\n    __typename\n  }\n  ... on DeathEventSearchSet {\n    dateOfDeath\n    deceasedName {\n      firstNames\n      familyName\n      use\n      __typename\n    }\n    __typename\n  }\n  ... on MarriageEventSearchSet {\n    dateOfMarriage\n    brideName {\n      firstNames\n      familyName\n      use\n      __typename\n    }\n    groomName {\n      firstNames\n      familyName\n      use\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n\nquery registrationHome($declarationLocationId: String!, $pageSize: Int, $inProgressSkip: Int, $healthSystemSkip: Int, $reviewStatuses: [String], $reviewSkip: Int, $rejectSkip: Int, $approvalSkip: Int, $externalValidationSkip: Int, $printSkip: Int, $issueSkip: Int) {\n  inProgressTab: searchEvents(\n    advancedSearchParameters: {declarationLocationId: $declarationLocationId, registrationStatuses: ["IN_PROGRESS"], compositionType: ["birth-declaration", "death-declaration", "marriage-declaration"]}\n    count: $pageSize\n    skip: $inProgressSkip\n  ) {\n    totalItems\n    results {\n      ...EventSearchFields\n      __typename\n    }\n    __typename\n  }\n  notificationTab: searchEvents(\n    advancedSearchParameters: {declarationLocationId: $declarationLocationId, registrationStatuses: ["IN_PROGRESS"], compositionType: ["birth-notification", "death-notification", "marriage-notification"]}\n    count: $pageSize\n    skip: $healthSystemSkip\n  ) {\n    totalItems\n    results {\n      ...EventSearchFields\n      __typename\n    }\n    __typename\n  }\n  reviewTab: searchEvents(\n    advancedSearchParameters: {declarationLocationId: $declarationLocationId, registrationStatuses: $reviewStatuses}\n    count: $pageSize\n    skip: $reviewSkip\n  ) {\n    totalItems\n    results {\n      ...EventSearchFields\n      __typename\n    }\n    __typename\n  }\n  rejectTab: searchEvents(\n    advancedSearchParameters: {declarationLocationId: $declarationLocationId, registrationStatuses: ["REJECTED"]}\n    count: $pageSize\n    skip: $rejectSkip\n    sortColumn: "createdAt.keyword"\n    sort: "asc"\n  ) {\n    totalItems\n    results {\n      ...EventSearchFields\n      __typename\n    }\n    __typename\n  }\n  approvalTab: searchEvents(\n    advancedSearchParameters: {declarationLocationId: $declarationLocationId, registrationStatuses: ["VALIDATED"]}\n    count: $pageSize\n    skip: $approvalSkip\n  ) {\n    totalItems\n    results {\n      ...EventSearchFields\n      __typename\n    }\n    __typename\n  }\n  externalValidationTab: searchEvents(\n    advancedSearchParameters: {declarationLocationId: $declarationLocationId, registrationStatuses: ["WAITING_VALIDATION"]}\n    count: $pageSize\n    skip: $externalValidationSkip\n  ) {\n    totalItems\n    results {\n      ...EventSearchFields\n      __typename\n    }\n    __typename\n  }\n  printTab: searchEvents(\n    advancedSearchParameters: {declarationLocationId: $declarationLocationId, registrationStatuses: ["REGISTERED"]}\n    count: $pageSize\n    skip: $printSkip\n  ) {\n    totalItems\n    results {\n      ...EventSearchFields\n      __typename\n    }\n    __typename\n  }\n  issueTab: searchEvents(\n    advancedSearchParameters: {declarationLocationId: $declarationLocationId, registrationStatuses: ["CERTIFIED"]}\n    count: $pageSize\n    skip: $issueSkip\n  ) {\n    totalItems\n    results {\n      ...EventSearchFields\n      __typename\n    }\n    __typename\n  }\n}\n',
    }),
    { headers: { authorization: `Bearer ${token}` } }
  );

  const { data } = response.json() as {
    data: { reviewTab: { results: any[] } };
  };

  return data.reviewTab.results;
}

export const options = {
  iterations: 1,
  name: "1500 records - retrieve ready for review record audit with id",
};

export function setup() {
  const token = getToken("k.mweene", "test");
  const declarations = getDeclarations(token);

  console.log("Found declarations", declarations.length);

  return { token, declarations };
}

type Context = ReturnType<typeof setup>;

export default function ({ token, declarations }: Context) {
  const declaration =
    declarations[Math.floor(Math.random() * declarations.length)];

  const response = fetchDeclaration(token, declaration.id);

  check(response, {
    "is status 200": (r) => r.status === 200,
    "processing < 5s": (r) => r.timings.waiting < 5000,
  });
}
