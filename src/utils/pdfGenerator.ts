import jsPDF from 'jspdf';
import { ClientCredit, AppSettings, Installment } from '../types';
import { formatCurrency } from './whatsapp';

/**
 * Generate a downloadable PDF Contract using jsPDF
 */
export function generateContractPdf(client: ClientCredit, settings: AppSettings): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header banner
  doc.setFillColor(36, 50, 29); // Deep olive green
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(244, 239, 234);
  doc.setFontSize(16);
  doc.text('TAYSIR - CONTRAT DE CRÉDIT & VENTE À TEMPÉRAMENT', pageWidth / 2, 12, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('عقد بيع بالتقسيط والتزام سداد - Document d engagement officiel', pageWidth / 2, 19, { align: 'center' });

  y = 36;
  doc.setTextColor(30, 38, 25);

  // Contract details bar
  doc.setFillColor(238, 232, 222);
  doc.roundedRect(14, y, pageWidth - 28, 12, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`RÉFÉRENCE CONTRAT : ${client.contractNumber}`, 20, y + 7.5);
  doc.text(`DATE D ÉMISSION : ${new Date(client.createdAt).toLocaleDateString('fr-FR')}`, pageWidth - 70, y + 7.5);

  y += 18;

  // 2 Columns: Vendeur (Moi) & Client (Acheteur)
  const colWidth = (pageWidth - 34) / 2;

  // Box 1: Vendeur
  doc.setDrawColor(200, 190, 178);
  doc.setFillColor(252, 250, 247);
  doc.roundedRect(14, y, colWidth, 42, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('1. LE CRÉANCIER / VENDEUR (Moi)', 18, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Nom : ${settings.sellerName}`, 18, y + 14);
  doc.text(`Établissement : ${settings.sellerBusinessName}`, 18, y + 20);
  doc.text(`Tél : ${settings.sellerPhone}`, 18, y + 26);
  doc.text(`Adresse : ${settings.sellerAddress.substring(0, 42)}`, 18, y + 32);
  if (settings.sellerNationalId) {
    doc.text(`CIN / N° Nat : ${settings.sellerNationalId}`, 18, y + 38);
  }

  // Box 2: Client / Acheteur
  const x2 = 14 + colWidth + 6;
  doc.roundedRect(x2, y, colWidth, 42, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('2. L ACHETEUR / CLIENT (Débiteur)', x2 + 4, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Nom complet : ${client.fullName}`, x2 + 4, y + 14);
  doc.text(`Tél direct : ${client.phone}`, x2 + 4, y + 20);
  doc.text(`WhatsApp : ${client.whatsapp || client.phone}`, x2 + 4, y + 26);
  doc.text(`CIN / الرقم القومي : ${client.nationalId || 'Non renseigné'}`, x2 + 4, y + 32);
  doc.text(`Adresse : ${client.address.substring(0, 36)} (${client.city})`, x2 + 4, y + 38);

  y += 48;

  // Box 3: Garant / Cautionnaire (Obligatoire)
  doc.setFillColor(247, 243, 237);
  doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('3. CAUTION SOLIDAIRE & GARANT (الضامن)', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Nom du garant : ${client.guarantorName || 'Non désigné'}`, 18, y + 13);
  doc.text(`Lien / Relation : ${client.guarantorRelation || 'Proche'}`, 110, y + 13);
  doc.text(`Tél Garant : ${client.guarantorPhone || 'N/A'}`, 18, y + 19);
  doc.text(`Adresse Garant : ${client.guarantorAddress || 'Même ville'}`, 110, y + 19);

  y += 29;

  // Box 4: Article & Conditions Financières
  doc.setFillColor(36, 50, 29);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('4. DÉSIGNATION DU PRODUIT ET PLAN FINANCIER', 18, y + 5);

  y += 10;
  doc.setTextColor(30, 38, 25);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const finLeftX = 18;
  doc.text(`Produit vendu : `, finLeftX, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`${client.productName}`, finLeftX + 25, y);
  doc.setFont('helvetica', 'normal');

  y += 6;
  doc.text(`Prix de revient : ${formatCurrency(client.productCostPrice, settings.currency)}`, finLeftX, y);
  doc.text(`Bénéfice convenu : +${formatCurrency(client.profitMargin, settings.currency)}`, finLeftX + 55, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`Prix total à payer : ${formatCurrency(client.totalPrice, settings.currency)}`, finLeftX + 115, y);
  doc.setFont('helvetica', 'normal');

  y += 6;
  doc.text(`Avance versée (Acompte) : ${formatCurrency(client.advancePayment, settings.currency)}`, finLeftX, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text(`Reste à payer : ${formatCurrency(client.remainingBalance, settings.currency)}`, finLeftX + 55, y);
  doc.setTextColor(30, 38, 25);
  doc.text(`Échelonné sur : ${client.numberOfMonths} mois (${formatCurrency(client.monthlyInstallmentAmount, settings.currency)} / mois)`, finLeftX + 115, y);

  y += 10;

  // Table of Installments
  doc.setFillColor(230, 222, 210);
  doc.rect(14, y, pageWidth - 28, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('N°', 18, y + 4.5);
  doc.text('Date d exigibilité', 35, y + 4.5);
  doc.text('Montant', 85, y + 4.5);
  doc.text('Statut actuel', 120, y + 4.5);
  doc.text('Mode de paiement / Émargement', 155, y + 4.5);

  y += 7;
  doc.setFont('helvetica', 'normal');

  client.installments.forEach((inst) => {
    doc.setDrawColor(230, 225, 218);
    doc.line(14, y + 4.5, pageWidth - 14, y + 4.5);

    doc.text(`Traite ${inst.number}`, 18, y + 3.5);
    doc.text(new Date(inst.dueDate).toLocaleDateString('fr-FR'), 35, y + 3.5);
    doc.text(formatCurrency(inst.amount, settings.currency), 85, y + 3.5);

    if (inst.status === 'paid') {
      doc.setTextColor(21, 128, 61);
      doc.text(`PAYÉ (${inst.paidDate ? new Date(inst.paidDate).toLocaleDateString('fr-FR') : 'Oui'})`, 120, y + 3.5);
    } else if (inst.isUnpaidDeferred) {
      doc.setTextColor(185, 28, 28);
      doc.text('IMPAYÉ (DÉCALÉ FIN)', 120, y + 3.5);
    } else if (inst.isDeferredExtension) {
      doc.setTextColor(180, 100, 20);
      doc.text(`REPORT FIN (M${inst.deferredFromMonth})`, 120, y + 3.5);
    } else if (inst.status === 'overdue') {
      doc.setTextColor(185, 28, 28);
      doc.text('EN RETARD', 120, y + 3.5);
    } else {
      doc.setTextColor(100, 100, 100);
      doc.text('En attente', 120, y + 3.5);
    }

    doc.setTextColor(30, 38, 25);
    doc.text(inst.paymentMethod ? inst.paymentMethod.toUpperCase() : client.preferredPaymentMethod.toUpperCase(), 155, y + 3.5);
    y += 6;
  });

  y += 4;

  // Legal terms
  doc.setFontSize(6.8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    'Clause légale : Le matériel demeure l entière propriété du vendeur jusqu au paiement complet de l ensemble des traites. En cas de non-paiement à l échéance convenue, le vendeur se réserve le droit d exiger la restitution immédiate de l appareil ou de faire valoir ses droits légaux auprès de la caution solidaire.',
    14,
    y,
    { maxWidth: pageWidth - 28 }
  );

  y += 12;

  // Signatures Area
  doc.setDrawColor(180, 170, 160);
  doc.setFillColor(252, 250, 247);

  const sigBoxW = (pageWidth - 36) / 3;

  // Sig 1: Vendeur
  doc.roundedRect(14, y, sigBoxW, 30, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 38, 25);
  doc.text('Signature du Vendeur', 18, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(settings.sellerName, 18, y + 9);
  doc.text('(Mention "Bon pour accord")', 18, y + 26);

  // Sig 2: Client
  const sigX2 = 14 + sigBoxW + 4;
  doc.roundedRect(sigX2, y, sigBoxW, 30, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Signature du Client', sigX2 + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(client.fullName, sigX2 + 4, y + 9);
  doc.text('(Mention manuscrite "Lu et approuvé")', sigX2 + 4, y + 26);

  // Sig 3: Garant
  const sigX3 = sigX2 + sigBoxW + 4;
  doc.roundedRect(sigX3, y, sigBoxW, 30, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('Signature du Garant', sigX3 + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(client.guarantorName || 'Caution solidaire', sigX3 + 4, y + 9);
  doc.text('(Mention "Bon pour caution")', sigX3 + 4, y + 26);

  // Save the PDF
  const filename = `Contrat_${client.contractNumber}_${client.fullName.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}

/**
 * Generate a printable monthly payment receipt PDF
 */
export function generateReceiptPdf(client: ClientCredit, installment: Installment, settings: AppSettings): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [148, 210], // A5 format
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(36, 50, 29);
  doc.rect(0, 0, pageWidth, 22, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(244, 239, 234);
  doc.setFontSize(14);
  doc.text('REÇU OFFICIEL DE PAIEMENT', pageWidth / 2, 10, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('إيصال استلام دفعة شهرية', pageWidth / 2, 16, { align: 'center' });

  let y = 30;
  doc.setTextColor(30, 38, 25);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`Reçu N° : ${installment.receiptNumber || 'REC-' + Date.now().toString().slice(-6)}`, 14, y);
  doc.text(`Date : ${installment.paidDate ? new Date(installment.paidDate).toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')}`, pageWidth - 45, y);

  y += 10;
  doc.setFillColor(245, 240, 232);
  doc.roundedRect(12, y, pageWidth - 24, 46, 2, 2, 'F');

  doc.setFontSize(8.5);
  doc.text(`Reçu de : ${client.fullName}`, 18, y + 8);
  doc.text(`Téléphone : ${client.phone}`, 18, y + 15);
  doc.text(`Article concerné : ${client.productName}`, 18, y + 22);
  doc.text(`Traite N° : ${installment.number} sur ${client.numberOfMonths}`, 18, y + 29);
  doc.text(`Mode de règlement : ${(installment.paymentMethod || client.preferredPaymentMethod).toUpperCase()}`, 18, y + 36);
  doc.text(`Contrat de référence : ${client.contractNumber}`, 18, y + 43);

  y += 56;
  doc.setFillColor(36, 50, 29);
  doc.roundedRect(12, y, pageWidth - 24, 16, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`MONTANT VERSÉ : ${formatCurrency(installment.amount, settings.currency)}`, pageWidth / 2, y + 10.5, { align: 'center' });

  y += 24;
  doc.setTextColor(30, 38, 25);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');

  const remaining = client.installments.filter(i => i.status !== 'paid' && i.id !== installment.id).reduce((sum, i) => sum + i.amount, 0);
  doc.text(`Solde restant dû sur ce dossier : ${formatCurrency(remaining, settings.currency)}`, 14, y);

  y += 18;
  doc.text(`Signature du Vendeur :`, 14, y);
  doc.text(`Signature de l'Acheteur :`, pageWidth - 60, y);

  y += 16;
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(`${settings.sellerBusinessName} • ${settings.sellerPhone}`, pageWidth / 2, y, { align: 'center' });

  const filename = `Recu_Traite_${installment.number}_${client.fullName.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
