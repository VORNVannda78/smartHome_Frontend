import type { User } from "../store/appStore";

export type PlanId = User["plan"];

export interface PlanPolicy {
  id: PlanId;
  name: string;
  nameKh: string;
  price: string;
  roomLimit: number | null;
  support: string;
  description: string;
}

export const PLAN_POLICIES: Record<PlanId, PlanPolicy> = {
  free: {
    id: "free",
    name: "Free",
    nameKh: "ឥតគិតថ្លៃ",
    price: "$0/ខែ",
    roomLimit: 5,
    support: "Community",
    description: "សម្រាប់ម្ចាស់ផ្ទះជួលតូចៗ ចាប់ផ្ដើមប្រើបានភ្លាម",
  },
  pro: {
    id: "pro",
    name: "Pro",
    nameKh: "ប្រូ",
    price: "$5/ខែ",
    roomLimit: 50,
    support: "Priority",
    description: "សម្រាប់អគារជួលមធ្យម ត្រូវការគ្រប់គ្រងលម្អិត",
  },
  business: {
    id: "business",
    name: "Business",
    nameKh: "អាជីវកម្ម",
    price: "$15/ខែ",
    roomLimit: null,
    support: "Dedicated",
    description: "សម្រាប់អាជីវកម្មមានបន្ទប់ ឬអគារច្រើន",
  },
};

export function getPlanPolicy(plan?: PlanId | string | null): PlanPolicy {
  if (plan === "pro" || plan === "business") return PLAN_POLICIES[plan];
  return PLAN_POLICIES.free;
}

export function getRoomLimitLabel(policy: PlanPolicy): string {
  return policy.roomLimit === null ? "គ្មានដែនកំណត់" : `${policy.roomLimit} បន្ទប់`;
}

export function getRemainingRooms(policy: PlanPolicy, currentRooms: number): number | null {
  if (policy.roomLimit === null) return null;
  return Math.max(policy.roomLimit - currentRooms, 0);
}

export function canAddRoom(policy: PlanPolicy, currentRooms: number, requested = 1): boolean {
  if (policy.roomLimit === null) return true;
  return currentRooms + requested <= policy.roomLimit;
}

export function getUsagePercent(policy: PlanPolicy, currentRooms: number): number {
  if (policy.roomLimit === null) return 100;
  if (policy.roomLimit <= 0) return 100;
  return Math.min(Math.round((currentRooms / policy.roomLimit) * 100), 100);
}
