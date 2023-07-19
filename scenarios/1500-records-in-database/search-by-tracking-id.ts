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

function fetchDeclarationByTrackingID(token: string, trackingId: string) {
  return http.post(
    `http://localhost:7070/graphql`,
    JSON.stringify({
      operationName: "searchEvents",
      variables: {
        advancedSearchParameters: {
          declarationLocationId: "",
          trackingId: trackingId,
          nationalId: "",
          registrationNumber: "",
          contactNumber: "",
          name: "",
        },
        sort: "DESC",
      },
      query:
        "query searchEvents($advancedSearchParameters: AdvancedSearchParametersInput!, $sort: String, $count: Int, $skip: Int) {\n  searchEvents(\n    advancedSearchParameters: $advancedSearchParameters\n    sort: $sort\n    count: $count\n    skip: $skip\n  ) {\n    totalItems\n    results {\n      id\n      type\n      registration {\n        status\n        contactNumber\n        trackingId\n        registrationNumber\n        registeredLocationId\n        duplicates\n        assignment {\n          userId\n          firstName\n          lastName\n          officeName\n          __typename\n        }\n        createdAt\n        modifiedAt\n        __typename\n      }\n      operationHistories {\n        operationType\n        operatedOn\n        operatorRole\n        operatorName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        operatorOfficeName\n        operatorOfficeAlias\n        notificationFacilityName\n        notificationFacilityAlias\n        rejectReason\n        rejectComment\n        __typename\n      }\n      ... on BirthEventSearchSet {\n        dateOfBirth\n        childName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        __typename\n      }\n      ... on DeathEventSearchSet {\n        dateOfDeath\n        deceasedName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        __typename\n      }\n      ... on MarriageEventSearchSet {\n        dateOfMarriage\n        brideName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        groomName {\n          firstNames\n          familyName\n          use\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n",
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
  iterations: 10,
  name: "1500 records - search by tracking id",
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

  const response = fetchDeclarationByTrackingID(
    token,
    declaration.registration.trackingId
  );

  check(response, {
    "is status 200": (r) => r.status === 200,
    "processing < 5s": (r) => r.timings.waiting < 5000,
    "one record found": (r) => {
      const json = r?.json() as Record<any, any>;
      return json.data?.searchEvents.results.length === 1;
    },
  });
}
