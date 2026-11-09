import React, { useState } from 'react';
import {
  FileText,
  Download,
  Search,
  CheckCircle2,
  Shield,
  Eye,
} from 'lucide-react';
import { ClientCredit, AppSettings } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { generateContractPdf } from '../utils/pdfGenerator';
import { Language, translations } from '../utils/translations';

interface ContractsViewProps {
  clients: ClientCredit[];
  onOpenContractPreview: (client: ClientCredit) => void;
  onSelectClient: (client: ClientCredit) => void;
  settings: AppSettings;
  lang?: Language;
}

export const ContractsView: React.FC<ContractsViewProps> = ({
  clients,
  onOpenContractPreview,
  settings,
  lang = 'ar',
}) => {
  const t = translations[lang];
  const [search, setSearch] = useState('');

  const filteredClients = clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.productName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4 text-[#24321D]">
      {/* Header */}
      <div className="pt-2">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C29B38]">
          {t.officialDocumentsTitle}
        </span>
        <h2 className="text-xl font-serif font-bold text-[#24321D]">
          {t.navContracts}
        </h2>
        <p className="text-xs text-[#6B7563]">
          {lang === 'ar' ? 'تيسير' : 'Taysir'} • {t.encryptedData}
        </p>
      </div>

      {/* Info card */}
      <div className="bg-gradient-to-br from-[#24321D] via-[#2E4025] to-[#1C2817] text-[#FAF8F5] p-4 rounded-3xl border border-[#3E5233] shadow-md space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D8B965]">
          <Shield className="w-4 h-4 text-[#D8B965]" />
          <span>{t.guarantorSection} & PDF</span>
        </div>
        <p className="text-xs text-[#E3DDD4] leading-relaxed">
          {t.legalNoticeBox}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#86917E] rtl:left-auto rtl:right-3.5" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 rounded-2xl bg-white border border-[#E0D7CC] text-xs sm:text-sm text-[#24321D] placeholder-[#9AA592] focus:outline-none focus:border-[#24321D] shadow-inner"
        />
      </div>

      {/* Contracts List */}
      <div className="space-y-3">
        {filteredClients.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8F5] rounded-3xl border border-[#E5DDD0] shadow-sm">
            <p className="text-sm font-semibold text-[#24321D]">{t.noClientsFound}</p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const paidCount = client.installments.filter((i) => i.status === 'paid').length;
            const isCompleted = client.status === 'completed' || paidCount === client.installments.length;

            return (
              <div
                key={client.id}
                className="bg-[#FAF8F5] rounded-3xl p-4 border border-[#E5DDD0] shadow-sm space-y-3 hover:border-[#24321D]/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold bg-[#ECE5DC] text-[#34472B] px-2 py-0.5 rounded-md border border-[#DDD4C7]">
                        {client.contractNumber}
                      </span>
                      <span className="text-[10px] text-[#7A8772]">
                        {new Date(client.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#24321D] mt-1">
                      {client.fullName}
                    </h3>
                    <p className="text-xs text-[#6B7563]">
                      {client.productName} • {client.city}
                    </p>
                  </div>

                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>{t.completedStatus}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ECE5DC] text-[#34472B] border border-[#DDD4C7]">
                      {paidCount}/{client.installments.length} {t.paidInstallments}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-[#F4EDE3] border border-[#E3D8CB] text-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#7A8772] block">{t.totalSalePriceLabel}</span>
                    <strong className="text-[#24321D]">{formatCurrency(client.totalPrice, settings.currency)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A8772] block">{t.downPaymentLabel}</span>
                    <span className="font-semibold text-emerald-800">{formatCurrency(client.advancePayment, settings.currency)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#7A8772] block">{t.remainingDue}</span>
                    <strong className="text-[#24321D]">{formatCurrency(client.remainingBalance, settings.currency)}</strong>
                  </div>
                </div>

                {/* Guarantor badge */}
                {client.guarantorName && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#6B7563] bg-[#ECE5DC]/60 px-3 py-1 rounded-xl">
                    <Shield className="w-3 h-3 text-[#C29B38]" />
                    <span>{t.guarantorNameLabel} : <strong className="text-[#24321D]">{client.guarantorName}</strong> ({client.guarantorRelation || 'Garant'})</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1 border-t border-[#ECE5DC]">
                  <button
                    type="button"
                    onClick={() => onOpenContractPreview(client)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#24321D] hover:bg-[#34472B] active:scale-95 text-[#FAF8F5] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C29B38]" />
                    <span>{t.btnViewContractPdf}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => generateContractPdf(client, settings)}
                    className="py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#ECE5DC] active:scale-95 text-[#24321D] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#DDD4C7] cursor-pointer shadow-xs transition-all"
                    title={t.btnDownloadContractPdf}
                  >
                    <Download className="w-3.5 h-3.5 text-[#24321D]" />
                    <span className="hidden sm:inline">PDF</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
