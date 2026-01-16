import { APIRequestContext } from '@playwright/test';
import { BrandApiSteps } from '@api/api-steps/BrandApiSteps';
import { ProductApiSteps } from '@api/api-steps/ProductApiSteps';
import { UserApiSteps } from '@api/api-steps/UserApiSteps';
import { BrandService } from '@api/Services/BrandService';
import { JsonPlaceholderService } from '@api/Services/JsonPlaceholderService';
import { ProductService } from '@api/Services/ProductService';
import { SearchService } from '@api/Services/SearchService';
import { UserService } from '@api/Services/UserService';

export type ApiFixtures = {
    brandApiSteps: BrandApiSteps;
    brandService: BrandService;
    jsonPlaceholderService: JsonPlaceholderService;
    productApiSteps: ProductApiSteps;
    productService: ProductService;
    searchService: SearchService;
    userApiSteps: UserApiSteps;
    userService: UserService;
};

export const apiFixtures = {
    brandApiSteps: async ({ brandService }: { brandService: BrandService }, use: (s: BrandApiSteps) => Promise<void>) => {
        await use(new BrandApiSteps(brandService));
    },
    brandService: async ({ request }: { request: APIRequestContext }, use: (s: BrandService) => Promise<void>) => {
        await use(new BrandService(request));
    },
    productApiSteps: async ({ productService, searchService }: { productService: ProductService; searchService: SearchService }, use: (s: ProductApiSteps) => Promise<void>) => {
        await use(new ProductApiSteps(productService, searchService));
    },
    productService: async ({ request }: { request: APIRequestContext }, use: (s: ProductService) => Promise<void>) => {
        await use(new ProductService(request));
    },
    searchService: async ({ request }: { request: APIRequestContext }, use: (s: SearchService) => Promise<void>) => {
        await use(new SearchService(request));
    },
    userApiSteps: async ({ userService }: { userService: UserService }, use: (s: UserApiSteps) => Promise<void>) => {
        await use(new UserApiSteps(userService));
    },
    userService: async ({ request }: { request: APIRequestContext }, use: (s: UserService) => Promise<void>) => {
        await use(new UserService(request));
    },
    jsonPlaceholderService: async ({ request }: { request: APIRequestContext }, use: (s: JsonPlaceholderService) => Promise<void>) => {
        await use(new JsonPlaceholderService(request));
    },
};