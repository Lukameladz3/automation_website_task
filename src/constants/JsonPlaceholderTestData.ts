export const JsonPlaceholderTestData = {
  POST: {
    ORIGINAL_TITLE: "E2E Test Post",
    ORIGINAL_BODY: "This is an end-to-end test post",
    UPDATED_TITLE: "Updated E2E Test Post",
    USER_ID: 1,
    EXPECTED_CREATED_POST_ID: 101,
    EXISTING_POST_ID: 1,
    SECURITY_TEST_EXTRA_FIELD: { admin: true },
  },
  GET_POSTS: {
    TOTAL_POSTS_COUNT: 100,
    USER_1_POSTS_COUNT: 10,
    VALID_POST_ID: 99,
    VALID_POST_USER_ID: 10,
    NON_EXISTENT_POST_ID: 150,
    INVALID_POST_ID: "abc",
    MAX_RESPONSE_TIME_MS: 800,
  },
  USERS: {
    TOTAL_USERS_COUNT: 10,
    TEST_USER_ID: 5,
    USER_5: {
      ID: 5,
      NAME: "Chelsey Dietrich",
      USERNAME: "Kamren",
      EMAIL: "Lucio_Hettinger@annie.ca",
      ADDRESS: {
        STREET: "Skiles Walks",
        SUITE: "Suite 351",
        CITY: "Roscoeview",
        ZIPCODE: "33263",
        GEO: {
          LAT: "-31.8129",
          LNG: "62.5342",
        },
      },
      PHONE: "(254)954-1289",
      WEBSITE: "demarco.info",
      COMPANY: {
        NAME: "Keebler LLC",
        CATCH_PHRASE: "User-centric fault-tolerant solution",
        BS: "revolutionize end-to-end systems",
      },
    },
    GEO_RANGES: {
      LAT_MIN: -90,
      LAT_MAX: 90,
      LNG_MIN: -180,
      LNG_MAX: 180,
    },
  },
  STATUS_CODES: {
    SUCCESS_DELETE_CODES: [200, 204],
    ERROR_CODES: [400, 404],
  },
} as const;
