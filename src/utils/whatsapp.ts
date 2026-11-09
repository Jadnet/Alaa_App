import { ClientCredit, Installment, AppSettings } from '../types';

/**
 * Clean phone numbers to standard format for WhatsApp wa.me link.
 * Handles Egyptian prefixes (010, 011, 012, 015) by converting them to 201xxxxxxxxx.
 */
export function formatPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');

  // If starts with 00, replace with nothing
  if (digits.startsWith('00')) {
    digits = digits.substring(2);
  }

  // Egyptian domestic number starting with 01 (e.g. 010, 011, 012, 015)
  if (digits.startsWith('01') && digits.length === 11) {
    digits = '20' + digits.substring(1);
  } else if (digits.length === 10 && (digits.startsWith('10') || digits.startsWith('11') || digits.startsWith('12') || digits.startsWith('15'))) {
    digits = '20' + digits;
  }

  return digits;
}

export function formatPhoneForCall(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Format Egyptian / localized currency
 */
export function formatCurrency(amount: number, currency: string = 'EGP'): string {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(amount) + ` ${currency}`;
}

/**
 * Generate polite and professional WhatsApp messages
 */
/**
 * Generate polite and professional WhatsApp messages in Arabic or English
 */
export function generateWhatsAppMessage(
  client: ClientCredit,
  installment: Installment | null,
  type: 'reminder' | 'overdue' | 'receipt' | 'contract',
  settings: AppSettings,
  lang: 'en' | 'ar' = 'ar'
): string {
  const currentInst = installment || client.installments.find(i => i.status !== 'paid') || client.installments[0];
  const monthlyAmount = currentInst ? formatCurrency(currentInst.amount, settings.currency) : formatCurrency(client.monthlyInstallmentAmount, settings.currency);
  const remainingTotal = formatCurrency(
    client.installments.filter(i => i.status !== 'paid' && !i.isUnpaidDeferred).reduce((sum, i) => sum + i.amount, 0),
    settings.currency
  );

  const paymentDetails = [
    settings.vodafoneCashNumber ? (lang === 'ar' ? `• فودافون كاش: ${settings.vodafoneCashNumber}` : `• Vodafone Cash: ${settings.vodafoneCashNumber}`) : null,
    settings.instapayHandle ? (lang === 'ar' ? `• انستاباي InstaPay: ${settings.instapayHandle}` : `• InstaPay: ${settings.instapayHandle}`) : null,
    settings.fawryServiceNumber ? (lang === 'ar' ? `• كود فوري Fawry: ${settings.fawryServiceNumber}` : `• Fawry Code: ${settings.fawryServiceNumber}`) : null,
    lang === 'ar' ? `• نقداً / كاش باليد` : `• Cash direct`
  ].filter(Boolean).join('\n');

  if (lang === 'ar') {
    switch (type) {
      case 'overdue': {
        const dueDate = currentInst?.dueDate ? new Date(currentInst.dueDate).toLocaleDateString('ar-EG') : 'هذا الشهر';
        return `⚠️ *تنبيه سداد قسط مستحق ومتأخر*

السلام عليكم ورحمة الله أ/ *${client.fullName}*،

نحيط سيادتكم علماً بأن القسط الشهري رقم (${currentInst?.number || 1}) الخاص بسلعة *${client.productName}* بقيمة *${monthlyAmount}* والمستحق بتاريخ *${dueDate}* لم يتم تحصيله حتى الآن.

يرجى التكرم بسرعة سداد هذا القسط للحفاظ على انتظام حسابكم وتجنب اتخاذ أي إجراءات.

💳 *طرق الدفع المتوفرة :*
${paymentDetails}

لأي استفسار أو إرسال إشعار التحويل يرجى التواصل معنا مباشرة.
مع خالص التحية،
*${settings.sellerBusinessName || settings.sellerName}*
📞 ${settings.sellerPhone}`;
      }

      case 'reminder': {
        const dueDate = currentInst?.dueDate ? new Date(currentInst.dueDate).toLocaleDateString('ar-EG') : 'قريباً';
        return `السلام عليكم أ/ *${client.fullName}*،

تذكير ودي بميعاد استحقاق القسط الشهري رقم (${currentInst?.number || 1}) لسلعة *${client.productName}*.

📅 *تاريخ الاستحقاق :* ${dueDate}
💰 *المبلغ المطلوب :* ${monthlyAmount}
📦 *إجمالي باقي الحساب :* ${remainingTotal}

💳 *طرق الدفع المتاحة :*
${paymentDetails}

شاكرين لكم حسن تعاونكم والتزامكم الدائم،
*${settings.sellerBusinessName || settings.sellerName}*`;
      }

      case 'receipt': {
        const today = new Date().toLocaleDateString('ar-EG');
        return `✅ *إيصال استلام دفعة / سداد قسط*

الأستاذ(ة) *${client.fullName}* المحترم،

نؤكد لكم استلام دفعة القسط رقم (${currentInst?.number || 1}) بقيمة *${monthlyAmount}* بتاريخ *${today}* بنجاح عن سلعة *${client.productName}*.

📊 *المبلغ المتبقي على حسابكم :* ${remainingTotal}

شكراً جزيلاً لتعاملكم الراقي وثقتكم بنا!
*${settings.sellerBusinessName || settings.sellerName}*`;
      }

      case 'contract': {
        return `📄 *ملخص عقد التقسيط المعتمد - تيسير TAYSIR*

العميل : *${client.fullName}*
رقم العقد : *${client.contractNumber}*
السلعة : *${client.productName}*
إجمالي القيمة : *${formatCurrency(client.totalPrice, settings.currency)}*
المقدم المدفوع : *${formatCurrency(client.advancePayment, settings.currency)}*
المبلغ المقسط : *${formatCurrency(client.remainingBalance, settings.currency)}* على *${client.numberOfMonths} شهر*
القسط الشهري : *${formatCurrency(client.monthlyInstallmentAmount, settings.currency)} / شهر*

طرق السداد المعتمدة :
${paymentDetails}

*${settings.sellerBusinessName || settings.sellerName}*`;
      }
    }
  }

  // English fallback
  switch (type) {
    case 'overdue': {
      const dueDate = currentInst?.dueDate ? new Date(currentInst.dueDate).toLocaleDateString('en-US') : 'this month';
      return `⚠️ *URGENT OVERDUE PAYMENT NOTICE*

Dear *${client.fullName}*,

Please note that monthly installment #${currentInst?.number || 1} for your *${client.productName}* amounting to *${monthlyAmount}* was due on *${dueDate}* and remains unpaid.

Kindly settle this installment at your earliest convenience to keep your account in good standing.

💳 *Available payment channels:*
${paymentDetails}

Thank you,
*${settings.sellerBusinessName || settings.sellerName}*
📞 ${settings.sellerPhone}`;
    }

    case 'reminder': {
      const dueDate = currentInst?.dueDate ? new Date(currentInst.dueDate).toLocaleDateString('en-US') : 'soon';
      return `Hello *${client.fullName}*,

Friendly reminder regarding installment #${currentInst?.number || 1} for your *${client.productName}*.

📅 *Due date:* ${dueDate}
💰 *Amount due:* ${monthlyAmount}
📦 *Total remaining balance:* ${remainingTotal}

💳 *Accepted payment methods:*
${paymentDetails}

Thank you for your punctuality!
*${settings.sellerBusinessName || settings.sellerName}*`;
    }

    case 'receipt': {
      const today = new Date().toLocaleDateString('en-US');
      return `✅ *PAYMENT RECEIPT CONFIRMATION*

Dear *${client.fullName}*,

We confirm receipt of *${monthlyAmount}* paid on *${today}* for your *${client.productName}* (Installment #${currentInst?.number || 1}).

📊 *Remaining balance:* ${remainingTotal}

Thank you for your trust!
*${settings.sellerBusinessName || settings.sellerName}*`;
    }

    case 'contract': {
      return `📄 *CREDIT AGREEMENT SUMMARY - TAYSIR*

Client: *${client.fullName}*
Contract #: *${client.contractNumber}*
Item: *${client.productName}*
Total Price: *${formatCurrency(client.totalPrice, settings.currency)}*
Down Payment: *${formatCurrency(client.advancePayment, settings.currency)}*
Financed: *${formatCurrency(client.remainingBalance, settings.currency)}* over *${client.numberOfMonths} months*
Monthly Payment: *${formatCurrency(client.monthlyInstallmentAmount, settings.currency)} / month*

Accepted Payment Channels:
${paymentDetails}

*${settings.sellerBusinessName || settings.sellerName}*`;
    }
  }
}

/**
 * Open WhatsApp with pre-filled message without saving contact to address book.
 */
export function openWhatsAppDirect(phone: string, message: string): void {
  const cleanPhone = formatPhoneForWhatsApp(phone);
  if (!cleanPhone) {
    alert("Numéro de téléphone non renseigné");
    return;
  }
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Trigger direct phone call
 */
export function callPhoneDirect(phone: string): void {
  const cleanPhone = formatPhoneForCall(phone);
  if (!cleanPhone) {
    alert("Numéro de téléphone non renseigné");
    return;
  }
  window.location.href = `tel:${cleanPhone}`;
}
