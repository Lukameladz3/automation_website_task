import { expect, isolatedTest as test } from "@fixtures/index";
import { PostArraySchema, PostSchema } from "@models/JsonPlaceholderModels";
import { JsonPlaceholderTestData } from "@constants/JsonPlaceholderTestData";

test.describe("JSONPlaceholder API - Part 1 & 2: GET Posts", () => {
  test("TC 1.1: Get All Posts - Status 200, JSON content-type, response time < 800ms", async ({
    jsonPlaceholderSteps,
  }) => {
    const startTime = Date.now();
    const response = await jsonPlaceholderSteps.sendGetAllPostsRequest();
    const responseTime = Date.now() - startTime;

    await jsonPlaceholderSteps.verifyStatusCode(response, 200);
    await jsonPlaceholderSteps.verifyJsonContentType(response);
    await jsonPlaceholderSteps.verifyResponseTime(responseTime);

    const posts = await jsonPlaceholderSteps.parsePostsArray(response);
    await jsonPlaceholderSteps.verifyPostsCount(
      posts,
      JsonPlaceholderTestData.GET_POSTS.TOTAL_POSTS_COUNT,
    );
  });

  test("TC 1.2: Sort Order - Verify ascending ID order", async ({
    jsonPlaceholderSteps,
  }) => {
    const response = await jsonPlaceholderSteps.sendGetAllPostsRequest();
    await jsonPlaceholderSteps.verifyStatusCode(response, 200);

    const posts = await jsonPlaceholderSteps.parsePostsArray(response);
    await jsonPlaceholderSteps.verifyPostsSortedById(posts);
  });

  test("TC 1.3: Data Types - Validate id, userId are numbers; title, body are strings", async ({
    jsonPlaceholderSteps,
  }) => {
    const response = await jsonPlaceholderSteps.sendGetAllPostsRequest();
    await jsonPlaceholderSteps.verifyStatusCode(response, 200);

    const posts = await jsonPlaceholderSteps.parsePostsArray(response);
    await jsonPlaceholderSteps.verifyPostDataTypes(posts[0]);
  });

  test("TC 1.4: Filter Check - GET /posts?userId=1 returns 10 items with userId=1", async ({
    jsonPlaceholderSteps,
  }) => {
    const userId = JsonPlaceholderTestData.POST.USER_ID;
    const response =
      await jsonPlaceholderSteps.sendGetPostsByUserIdRequest(userId);
    await jsonPlaceholderSteps.verifyStatusCode(response, 200);

    const posts = await jsonPlaceholderSteps.parsePostsArray(response);
    await jsonPlaceholderSteps.verifyPostsCount(
      posts,
      JsonPlaceholderTestData.GET_POSTS.USER_1_POSTS_COUNT,
    );
    await jsonPlaceholderSteps.verifyAllPostsBelongToUser(posts, userId);
  });

  test("TC 2.1: Get Post 99 - Verify userId=10, id=99, non-empty title/body", async ({
    jsonPlaceholderSteps,
  }) => {
    const postId = JsonPlaceholderTestData.GET_POSTS.VALID_POST_ID;
    const response = await jsonPlaceholderSteps.sendGetPostRequest(postId);
    await jsonPlaceholderSteps.verifyStatusCode(response, 200);

    const post = await jsonPlaceholderSteps.parsePost(response);
    await jsonPlaceholderSteps.verifyPostId(post, postId);
    await jsonPlaceholderSteps.verifyPostUserId(
      post,
      JsonPlaceholderTestData.GET_POSTS.VALID_POST_USER_ID,
    );
    await jsonPlaceholderSteps.verifyPostHasTitle(post);
    await jsonPlaceholderSteps.verifyPostHasBody(post);
  });

  test("TC 2.2: Negative - Not Found - GET /posts/150 returns 404 with empty object", async ({
    jsonPlaceholderSteps,
  }) => {
    const postId = JsonPlaceholderTestData.GET_POSTS.NON_EXISTENT_POST_ID;
    const response = await jsonPlaceholderSteps.sendGetPostRequest(postId);
    await jsonPlaceholderSteps.verifyStatusCode(response, 404);
    await jsonPlaceholderSteps.verifyEmptyBody(response);
  });

  test("TC 2.3: Negative - Invalid ID - GET /posts/abc returns 404 or 400", async ({
    jsonPlaceholderService,
  }) => {
    // Send GET /posts/abc by constructing the URL directly
    const response = await jsonPlaceholderService.getPostById(
      JsonPlaceholderTestData.GET_POSTS.INVALID_POST_ID as unknown as number,
    );
    // Verify status 404 or 400 (graceful error handling)
    const status = response.status();
    expect(JsonPlaceholderTestData.STATUS_CODES.ERROR_CODES).toContain(status);
  });
});
