import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function UsersPage() {
  // Fetch users on the server side
  const allUsers = await db.select().from(users);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      {allUsers.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="grid gap-4">
          {allUsers.map((user) => (
            <div key={user.id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Created: {user.createdAt?.toLocaleDateString()}
              </p>
              {user.emailVerified && (
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-2">
                  Verified
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
