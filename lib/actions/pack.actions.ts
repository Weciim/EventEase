"use server";
import { connectToDatabase } from "@/lib/database";
import Furniture from "@/lib/database/models/furniture.model";
import Pack from "@/lib/database/models/pack.model";
import Event from "@/lib/database/models/event.model";
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
  return query.populate({
    path: "furnitures",
    model: Furniture,
    // select: "_id ",
  });
  // .populate({ path: "category", model: Category, select: "_id name" })
};

export async function createPack(pack: CreateUserParams) {
  try {
    await connectToDatabase();

    const newPack = await Pack.create(pack);
    return JSON.parse(JSON.stringify(newPack));
  } catch (error) {
    handleError(error);
  }
}
export async function getPackById(packId: string) {
  try {
    await connectToDatabase();

    const pack = await populateEvent(Pack.findById(packId));
    if (!pack) throw new Error("Pack not found");
    return JSON.parse(JSON.stringify(pack));
  } catch (error) {
    handleError(error);
  }
}
export async function updatePack(clerkId: string, pack: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedPack = await Pack.findOneAndUpdate({ clerkId }, pack, {
      new: true,
    });

    if (!updatedPack) throw new Error("pack update failed");
    return JSON.parse(JSON.stringify(updatedPack));
  } catch (error) {
    handleError(error);
  }
}
export async function getAllPacks({
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
    const packsQuery = Pack.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const packs = await populateEvent(packsQuery);
    const packsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(packs)),
      totalPages: Math.ceil(packsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}
