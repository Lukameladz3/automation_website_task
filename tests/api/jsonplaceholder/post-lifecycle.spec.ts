import { expect, isolatedTest as test } from "@fixtures/index";
import { RandomDataGenerator } from "@utils/RandomDataGenerator";
import { JsonPlaceholderTestData } from "@constants/JsonPlaceholderTestData";

test.describe("JSONPlaceholder API - E2E: Post Lifecycle Management", () => {
  test("Complete CRUD Lifecycle - Create, Read, Update, Verify, Delete, Final Check", async ({
    jsonPlaceholderSteps,
  }) => {
    // Generate random test data
    const originalTitle = RandomDataGenerator.postTitle();
    const originalBody = RandomDataGenerator.postBody();
    const updatedTitle = `Updated ${RandomDataGenerator.postTitle()}`;
    const userId = RandomDataGenerator.userId();

    // Step 1: Create post
    const createResponse = await jsonPlaceholderSteps.sendCreatePostRequest(
      originalTitle,
      originalBody,
      userId,
    );
    expect(createResponse).toHaveStatusCode(201);
    const createdPost =
      await jsonPlaceholderSteps.parseCreatedPost(createResponse);
    await jsonPlaceholderSteps.verifyPostTitle(createdPost, originalTitle);
    await jsonPlaceholderSteps.verifyPostBody(createdPost, originalBody);
    await jsonPlaceholderSteps.verifyPostUserId(createdPost, userId);
    await jsonPlaceholderSteps.verifyCreatedPostId(createdPost);

    // Step 2: Read existing post
    const existingPostId = JsonPlaceholderTestData.POST.EXISTING_POST_ID;
    const readResponse =
      await jsonPlaceholderSteps.sendGetPostRequest(existingPostId);
    expect(readResponse).toHaveStatusCode(200);
    const readPost = await jsonPlaceholderSteps.parsePost(readResponse);
    await jsonPlaceholderSteps.verifyPostId(readPost, existingPostId);
    await jsonPlaceholderSteps.verifyPostHasTitle(readPost);
    await jsonPlaceholderSteps.verifyPostHasBody(readPost);

    // Step 3: Update post
    const updateResponse = await jsonPlaceholderSteps.sendUpdatePostRequest(
      existingPostId,
      updatedTitle,
      originalBody,
      userId,
    );
    expect(updateResponse).toHaveStatusCode(200);
    const updatedPost = await jsonPlaceholderSteps.parsePost(updateResponse);
    await jsonPlaceholderSteps.verifyPostTitle(updatedPost, updatedTitle);
    await jsonPlaceholderSteps.verifyPostId(updatedPost, existingPostId);

    // Step 4: Verify post still accessible
    const verifyResponse =
      await jsonPlaceholderSteps.sendGetPostRequest(existingPostId);
    expect(verifyResponse).toHaveStatusCode(200);
    const verifiedPost = await jsonPlaceholderSteps.parsePost(verifyResponse);
    await jsonPlaceholderSteps.verifyPostId(verifiedPost, existingPostId);
    await jsonPlaceholderSteps.verifyPostHasTitle(verifiedPost);

    // Step 5: Delete post
    const deleteResponse =
      await jsonPlaceholderSteps.sendDeletePostRequest(existingPostId);
    await jsonPlaceholderSteps.verifyStatusCodeIsOneOf(deleteResponse, [200, 204]);

    // Step 6: Verify JSONPlaceholder doesn't actually delete (fake API limitation)
    const finalResponse =
      await jsonPlaceholderSteps.sendGetPostRequest(existingPostId);
    expect(finalResponse).toHaveStatusCode(200);
  });
});
