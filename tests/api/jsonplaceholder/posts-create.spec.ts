import { expect, isolatedTest as test } from "@fixtures/index";
import { RandomDataGenerator } from "@utils/RandomDataGenerator";
import { JsonPlaceholderTestData } from "@constants/JsonPlaceholderTestData";

test.describe("JSONPlaceholder API - Part 3: POST Create Post", () => {
  test("TC 3.1: Create Post - Status 201, echo check, id=101", async ({
    jsonPlaceholderSteps,
  }) => {
    const title = RandomDataGenerator.postTitle();
    const body = RandomDataGenerator.postBody();
    const userId = RandomDataGenerator.userId();

    const response = await jsonPlaceholderSteps.sendCreatePostRequest(
      title,
      body,
      userId,
    );
    await jsonPlaceholderSteps.verifyStatusCode(response, 201);

    const post = await jsonPlaceholderSteps.parseCreatedPost(response);
    await jsonPlaceholderSteps.verifyPostTitle(post, title);
    await jsonPlaceholderSteps.verifyPostBody(post, body);
    await jsonPlaceholderSteps.verifyPostUserId(post, userId);
    await jsonPlaceholderSteps.verifyCreatedPostId(post);
  });

  test("TC 3.2: Empty Payload - Test API strictness", async ({
    jsonPlaceholderSteps,
  }) => {
    const response =
      await jsonPlaceholderSteps.sendCreatePostRequestWithEmptyPayload();

    // The API accepts empty payload with 201 status
    await jsonPlaceholderSteps.verifyStatusCode(response, 201);
    await jsonPlaceholderSteps.verifyResponseIsObject(response);
    await jsonPlaceholderSteps.verifyResponseHasId(response);
  });

  test("TC 3.3: Security Check - Extra field filtering (admin: true)", async ({
    jsonPlaceholderSteps,
  }) => {
    const title = RandomDataGenerator.postTitle();
    const body = RandomDataGenerator.postBody();
    const userId = RandomDataGenerator.userId();
    const extraFields = JsonPlaceholderTestData.POST.SECURITY_TEST_EXTRA_FIELD;

    const response =
      await jsonPlaceholderSteps.sendCreatePostRequestWithExtraFields(
        title,
        body,
        userId,
        extraFields,
      );

    await jsonPlaceholderSteps.verifyStatusCode(response, 201);

    // Note: JSONPlaceholder echoes back all fields including extra ones
    // A production API should filter unknown fields for security
    await jsonPlaceholderSteps.verifyResponseFieldValue(
      response,
      "admin",
      true,
    );
    await jsonPlaceholderSteps.verifyResponseFieldValue(
      response,
      "title",
      title,
    );
    await jsonPlaceholderSteps.verifyResponseFieldValue(response, "body", body);
    await jsonPlaceholderSteps.verifyResponseFieldValue(
      response,
      "userId",
      userId,
    );
    await jsonPlaceholderSteps.verifyResponseHasId(response);
  });
});
