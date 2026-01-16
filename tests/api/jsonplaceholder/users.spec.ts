import { expect, isolatedTest as test } from "@fixtures/index";
import {
  UserArraySchema,
  UserSchema,
  PostArraySchema,
} from "@models/JsonPlaceholderModels";
import { JsonPlaceholderTestData } from "@constants/JsonPlaceholderTestData";

test.describe("JSONPlaceholder API - Part 4 & 5: GET Users and Data Consistency", () => {
  test("TC 4.1: Get All Users - Status 200, exactly 10 users", async ({
    jsonPlaceholderService,
  }) => {
    const response = await jsonPlaceholderService.getAllUsers();

    // Verify status code 200
    await expect(response, "GET /users should return 200 OK").toHaveStatusCode(
      200,
    );

    // Validate response schema
    const users = await response.json();
    const parsed = UserArraySchema.parse(users);

    // Verify the list contains exactly 10 users
    expect(parsed.length, "Should return exactly 10 users").toBe(
      JsonPlaceholderTestData.USERS.TOTAL_USERS_COUNT,
    );
  });

  test("TC 4.2: Deep Data User 5 - Verify nested Address, Geo, Company structure", async ({
    jsonPlaceholderService,
  }) => {
    const testUserId = JsonPlaceholderTestData.USERS.TEST_USER_ID;
    const userData = JsonPlaceholderTestData.USERS.USER_5;

    const response = await jsonPlaceholderService.getUserById(testUserId);

    await expect(
      response,
      `GET /users/${testUserId} should return 200 OK`,
    ).toHaveStatusCode(200);

    const user = await response.json();
    const parsed = UserSchema.parse(user);

    // Verify User 5 basic data
    expect(parsed.id, `User id should be ${userData.ID}`).toBe(userData.ID);
    expect(parsed.name, `User name should be ${userData.NAME}`).toBe(
      userData.NAME,
    );
    expect(parsed.username, `Username should be ${userData.USERNAME}`).toBe(
      userData.USERNAME,
    );
    expect(parsed.email, `Email should be ${userData.EMAIL}`).toBe(
      userData.EMAIL,
    );

    // Verify Address structure
    expect(
      parsed.address.street,
      `Street should be ${userData.ADDRESS.STREET}`,
    ).toBe(userData.ADDRESS.STREET);
    expect(
      parsed.address.suite,
      `Suite should be ${userData.ADDRESS.SUITE}`,
    ).toBe(userData.ADDRESS.SUITE);
    expect(parsed.address.city, `City should be ${userData.ADDRESS.CITY}`).toBe(
      userData.ADDRESS.CITY,
    );
    expect(
      parsed.address.zipcode,
      `Zipcode should be ${userData.ADDRESS.ZIPCODE}`,
    ).toBe(userData.ADDRESS.ZIPCODE);

    // Verify Geo structure (nested in Address)
    expect(
      parsed.address.geo.lat,
      `Latitude should be ${userData.ADDRESS.GEO.LAT}`,
    ).toBe(userData.ADDRESS.GEO.LAT);
    expect(
      parsed.address.geo.lng,
      `Longitude should be ${userData.ADDRESS.GEO.LNG}`,
    ).toBe(userData.ADDRESS.GEO.LNG);

    // Verify Company structure
    expect(
      parsed.company.name,
      `Company name should be ${userData.COMPANY.NAME}`,
    ).toBe(userData.COMPANY.NAME);
    expect(
      parsed.company.catchPhrase,
      `Company catchPhrase should be ${userData.COMPANY.CATCH_PHRASE}`,
    ).toBe(userData.COMPANY.CATCH_PHRASE);
    expect(
      parsed.company.bs,
      `Company bs should be ${userData.COMPANY.BS}`,
    ).toBe(userData.COMPANY.BS);

    // Verify phone and website
    expect(parsed.phone, `Phone should be ${userData.PHONE}`).toBe(
      userData.PHONE,
    );
    expect(parsed.website, `Website should be ${userData.WEBSITE}`).toBe(
      userData.WEBSITE,
    );
  });

  test("TC 4.3: Data Range - Verify geo.lat (-90 to 90), geo.lng (-180 to 180)", async ({
    jsonPlaceholderService,
  }) => {
    const response = await jsonPlaceholderService.getAllUsers();

    await expect(response, "GET /users should return 200 OK").toHaveStatusCode(
      200,
    );

    const users = await response.json();
    const parsed = UserArraySchema.parse(users);

    // Verify geographic coordinate ranges for all users
    const geoRanges = JsonPlaceholderTestData.USERS.GEO_RANGES;
    const latitudes = parsed.map((user) => parseFloat(user.address.geo.lat));
    const longitudes = parsed.map((user) => parseFloat(user.address.geo.lng));

    const allLatitudesValid = latitudes.every(
      (lat) => lat >= geoRanges.LAT_MIN && lat <= geoRanges.LAT_MAX,
    );
    const allLongitudesValid = longitudes.every(
      (lng) => lng >= geoRanges.LNG_MIN && lng <= geoRanges.LNG_MAX,
    );

    expect(
      allLatitudesValid,
      `All latitudes should be between ${geoRanges.LAT_MIN} and ${geoRanges.LAT_MAX}`,
    ).toBe(true);
    expect(
      allLongitudesValid,
      `All longitudes should be between ${geoRanges.LNG_MIN} and ${geoRanges.LNG_MAX}`,
    ).toBe(true);
  });

  test("TC 5.1: Cross-Check User 5 - Compare /users/5 with /users list", async ({
    jsonPlaceholderService,
  }) => {
    const testUserId = JsonPlaceholderTestData.USERS.TEST_USER_ID;

    // Get all users
    const allUsersResponse = await jsonPlaceholderService.getAllUsers();
    await expect(
      allUsersResponse,
      "GET /users should return 200 OK",
    ).toHaveStatusCode(200);

    const allUsers = await allUsersResponse.json();
    const parsedAllUsers = UserArraySchema.parse(allUsers);

    // Find User 5 in the list
    const userFromList = parsedAllUsers.find((user) => user.id === testUserId);
    expect(
      userFromList,
      `User ${testUserId} should be found in the /users list`,
    ).toBeDefined();

    // Get User 5 directly
    const userResponse = await jsonPlaceholderService.getUserById(testUserId);
    await expect(
      userResponse,
      `GET /users/${testUserId} should return 200 OK`,
    ).toHaveStatusCode(200);

    const userDirect = await userResponse.json();
    const parsedUserDirect = UserSchema.parse(userDirect);

    // Compare the entire JSON response - they must be identical
    expect(
      parsedUserDirect,
      `User ${testUserId} from /users/${testUserId} should match User ${testUserId} from /users list`,
    ).toEqual(userFromList);
  });

  test("TC 5.2: Relational Check - Verify User 5's posts exist and belong to User 5", async ({
    jsonPlaceholderService,
  }) => {
    const testUserId = JsonPlaceholderTestData.USERS.TEST_USER_ID;

    // Fetch User 5 to confirm it exists
    const userResponse = await jsonPlaceholderService.getUserById(testUserId);
    await expect(
      userResponse,
      `GET /users/${testUserId} should return 200 OK`,
    ).toHaveStatusCode(200);

    const user = await userResponse.json();
    const parsedUser = UserSchema.parse(user);
    expect(parsedUser.id, `User id should be ${testUserId}`).toBe(testUserId);

    // Fetch posts for User 5
    const postsResponse =
      await jsonPlaceholderService.getPostsByUserId(testUserId);
    await expect(
      postsResponse,
      `GET /posts?userId=${testUserId} should return 200 OK`,
    ).toHaveStatusCode(200);

    const posts = await postsResponse.json();
    const parsedPosts = PostArraySchema.parse(posts);

    // Verify the list of posts is not empty
    expect(
      parsedPosts.length,
      `User ${testUserId} should have posts`,
    ).toBeGreaterThan(0);

    // Verify all posts belong only to User 5
    const allPostsBelongToUser = parsedPosts.every(
      (post) => post.userId === testUserId,
    );
    expect(
      allPostsBelongToUser,
      `All posts should belong to User ${testUserId}`,
    ).toBe(true);
  });
});
