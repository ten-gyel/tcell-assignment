"use client";

const ROLES = ["Admin", "Manager", "Member", "Viewer"] as const;

type Role = (typeof ROLES)[number];

type User = {
  id: number;
  email: string;
  role: Role;
};

export default function UserTable({
  users,
  currentUserId,
  onRoleChange,
  savingUserId,
}: {
  users: User[];
  currentUserId?: number;
  onRoleChange: (userId: number, role: Role) => Promise<void>;
  savingUserId: number | null;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const disabled = savingUserId === user.id || user.id === currentUserId;
            return (
              <tr key={user.id} className="border-t">
                <td className="p-3">{user.id}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">
                  <select
                    className="border rounded px-2 py-1"
                    value={user.role}
                    disabled={disabled}
                    onChange={(e) => onRoleChange(user.id, e.target.value as Role)}
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {user.id === currentUserId && (
                    <span className="ml-2 text-xs text-slate-500">(you)</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
