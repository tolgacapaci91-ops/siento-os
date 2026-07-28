/**
 * Unified Storage Service
 * Abstracting S3 buckets and local media storage according to Architecture Rule #7.
 */
export class StorageService {
  private static S3_BUCKET_URL = "https://s3.eu-central-1.amazonaws.com/sientoops-assets";

  /**
   * Resolves full asset URL whether it is an absolute HTTP URL, local path, or S3 key.
   */
  public static resolveUrl(path?: string, fallback: string = "/assets/placeholder.jpg"): string {
    if (!path) return fallback;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
      return path;
    }
    if (path.startsWith("/")) {
      return path;
    }
    return `${this.S3_BUCKET_URL}/${path}`;
  }

  /**
   * Helper for avatar images
   */
  public static getAvatarUrl(path?: string): string {
    return this.resolveUrl(
      path,
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    );
  }

  /**
   * Helper for course & video covers
   */
  public static getCourseCover(path?: string): string {
    return this.resolveUrl(
      path,
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"
    );
  }

  /**
   * Helper for workshop covers
   */
  public static getWorkshopCover(path?: string): string {
    return this.resolveUrl(
      path,
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800"
    );
  }
}
