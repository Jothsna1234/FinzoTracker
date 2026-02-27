// "use server";


// import { db } from "@/lib/prisma";
// import {auth} from "@clerk/nextjs/server";
// import { revalidatePath } from "next/cache";
// const serializeTransaction    =(obj) =>{
//     const serialized ={ ...obj};
//     if(obj.balance){
//         serialized.balance=obj.balance.toNumber();
        
//     }
//     if (obj.amount) {
//     serialized.amount = obj.amount.toNumber();
//   }
//   return serialized;
// }


// export async function createAccount(data){
//     try{
//         const{userId} =await auth();
//         if(!userId) throw new Error("Unauthorized");
//         const user =await db.user.findUnique({
//             where: {clerkUserId:userId},
//         });
//         if(!user){
//             throw new Error("user not found");
//         }


// //Convert balance to float before saving
// const balanceFloat =parseFloat(data.balance);
// if(isNaN(balanceFloat)){
//     throw new Error("Invalid balance amount");

// }

// //Check if this i sthe user's first account
// const existingAccounts= await db.account.findMany({
//     where: {userId:user.id},

// })

// const shouldBeDefault=existingAccounts.length === 0? true :data.isDefault;

// //If this account should be default,unset other default accounts
// if(shouldBeDefault){
//     await db.account.updateMany({
//         where:{userId:user.id,isDefault:true},
//         data:{isDefault:false},
//     });

// }

//     const account = await db.account.create({
//       data: {
//         ...data,
//         balance: balanceFloat,
//         userId: user.id,
//         isDefault: shouldBeDefault, // Override the isDefault based on our logic
//       },
//     });
//  const serializedAccount=serializeTransaction(account);
//  revalidatePath("/dashboard");
//  return {success:true,data:serializedAccount};


//     }catch(error){
// throw new Error(error.message);
//     }
// }

// export async function getUserAccounts(){
//     const{userId} =await auth();
//         if(!userId) throw new Error("Unauthorized");
//         const user =await db.user.findUnique({
//             where: {clerkUserId:userId},
//         });
//         if(!user){
//             throw new Error("user not found");
//         }

//         const accounts=await db.account.findMany({
//             where:{userId:user.id},
//             orderBy:{createdAt:"desc"},
//             include:{
//                 _count:{
//                     select:{
//                         transactions:true,
//                     }
//                 }
//             }
//         })
//         const serializedAccount=accounts.map(serializeTransaction);
//         return serializedAccount;

// }


// export async function getDashboardData() {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   // Get all user transactions
//   const transactions = await db.transaction.findMany({
//     where: { userId: user.id },
//     orderBy: { date: "desc" },
//   });

//   return transactions.map(serializeTransaction);
// }








"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/* -------------------- Utils -------------------- */

const serializeTransaction = (obj) => {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }

  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }

  return serialized;
};

/* -------------------- User Helper -------------------- */
// 👉 Auto-create user in DB if not exists (IMPORTANT FIX)
async function getOrCreateUser(clerkUserId) {
  let user = await db.user.findUnique({
    where: { clerkUserId },
  });

  if (!user) {
    user = await db.user.create({
      data: {
        clerkUserId,
      },
    });
  }

  return user;
}

/* -------------------- Create Account -------------------- */

export async function createAccount(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await getOrCreateUser(userId);

    // Convert balance to number
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    // Check existing accounts
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    // If default, unset previous default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: serializeTransaction(account),
    };
  } catch (error) {
    console.error(error);
    return { success: false, error: error.message };
  }
}

/* -------------------- Get User Accounts -------------------- */

export async function getUserAccounts() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await getOrCreateUser(userId);

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return accounts.map(serializeTransaction);
  } catch (error) {
    console.error(error);
    return [];
  }
}

/* -------------------- Dashboard Data -------------------- */

export async function getDashboardData() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await getOrCreateUser(userId);

    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });

    return transactions.map(serializeTransaction);
  } catch (error) {
    console.error(error);
    return [];
  }
}