"use client";

import { useQuery } from "@tanstack/react-query";
import { isToday } from "date-fns";
import { ClipboardList, Calendar, Users, Tag } from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { AdminRole } from "@/lib/types/user";
import { RoleProtectedPage } from "@/app/components/admin/RoleProtectedPage";
import { AuditLogsTable } from "@/app/components/admin/audit/AuditLogsTable";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="p-3 bg-orange-100 rounded-lg">
          <Icon className="w-6 h-6 text-orange-600" />
        </div>
      </div>
    </div>
  );
}

export default function AuditLogsClient() {
  const { data: logs = [], isLoading, isError } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: () => adminApi.getAuditLogs(500),
  });

  const today = logs.filter((log: any) => isToday(new Date(log.createdAt))).length;
  const activeAdmins = new Set(logs.map((log: any) => log.actorId)).size;
  const entityTypes = new Set(logs.map((log: any) => log.entityType)).size;

  return (
    <RoleProtectedPage
      allowedRoles={[AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.MANAGER]}
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-red-500">Failed to load audit logs.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Logs" value={logs.length} icon={ClipboardList} />
              <StatCard label="Logs Today" value={today} icon={Calendar} />
              <StatCard label="Active Admins" value={activeAdmins} icon={Users} />
              <StatCard label="Entity Types" value={entityTypes} icon={Tag} />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
              Audit logs provide a complete, read-only record of all system actions taken by administrators.
              These entries cannot be modified or deleted.
            </div>

            <AuditLogsTable data={logs} />
          </>
        )}
      </div>
    </RoleProtectedPage>
  );
}
