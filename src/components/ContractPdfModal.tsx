import React, { useRef } from 'react';
import { X, Printer, Download, Check, Shield, FileText } from 'lucide-react';
import { ClientCredit, AppSettings } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { generateContractPdf } from '../utils/pdfGenerator';
import { Language, translations } from '../utils/translations';

interface ContractPdfModalProps {
  client: ClientCredit | null;
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  lang?: Language;
}

export const ContractPdfModal: React.FC<ContractPdfModalProps> = ({
  client,
  isOpen,
  onClose,
  settings,
  lang = 'ar',
}) => {
  const t = translations[lang];
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !client) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    generateContractPdf(client, settings);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] text-[#24321D] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#DDD4C7] overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Modal Controls Bar (hidden during window.print) */}
        <div className="bg-[#24321D] text-[#FAF8F5] px-5 py-3.5 flex items-center justify-between border-b border-[#34472B] no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#C29B38]" />
            <div>
              <h2 className="text-sm font-serif font-bold text-[#FAF8F5]">
                Contrat de Vente & Échéancier Officiel
              </h2>
              <span className="text-[10px] text-[#D0C7B9]">
                {client.contractNumber} • Signatures Vendeur & Client
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="py-1.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#FAF8F5] flex items-center gap-1.5 border border-white/15 cursor-pointer transition-all"
              title="Imprimer directement"
            >
              <Printer className="w-4 h-4 text-[#D0C7B9]" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="py-1.5 px-3 rounded-xl bg-[#C29B38] hover:bg-[#A9842A] text-xs font-bold text-[#1B2516] flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
              title="Télécharger fichier PDF"
            >
              <Download className="w-4 h-4" />
              <span>Télécharger PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#D0C7B9] transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Contract Document View */}
        <div
          ref={printAreaRef}
          className="printable-area p-6 sm:p-8 overflow-y-auto space-y-5 text-stone-900 bg-white"
        >
          {/* Header Banner */}
          <div className="border-b-2 border-[#24321D] pb-4 flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C29B38] block">
                DOCUMENT JURIDIQUE DE CRÉDIT & VENTE À TEMPÉRAMENT
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#24321D] uppercase">
                CONTRAT DE FACILITÉ DE PAIEMENT
              </h1>
              <p className="text-xs text-stone-600 font-arabic font-medium">
                عقد بيع بالتقسيط وإقرار استلام والتزام سداد
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold bg-stone-100 border border-stone-300 px-2.5 py-1 rounded-md block">
                {client.contractNumber}
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">
                Date : {new Date(client.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Parties: Vendeur & Acheteur */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Vendeur (Moi) */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="font-bold text-[#24321D] uppercase tracking-wider text-[11px] border-b border-stone-200 pb-1">
                Le Vendeur / Créancier (الطرف الأول - البائع)
              </div>
              <p><strong>Nom :</strong> {settings.sellerName}</p>
              <p><strong>Établissement :</strong> {settings.sellerBusinessName}</p>
              <p><strong>Téléphone :</strong> {settings.sellerPhone}</p>
              <p><strong>Adresse :</strong> {settings.sellerAddress}</p>
              {settings.sellerNationalId && (
                <p><strong>CIN :</strong> {settings.sellerNationalId}</p>
              )}
            </div>

            {/* Client (Acheteur) */}
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="font-bold text-[#24321D] uppercase tracking-wider text-[11px] border-b border-stone-200 pb-1">
                L&apos;Acheteur / Débiteur (الطرف الثاني - المشتري)
              </div>
              <p><strong>Nom complet :</strong> {client.fullName}</p>
              <p><strong>Téléphone :</strong> {client.phone}</p>
              <p><strong>WhatsApp :</strong> {client.whatsapp || client.phone}</p>
              <p><strong>CIN (الرقم القومي) :</strong> {client.nationalId || 'Fourni en copie'}</p>
              <p><strong>Adresse :</strong> {client.address} ({client.city})</p>
            </div>
          </div>

          {/* Garant / Cautionnaire */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
            <div className="font-bold text-[#24321D] uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-stone-200 pb-1">
              <Shield className="w-3.5 h-3.5 text-[#C29B38]" />
              <span>La Caution Solidaire & Garant (الضامن المتضامن)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
              <div>
                <span className="text-stone-500 block text-[10px]">Nom du garant :</span>
                <strong>{client.guarantorName || 'Non désigné'}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Relation :</span>
                <span>{client.guarantorRelation || 'Proche'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Téléphone garant :</span>
                <span>{client.guarantorPhone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Adresse :</span>
                <span>{client.guarantorAddress || 'Idem'}</span>
              </div>
            </div>
          </div>

          {/* Product & Financial Terms */}
          <div className="space-y-2">
            <div className="bg-[#24321D] text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
              Désignation du Matériel et Conditions Financières
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-stone-50 p-3 rounded-xl border border-stone-200 text-center">
              <div>
                <span className="text-stone-500 block text-[10px]">Matériel Vendu</span>
                <strong className="text-stone-900">{client.productName}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Prix Total Convenu</span>
                <strong className="text-stone-900">{formatCurrency(client.totalPrice, settings.currency)}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Avance Payée (Acompte)</span>
                <strong className="text-emerald-700">{formatCurrency(client.advancePayment, settings.currency)}</strong>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px]">Reste Net à Échelonner</span>
                <strong className="text-rose-700">{formatCurrency(client.remainingBalance, settings.currency)}</strong>
              </div>
            </div>
          </div>

          {/* Tableau des Échéances */}
          <div>
            <div className="text-xs font-bold text-[#24321D] uppercase tracking-wider mb-1.5">
              Tableau des Traites Mensuelles ({client.numberOfMonths} mensualités de {formatCurrency(client.monthlyInstallmentAmount, settings.currency)}) :
            </div>

            <div className="border border-stone-300 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 text-[10px] uppercase border-b border-stone-300">
                    <th className="py-2 px-3">N° Traite</th>
                    <th className="py-2 px-3">Date d&apos;Échéance</th>
                    <th className="py-2 px-3">Montant Dû</th>
                    <th className="py-2 px-3">Statut</th>
                    <th className="py-2 px-3">Mode Convenu</th>
                    <th className="py-2 px-3 text-right">Émargement / Reçu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {client.installments.map((inst) => (
                    <tr key={inst.id} className="hover:bg-stone-50/50">
                      <td className="py-2 px-3 font-bold">Traite N°{inst.number}</td>
                      <td className="py-2 px-3">{new Date(inst.dueDate).toLocaleDateString('fr-FR')}</td>
                      <td className="py-2 px-3 font-bold">{formatCurrency(inst.amount, settings.currency)}</td>
                      <td className="py-2 px-3">
                        {inst.status === 'paid' ? (
                          <span className="text-emerald-700 font-bold">Payé ({inst.paidDate ? new Date(inst.paidDate).toLocaleDateString('fr-FR') : 'Oui'})</span>
                        ) : inst.isUnpaidDeferred ? (
                          <span className="text-rose-700 font-bold">🔴 Impayé (Décalé à la fin)</span>
                        ) : inst.isDeferredExtension ? (
                          <span className="text-amber-700 font-bold">📅 Report fin (Mois {inst.deferredFromMonth})</span>
                        ) : inst.status === 'overdue' ? (
                          <span className="text-rose-700 font-bold">🔴 En retard</span>
                        ) : (
                          <span className="text-stone-500">En attente</span>
                        )}
                      </td>
                      <td className="py-2 px-3 capitalize">{inst.paymentMethod || client.preferredPaymentMethod}</td>
                      <td className="py-2 px-3 text-right text-stone-400 font-mono text-[10px]">
                        {inst.receiptNumber || '.....................'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Clauses */}
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[9px] text-stone-600 space-y-1">
            <p><strong>Article 1 : Réserve de propriété.</strong> Le vendeur conserve l&apos;entière propriété de l&apos;appareil jusqu&apos;au règlement intégral de la totalité des traites mentionnées au présent contrat.</p>
            <p><strong>Article 2 : Engagement de paiement.</strong> L&apos;acheteur s&apos;engage irrévocablement à régler chaque traite à sa date d&apos;exigibilité par les moyens convenus (Vodafone Cash, Fawry, InstaPay ou espèces directes). Tout retard expose l&apos;acheteur à des poursuites et à la saisie du matériel.</p>
            <p><strong>Article 3 : Solidarité du garant.</strong> La caution solidaire déclare se porter garante inconditionnelle du bon paiement des échéances.</p>
          </div>

          {/* Dual Signatures Zone */}
          <div className="pt-2">
            <div className="text-xs font-bold text-[#24321D] uppercase tracking-wider mb-2">
              Signatures des Parties & Mentions d&apos;Accord :
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Signature Vendeur */}
              <div className="border border-stone-300 rounded-xl p-3 h-28 flex flex-col justify-between bg-stone-50/50">
                <div>
                  <div className="text-[10px] font-bold text-stone-800 uppercase">Le Vendeur</div>
                  <div className="text-[9px] text-stone-500">{settings.sellerName}</div>
                </div>
                <div className="text-center text-[10px] text-stone-400 italic">
                  &quot;Bon pour accord&quot;
                </div>
              </div>

              {/* Signature Client */}
              <div className="border border-stone-300 rounded-xl p-3 h-28 flex flex-col justify-between bg-stone-50/50">
                <div>
                  <div className="text-[10px] font-bold text-stone-800 uppercase">L&apos;Acheteur (Client)</div>
                  <div className="text-[9px] text-stone-500">{client.fullName}</div>
                </div>
                <div className="text-center text-[10px] text-stone-400 italic">
                  &quot;Lu et approuvé&quot;
                </div>
              </div>

              {/* Signature Garant */}
              <div className="border border-stone-300 rounded-xl p-3 h-28 flex flex-col justify-between bg-stone-50/50">
                <div>
                  <div className="text-[10px] font-bold text-stone-800 uppercase">La Caution Solidaire</div>
                  <div className="text-[9px] text-stone-500">{client.guarantorName || 'Garant'}</div>
                </div>
                <div className="text-center text-[10px] text-stone-400 italic">
                  &quot;Bon pour caution solidaire&quot;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
