import { ReadEventCategoryDTO } from "./category.types";
import { ReadEventDTO } from "./event.types";

export enum RoleEnum {
    ADMIN = "admin",
    USER = "user",
    ORGANIZER = "organizer",
}

export interface CreateUserDTO {
    name?: string;
    email: string;
    phoneNumber?: string;
    interest?: string[];
    role: RoleEnum;
}

export interface ReadUserDTO extends CreateUserDTO {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    bookmarkedEvents?: ReadEventDTO[] | ReadEventDTO;
    recentlyViewed?: string[];
    ticketsPurchased?: ReadEventDTO[];
    bookmarkedEventsCount?: number;
    recentlyViewedCount?: number;
    ticketsPurchasedCount?: number;
}
