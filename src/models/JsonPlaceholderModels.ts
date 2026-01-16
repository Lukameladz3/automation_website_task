import { z } from 'zod';

// Post Schemas
export const PostSchema = z.object({
    body: z.string(),
    id: z.number(),
    title: z.string(),
    userId: z.number(),
}).strict();

export type Post = z.infer<typeof PostSchema>;

export const PostArraySchema = z.array(PostSchema);

// Create Post Request/Response Schemas
export const CreatePostRequestSchema = z.object({
    body: z.string(),
    title: z.string(),
    userId: z.number(),
}).strict();

export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;

export const CreatePostResponseSchema = z.object({
    body: z.string(),
    id: z.number(),
    title: z.string(),
    userId: z.number(),
}).strict();

export type CreatePostResponse = z.infer<typeof CreatePostResponseSchema>;

// Update Post Request Schema
export const UpdatePostRequestSchema = z.object({
    body: z.string().optional(),
    id: z.number().optional(),
    title: z.string().optional(),
    userId: z.number().optional(),
}).strict();

export type UpdatePostRequest = z.infer<typeof UpdatePostRequestSchema>;

// User Schemas
export const GeoSchema = z.object({
    lat: z.string(),
    lng: z.string(),
}).strict();

export type Geo = z.infer<typeof GeoSchema>;

export const AddressSchema = z.object({
    city: z.string(),
    geo: GeoSchema,
    street: z.string(),
    suite: z.string(),
    zipcode: z.string(),
}).strict();

export type Address = z.infer<typeof AddressSchema>;

export const CompanySchema = z.object({
    bs: z.string(),
    catchPhrase: z.string(),
    name: z.string(),
}).strict();

export type Company = z.infer<typeof CompanySchema>;

export const UserSchema = z.object({
    address: AddressSchema,
    company: CompanySchema,
    email: z.string().email(),
    id: z.number(),
    name: z.string(),
    phone: z.string(),
    username: z.string(),
    website: z.string(),
}).strict();

export type User = z.infer<typeof UserSchema>;

export const UserArraySchema = z.array(UserSchema);
