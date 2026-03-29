import { Metadata } from "next";
import AuditLogsClient from "./AuditLogsClient";

export const metadata: Metadata = { title: "Audit Logs" };

export default function AuditLogsPage() {
  return <AuditLogsClient />;
}
