import { useState } from 'react';
import { PaymentReceipt } from '@/shared/types/payment';
import { ReceiptCard } from './receipt-card';
import { PaginationGlobal } from '@/shared/components/pagination-global';

interface ReceiptCardGridProps {
  receipts: PaymentReceipt[];
  onApprove: (receipt: PaymentReceipt) => void;
  onReject: (receipt: PaymentReceipt) => void;
  disabled?: boolean;
  pageSize?: number;
}

export function ReceiptCardGrid({
  receipts,
  onApprove,
  onReject,
  disabled = false,
  pageSize = 4,
}: ReceiptCardGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const total = receipts.length;
  const totalPages = Math.ceil(total / pageSize);
  const paginated = receipts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full flex flex-col items-center">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full justify-center"
      >
        {paginated.map((receipt) => (
          <ReceiptCard
            key={receipt.id}
            receipt={receipt}
            onApprove={onApprove}
            onReject={onReject}
            disabled={disabled}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8">
          <PaginationGlobal
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
