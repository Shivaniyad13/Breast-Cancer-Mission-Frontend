"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getPublicCareProviders() {
  try {
    const providers = await db.careProvider.findMany({
      where: { isPublished: true },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });
    return { success: true, data: providers };
  } catch (error: any) {
    console.error("Error fetching public care providers:", error);
    return { success: false, error: "Failed to fetch care providers." };
  }
}

export async function getAllCareProvidersAdmin() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access." };
    }

    const providers = await db.careProvider.findMany({
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });
    return { success: true, data: providers };
  } catch (error: any) {
    console.error("Error fetching admin care providers:", error);
    return { success: false, error: "Failed to fetch care providers." };
  }
}

export async function createCareProvider(data: {
  name: string;
  category: string;
  specialization: string;
  city: string;
  state?: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  hours?: string;
  about: string;
  facilities: string[];
  rating?: number;
  reviews?: number;
  isVerified?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
}) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access." };
    }

    const provider = await db.careProvider.create({
      data: {
        name: data.name,
        category: data.category,
        specialization: data.specialization,
        city: data.city,
        state: data.state || null,
        phone: data.phone,
        email: data.email,
        address: data.address,
        website: data.website || null,
        hours: data.hours || null,
        about: data.about,
        facilities: data.facilities || [],
        rating: data.rating ?? 0,
        reviews: data.reviews ?? 0,
        isVerified: data.isVerified ?? false,
        isPublished: data.isPublished ?? false,
        sortOrder: data.sortOrder ?? 0,
      },
    });

    revalidatePath("/care/care-providers");
    revalidatePath("/admin/care-providers");

    return { success: true, data: provider };
  } catch (error: any) {
    console.error("Error creating care provider:", error);
    return { success: false, error: "Failed to create care provider." };
  }
}

export async function updateCareProvider(
  id: string,
  data: {
    name?: string;
    category?: string;
    specialization?: string;
    city?: string;
    state?: string;
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
    hours?: string;
    about?: string;
    facilities?: string[];
    rating?: number;
    reviews?: number;
    isVerified?: boolean;
    isPublished?: boolean;
    sortOrder?: number;
  }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access." };
    }

    const provider = await db.careProvider.update({
      where: { id },
      data,
    });

    revalidatePath("/care/care-providers");
    revalidatePath("/admin/care-providers");

    return { success: true, data: provider };
  } catch (error: any) {
    console.error("Error updating care provider:", error);
    return { success: false, error: "Failed to update care provider." };
  }
}

export async function deleteCareProvider(id: string) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access." };
    }

    await db.careProvider.delete({
      where: { id },
    });

    revalidatePath("/care/care-providers");
    revalidatePath("/admin/care-providers");

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting care provider:", error);
    return { success: false, error: "Failed to delete care provider." };
  }
}

export async function togglePublishCareProvider(id: string, isPublished: boolean) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== Role.ADMIN) {
      return { success: false, error: "Unauthorized access." };
    }

    const provider = await db.careProvider.update({
      where: { id },
      data: { isPublished },
    });

    revalidatePath("/care/care-providers");
    revalidatePath("/admin/care-providers");

    return { success: true, data: provider };
  } catch (error: any) {
    console.error("Error toggling publish care provider:", error);
    return { success: false, error: "Failed to update publication status." };
  }
}
