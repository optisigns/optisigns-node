import { GraphQLClient } from "graphql-request";
import { AssetsModule } from "../../src/modules/assets";

describe("AssetsModule", () => {
  let assetsModule: AssetsModule;
  let mockClient: jest.Mocked<GraphQLClient>;

  beforeEach(() => {
    mockClient = new GraphQLClient("") as jest.Mocked<GraphQLClient>;
    assetsModule = new AssetsModule(mockClient);
  });

  describe("createWebsiteAppAsset", () => {
    it("should create website asset successfully", async () => {
      // Mock the GraphQL response for the SAVE_ASSET_MUTATION
      mockClient.request.mockResolvedValueOnce({
        saveAsset: {
          _id: "1",
          type: "web",
          webLink: "https://example.com",
          originalFileName: "Example Website",
        },
      });

      const result = await assetsModule.createWebsiteAppAsset(
        {
          url: "https://example.com",
          title: "Example Website",
        },
        "team-1"
      );

      expect(result._id).toBe("1");
      expect(result.type).toBe("web");
      expect(result.webLink).toBe("https://example.com");
      expect(result.originalFileName).toBe("Example Website");
    });
  });

  describe("modifyAssetSettings", () => {
    it("should modify asset settings successfully", async () => {
      // Mock the GraphQL response for the SAVE_ASSET_MUTATION
      mockClient.request.mockResolvedValueOnce({
        saveAsset: {
          _id: "1",
          originalFileName: "updated-name",
          type: "file",
        },
      });

      const result = await assetsModule.modifyAssetSettings(
        "1",
        { originalFileName: "updated-name" },
        "team-1"
      );

      expect(result._id).toBe("1");
      expect(result.originalFileName).toBe("updated-name");
      expect(result.type).toBe("file");
    });

    it("should handle modification errors", async () => {
      mockClient.request.mockRejectedValueOnce({
        response: { errors: [{ message: "Asset not found" }] },
      });

      await expect(
        assetsModule.modifyAssetSettings(
          "1",
          { originalFileName: "test" },
          "team-1"
        )
      ).rejects.toThrow(
        "Failed to modify file asset settings: Asset not found"
      );
    });
  });

  describe("deleteAssetById", () => {
    it("should delete asset successfully", async () => {
      mockClient.request.mockResolvedValueOnce({ deleteObjects: true });

      const result = await assetsModule.deleteAssetById("1", "team-1");
      expect(result).toBe(true);
    });

    it("should handle deletion errors", async () => {
      mockClient.request.mockRejectedValueOnce({
        response: { errors: [{ message: "Asset not found" }] },
      });

      await expect(
        assetsModule.deleteAssetById("invalid", "team-1")
      ).rejects.toThrow("Failed to delete asset: Asset not found");
    });
  });
});
