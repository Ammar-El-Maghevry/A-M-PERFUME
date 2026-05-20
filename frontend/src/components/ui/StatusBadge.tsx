import type { OrderStatus } from '@/lib/data';
import type { Dict } from '@/lib/dict';

interface StatusBadgeProps {
  status: OrderStatus;
  dict: Dict;
}

const CLS: Record<OrderStatus, string> = {
  PENDING: 'warn',
  CONFIRMED: 'success',
  PREPARING: 'success',
  SHIPPED: '',
  DELIVERED: 'dark',
  REJECTED: 'error',
  CANCELLED: 'error',
};

export function StatusBadge({ status, dict }: StatusBadgeProps) {
  return <span className={`badge ${CLS[status]}`.trim()}>{dict.status[status]}</span>;
}
