import { HttpCourseRepository } from "./http/HttpCourseRepository";
import { HttpLessonRepository } from "./http/HttpLessonRepository";
import { HttpDocumentRepository } from "./http/HttpDocumentRepository";
import { HttpWorkshopRepository } from "./http/HttpWorkshopRepository";
import { HttpCategoryRepository } from "./http/HttpCategoryRepository";
import { HttpBadgeRepository } from "./http/HttpBadgeRepository";

export * from "./interfaces";
export * from "./categoryStore";

// Central Repository Singletons
// When switching to Laravel 12 API in production, only set NEXT_PUBLIC_API_BASE_URL="https://api.sientoops.com/api/v1"
export const courseRepository = new HttpCourseRepository();
export const lessonRepository = new HttpLessonRepository();
export const documentRepository = new HttpDocumentRepository();
export const workshopRepository = new HttpWorkshopRepository();
export const categoryRepository = new HttpCategoryRepository();
export const badgeRepository = new HttpBadgeRepository();
