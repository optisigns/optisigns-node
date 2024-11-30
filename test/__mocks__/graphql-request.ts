import { GraphQLClient } from "graphql-request";

// Mock implementation of GraphQLClient
const MockGraphQLClient = jest.fn().mockImplementation(() => ({
  request: jest.fn(),
  setHeader: jest.fn(),
  setHeaders: jest.fn(),
}));

export { MockGraphQLClient as GraphQLClient };
