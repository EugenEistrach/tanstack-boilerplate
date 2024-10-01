import "dotenv/config";

import { db } from "@/app/db";
import {
  permissionTable,
  roleTable,
  roleToPermissionTable,
} from "@/app/db/schema";
import {
  accesses,
  actions,
  resources,
  type Access,
  type Action,
  type Resource,
} from "@/app/auth/auth-permissions";

console.log("Seeding database...");

const permissionsToCreate: {
  action: Action;
  resource: Resource;
  access: Access;
}[] = [];

for (const resource of resources) {
  for (const action of actions) {
    for (const access of accesses) {
      permissionsToCreate.push({ action, resource, access });
    }
  }
}

db.transaction((tx) => {
  console.log("Starting database transaction...");

  const insertedPermissions = tx
    .insert(permissionTable)
    .values(permissionsToCreate)
    .onConflictDoNothing()
    .returning()
    .all();
  console.log(`Inserted ${insertedPermissions.length} permissions`);

  const adminRole = tx
    .insert(roleTable)
    .values([
      {
        name: "admin",
        description: "Admin role",
      },
    ])
    .onConflictDoNothing()
    .returning()
    .get();
  console.log("Created Admin role");

  const userRole = tx
    .insert(roleTable)
    .values([
      {
        name: "user",
        description: "User role",
      },
    ])
    .onConflictDoNothing()
    .returning()
    .get();
  console.log("Created User role");

  const adminPermissionsToInsert = insertedPermissions
    .filter((permission) => permission.access === "any")
    .map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    }));

  if (adminPermissionsToInsert.length > 0) {
    const adminPermissions = tx
      .insert(roleToPermissionTable)
      .values(adminPermissionsToInsert)
      .onConflictDoNothing()
      .returning()
      .all();
    console.log(
      `Assigned ${adminPermissions.length} permissions to Admin role`
    );
  }

  const userPermissionsToInsert = insertedPermissions
    .filter((permission) => permission.access === "own")
    .map((permission) => ({
      roleId: userRole.id,
      permissionId: permission.id,
    }));

  if (userPermissionsToInsert.length > 0) {
    const userPermissions = tx
      .insert(roleToPermissionTable)
      .values(userPermissionsToInsert)
      .onConflictDoNothing()
      .returning()
      .all();
    console.log(`Assigned ${userPermissions.length} permissions to User role`);
  }

  console.log("Database transaction completed successfully");

  console.log("Database transaction completed successfully");
});

console.log("Database seeded successfully.");
