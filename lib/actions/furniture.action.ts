"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/database";
import Furniture from "@/lib/database/models/furniture.model";
import Order from "@/lib/database/models/order.model";
import Event from "@/lib/database/models/event.model";
import User from "@/lib/database/models/user.model";
import Category from "@/lib/database/models/category.model";
import { handleError } from "@/lib/utils";

import {
  CreateUserParams,
  UpdateUserParams,
  GetAllFurnituresParams,
} from "@/types";
const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
};

const populateEvent = (query: any) => {
  return query;
  // .populate({
  //   path: "organizer",
  //   model: User,
  //   select: "_id firstName lastName",
  // })
  // .populate({ path: "category", model: Category, select: "_id name" })
};

// export async function createFurniture(furniture: any) {
//   try {
//     await connectToDatabase();
//     const newFurniture = await Furniture.create(furniture);
//     console.log("created furniture successfully !");
//     return JSON.parse(JSON.stringify(newFurniture));
//   } catch (error) {
//     console.error("Error creating furniture:", error);
//     throw new Error("Failed to create furniture");
//   }
// }
export async function createFurniture({
  furniture,
  userId,
  path = "/furnitures"
}: {
  furniture: any;
  userId: string;
  path?: string;
}) {
  try {
    await connectToDatabase();

    const newFurniture = await Furniture.create({
      ...furniture,
      provider: userId
    });

    if (!newFurniture) {
      throw new Error("Failed to create furniture");
    }

    if (path) {
      revalidatePath(path);
    }

    return JSON.parse(JSON.stringify(newFurniture));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create furniture");
  }
}
export async function getFurnitureById(furnitureId: string) {
  try {
    await connectToDatabase();

    const furniture = await Furniture.findById(furnitureId);

    if (!furniture) throw new Error("Furniture not found");
    return JSON.parse(JSON.stringify(furniture));
  } catch (error) {
    handleError(error);
  }
}
export async function getFurnituresByUser(userId: string) {
  try {
    await connectToDatabase();

    const furnitures = await Furniture.find({ provider: userId }).sort({ createdAt: 'desc' });

    return JSON.parse(JSON.stringify(furnitures));
  } catch (error) {
    handleError(error);
  }
}
// export async function updateFurniture(furnitureId: string, updates: Partial<typeof Furniture>) {
//   try {
//     await connectToDatabase();
//     const updatedFurniture = await Furniture.findByIdAndUpdate(furnitureId, updates, { new: true });
//     revalidatePath('/dashboard');
//     return JSON.parse(JSON.stringify(updatedFurniture));
//   } catch (error) {
//     handleError(error);
//   }
// }

export async function deleteFurniture(furnitureId: string) {
  try {
    await connectToDatabase();
    await Furniture.findByIdAndDelete(furnitureId);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    handleError(error);
  }
}

export async function updateFurniture(
  clerkId: string,
  furniture: UpdateUserParams
) {
  try {
    await connectToDatabase();

    const updatedFurniture = await Furniture.findOneAndUpdate(
      { clerkId },
      furniture,
      { new: true }
    );

    if (!updatedFurniture) throw new Error("Furniture update failed");
    return JSON.parse(JSON.stringify(updatedFurniture));
  } catch (error) {
    handleError(error);
  }
}
export async function getAllFurnitures({
  query,
  limit = 6,
  page,
  category,
}: GetAllFurnituresParams) {
  try {
    await connectToDatabase();

    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};
    const categoryCondition = category
      ? await getCategoryByName(category)
      : null;
    const conditions = {
      $and: [
        titleCondition,
        categoryCondition ? { category: categoryCondition._id } : {},
      ],
    };

    const skipAmount = (Number(page) - 1) * limit;
    const furnituresQuery = Furniture.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const furnitures = await populateEvent(furnituresQuery);
    const furnituresCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(furnitures)),
      totalPages: Math.ceil(furnituresCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
