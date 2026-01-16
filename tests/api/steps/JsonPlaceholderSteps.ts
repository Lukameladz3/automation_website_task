import { expect } from "@playwright/test";
import type { APIResponse } from "@playwright/test";
import { JsonPlaceholderService } from "@api/Services/JsonPlaceholderService";
import {
  CreatePostResponseSchema,
  PostSchema,
  PostArraySchema,
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

  @step("Verify status 200 OK")
  async verifyStatus200(response: APIResponse) {
    await expect(response).toHaveStatusCode(200);
  }

  @step("Verify status 201 Created")
  async verifyStatus201(response: APIResponse) {
    await expect(response).toHaveStatusCode(201);
  }

  @step("Verify status 404 Not Found")
  async verifyStatus404(response: APIResponse) {
    await expect(response).toHaveStatusCode(404);
  }

  @step("Verify delete status")
  async verifyDeleteStatus(response: APIResponse) {
    const status = response.status();
    expect([200, 204]).toContain(status);
  }

  // ==================== Response Verification Steps ====================

  @step("Verify JSON content type")
  async verifyJsonContentType(response: APIResponse) {
    const contentType = response.headers()["content-type"];
    expect(contentType).toContain("application/json");
  }

  @step("Verify response time")
  async verifyResponseTime(
    responseTime: number,
    maxMs: number = JsonPlaceholderTestData.GET_POSTS.MAX_RESPONSE_TIME_MS,
  ) {
    expect.soft(responseTime).toBeWithinResponseTime(maxMs);
  }

  @step("Verify empty response body")
  async verifyEmptyBody(response: APIResponse) {
    const body = await response.json();
    expect(Object.keys(body).length).toBe(0);
  }

  // ==================== Parse Response Steps ====================

  @step("Parse post response")
  async parsePost(response: APIResponse) {
    const body = await response.json();
    return PostSchema.parse(body);
  }

  @step("Parse posts array response")
  async parsePostsArray(response: APIResponse) {
    const body = await response.json();
    return PostArraySchema.parse(body);
  }

  @step("Parse created post response")
  async parseCreatedPost(response: APIResponse) {
    const body = await response.json();
    return CreatePostResponseSchema.parse(body);
  }

  // ==================== Field Verification Steps ====================

  @step("Verify post ID")
  async verifyPostId(post: any, expectedId: number) {
    expect(post.id).toBe(expectedId);
  }

  @step("Verify post user ID")
  async verifyPostUserId(post: any, expectedUserId: number) {
    expect(post.userId).toBe(expectedUserId);
  }

  @step("Verify post title")
  async verifyPostTitle(post: any, expectedTitle: string) {
    expect(post.title).toBe(expectedTitle);
  }

  @step("Verify post body")
  async verifyPostBody(post: any, expectedBody: string) {
    expect(post.body).toBe(expectedBody);
  }

  @step("Verify post has title")
  async verifyPostHasTitle(post: any) {
    expect(post.title.length).toBeGreaterThan(0);
  }

  @step("Verify post has body")
  async verifyPostHasBody(post: any) {
    expect(post.body.length).toBeGreaterThan(0);
  }

  @step("Verify created post ID is 101")
  async verifyCreatedPostId(post: any) {
    expect(post.id).toBe(JsonPlaceholderTestData.POST.EXPECTED_CREATED_POST_ID);
  }

  // ==================== Array Verification Steps ====================

  @step("Verify posts count")
  async verifyPostsCount(posts: any[], expectedCount: number) {
    expect(posts.length).toBe(expectedCount);
  }

  @step("Verify posts sorted by ID")
  async verifyPostsSortedById(posts: { id: number }[]) {
    const ids = posts.map((post) => post.id);
    const sortedIds = [...ids].sort((a, b) => a - b);
    expect(ids).toEqual(sortedIds);
  }

  @step("Verify all posts belong to user")
  async verifyAllPostsBelongToUser(posts: any[], userId: number) {
    const allMatch = posts.every((post) => post.userId === userId);
    expect(allMatch).toBe(true);
  }

  // ==================== Data Type Verification Steps ====================

  @step("Verify post data types")
  async verifyPostDataTypes(post: any) {
    expect(typeof post.id).toBe("number");
    expect(typeof post.userId).toBe("number");
    expect(typeof post.title).toBe("string");
    expect(typeof post.body).toBe("string");
  }
}
