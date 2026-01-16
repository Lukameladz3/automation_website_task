import { expect } from "@playwright/test";
import type { APIResponse } from "@playwright/test";
import { JsonPlaceholderService } from "@api/Services/JsonPlaceholderService";
import {
  CreatePostResponseSchema,
  PostSchema,
  PostArraySchema,
  type Post,
  type CreatePostResponse,
} from "@models/JsonPlaceholderModels";
import { JsonPlaceholderTestData } from "@constants/JsonPlaceholderTestData";
import { step } from "@utils/StepDecorator";

/**
 * Reusable atomic steps for JSONPlaceholder API operations
 * Each step is small and focused on a single responsibility
 */
export class JsonPlaceholderSteps {
  constructor(private jsonPlaceholderService: JsonPlaceholderService) {}

  // ==================== API Call Steps ====================

  @step("Send create post request")
  async sendCreatePostRequest(
    title: string,
    body: string,
    userId: number,
  ): Promise<APIResponse> {
    const payload = { title, body, userId };
    return await this.jsonPlaceholderService.createPost(payload);
  }

  @step("Send create post request with empty payload")
  async sendCreatePostRequestWithEmptyPayload(): Promise<APIResponse> {
    return await this.jsonPlaceholderService.createPost({} as any);
  }

  @step("Send create post request with extra fields")
  async sendCreatePostRequestWithExtraFields(
    title: string,
    body: string,
    userId: number,
    extraFields: Record<string, any>,
  ): Promise<APIResponse> {
    const payload = { title, body, userId, ...extraFields };
    return await this.jsonPlaceholderService.createPost(payload as any);
  }

  @step("Send get post request")
  async sendGetPostRequest(postId: number): Promise<APIResponse> {
    return await this.jsonPlaceholderService.getPostById(postId);
  }

  @step("Send get all posts request")
  async sendGetAllPostsRequest(): Promise<APIResponse> {
    return await this.jsonPlaceholderService.getAllPosts();
  }

  @step("Send get posts by user ID request")
  async sendGetPostsByUserIdRequest(userId: number): Promise<APIResponse> {
    return await this.jsonPlaceholderService.getPostsByUserId(userId);
  }

  @step("Send update post request")
  async sendUpdatePostRequest(
    postId: number,
    title: string,
    body: string,
    userId: number,
  ): Promise<APIResponse> {
    const payload = { title, body, userId };
    return await this.jsonPlaceholderService.updatePost(postId, payload);
  }

  @step("Send delete post request")
  async sendDeletePostRequest(postId: number): Promise<APIResponse> {
    return await this.jsonPlaceholderService.deletePost(postId);
  }

  // ==================== Status Verification Steps ====================

  @step("Verify response status code")
  async verifyStatusCode(
    response: APIResponse,
    expectedStatus: number,
  ): Promise<void> {
    await expect(response).toHaveStatusCode(expectedStatus);
  }

  @step("Verify response status is one of")
  async verifyStatusCodeIsOneOf(
    response: APIResponse,
    allowedStatuses: number[],
  ): Promise<void> {
    const actualStatus = response.status();
    expect(allowedStatuses).toContain(actualStatus);
  }

  // ==================== Response Verification Steps ====================

  @step("Verify JSON content type")
  async verifyJsonContentType(response: APIResponse): Promise<void> {
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
  }

  @step("Verify response time")
  async verifyResponseTime(
    responseTime: number,
    maxMs: number = JsonPlaceholderTestData.GET_POSTS.MAX_RESPONSE_TIME_MS,
  ): Promise<void> {
    expect.soft(responseTime).toBeWithinResponseTime(maxMs);
  }

  @step("Verify empty response body")
  async verifyEmptyBody(response: APIResponse): Promise<void> {
    const body = await response.json();
    expect(Object.keys(body).length).toBe(0);
  }

  @step("Verify response is an object")
  async verifyResponseIsObject(response: APIResponse): Promise<void> {
    const body = await response.json();
    expect(body).toBeInstanceOf(Object);
  }

  @step("Verify response has ID field")
  async verifyResponseHasId(response: APIResponse): Promise<void> {
    const body = await response.json();
    expect(body.id).toExist();
  }

  // ==================== Parse Response Steps ====================

  @step("Parse post response")
  async parsePost(response: APIResponse): Promise<Post> {
    const body = await response.json();
    return PostSchema.parse(body);
  }

  @step("Parse posts array response")
  async parsePostsArray(response: APIResponse): Promise<Post[]> {
    const body = await response.json();
    return PostArraySchema.parse(body);
  }

  @step("Parse created post response")
  async parseCreatedPost(response: APIResponse): Promise<CreatePostResponse> {
    const body = await response.json();
    return CreatePostResponseSchema.parse(body);
  }

  // ==================== Field Verification Steps ====================

  @step("Verify post ID")
  async verifyPostId(
    post: Post | CreatePostResponse,
    expectedId: number,
  ): Promise<void> {
    expect(post.id).toBe(expectedId);
  }

  @step("Verify post user ID")
  async verifyPostUserId(
    post: Post | CreatePostResponse,
    expectedUserId: number,
  ): Promise<void> {
    expect(post.userId).toBe(expectedUserId);
  }

  @step("Verify post title")
  async verifyPostTitle(
    post: Post | CreatePostResponse,
    expectedTitle: string,
  ): Promise<void> {
    expect(post.title).toBe(expectedTitle);
  }

  @step("Verify post body")
  async verifyPostBody(
    post: Post | CreatePostResponse,
    expectedBody: string,
  ): Promise<void> {
    expect(post.body).toBe(expectedBody);
  }

  @step("Verify post has title")
  async verifyPostHasTitle(post: Post | CreatePostResponse): Promise<void> {
    expect(post.title.length).toBeGreaterThan(0);
  }

  @step("Verify post has body")
  async verifyPostHasBody(post: Post | CreatePostResponse): Promise<void> {
    expect(post.body.length).toBeGreaterThan(0);
  }

  @step("Verify created post ID is 101")
  async verifyCreatedPostId(post: CreatePostResponse): Promise<void> {
    expect(post.id).toBe(JsonPlaceholderTestData.POST.EXPECTED_CREATED_POST_ID);
  }

  @step("Verify response field value")
  async verifyResponseFieldValue(
    response: APIResponse,
    fieldName: string,
    expectedValue: any,
  ): Promise<void> {
    const body = await response.json();
    expect(body[fieldName]).toBe(expectedValue);
  }

  // ==================== Array Verification Steps ====================

  @step("Verify posts count")
  async verifyPostsCount(posts: Post[], expectedCount: number): Promise<void> {
    expect(posts.length).toBe(expectedCount);
  }

  @step("Verify posts sorted by ID")
  async verifyPostsSortedById(posts: Post[]): Promise<void> {
    const ids = posts.map((post) => post.id);
    const sortedIds = [...ids].sort((a, b) => a - b);
    expect(ids).toEqual(sortedIds);
  }

  @step("Verify all posts belong to user")
  async verifyAllPostsBelongToUser(
    posts: Post[],
    userId: number,
  ): Promise<void> {
    const allMatch = posts.every((post) => post.userId === userId);
    expect(allMatch).toBe(true);
  }

  // ==================== Data Type Verification Steps ====================

  @step("Verify post data types")
  async verifyPostDataTypes(post: Post): Promise<void> {
    expect(typeof post.id).toBe("number");
    expect(typeof post.userId).toBe("number");
    expect(typeof post.title).toBe("string");
    expect(typeof post.body).toBe("string");
  }
}
