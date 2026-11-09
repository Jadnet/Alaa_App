export type Language = 'en' | 'ar';

export interface Translations {
  // Brand & App
  appName: string;
  appArabicName: string;
  appSubtitle: string;
  tagline: string;
  secureOffline: string;
  encryptedData: string;

  // Login & Lock screen
  slidePrompt: string;
  slideToUnlock: string;
  tapToEnterPin: string;
  enterPinPrompt: string;
  pinPlaceholder: string;
  wrongPin: string;
  clear: string;
  delete: string;
  back: string;
  forgotPinHelp: string;
  defaultPinNotice: string;
  hideHelp: string;

  // Header & Nav
  lockApp: string;
  notifications: string;
  overdueAlertTitle: string;
  navHome: string;
  navClients: string;
  navCatalog: string;
  navContracts: string;
  navSettings: string;

  // Dashboard
  recoveryDashboard: string;
  generalInstallmentTracking: string;
  recoveryRate: string;
  collectedRate: string;
  totalCollected: string;
  totalGranted: string;
  totalRemaining: string;
  capitalInvested: string;
  expectedProfit: string;
  newCreditAction: string;
  newCreditDesc: string;
  catalogAction: string;
  catalogDesc: string;
  upcomingDueTitle: string;
  allClientsLink: string;
  overdueBannerTitle: string;
  totalOverdueAmt: string;
  viewList: string;
  remindWhatsApp: string;

  // Clients View
  clientDirectory: string;
  newCreditBtn: string;
  searchPlaceholder: string;
  tabAll: string;
  tabOverdue: string;
  tabUpToDate: string;
  tabCompleted: string;
  paidInstallments: string;
  remainingDue: string;
  nextDueDate: string;
  completedStatus: string;
  statusUpToDate: string;
  statusOverdue: string;
  statusRedUnpaid: string;
  directCallBtn: string;
  directWhatsAppBtn: string;
  deferredCountBadge: string;

  // Installments & Detail Modal
  clientSheetTitle: string;
  monthlyInstallmentTracker: string;
  confirmedPaid: string;
  unpaidOverdueRed: string;
  unpaidDeferredRed: string;
  deferredExtensionAmber: string;
  pendingDue: string;
  dueDateLabel: string;
  paidDateLabel: string;
  btnConfirmPaid: string;
  btnNotConfirmed: string;
  btnDeferToEnd: string;
  btnUndoDefer: string;
  btnStatusRed: string;
  btnReceiptPdf: string;
  btnViewContractPdf: string;
  btnDownloadContractPdf: string;
  btnDeleteFolder: string;
  confirmDeletePrompt: string;
  yesDelete: string;
  noKeep: string;

  // Technical sheet fields
  clientInfoSection: string;
  fullNameLabel: string;
  phoneLabel: string;
  whatsappLabel: string;
  nationalIdLabel: string;
  cityLabel: string;
  addressLabel: string;
  guarantorSection: string;
  guarantorNameLabel: string;
  guarantorRelationLabel: string;
  guarantorPhoneLabel: string;
  guarantorAddressLabel: string;
  guarantorCinLabel: string;
  callGuarantor: string;

  // Simulator & New Credit
  step1ClientGuarantor: string;
  step2ProductSimulator: string;
  productSelectionLabel: string;
  customProductOption: string;
  productDesignationLabel: string;
  categoryLabel: string;
  purchaseCostLabel: string;
  myProfitMarginLabel: string;
  downPaymentLabel: string;
  durationMonthsLabel: string;
  totalSalePriceLabel: string;
  monthlyPaymentLabel: string;
  concurredMethodLabel: string;
  firstDueDateLabel: string;
  logAsExpenseOption: string;
  notesLabel: string;
  createCreditBtn: string;

  // Catalog & Expenses
  productCatalogTitle: string;
  btnManualProduct: string;
  btnNewExpense: string;
  tabCatalogProducts: string;
  tabExpenseHistory: string;
  expenseThisMonth: string;
  cumulativeExpenses: string;
  btnMakeCreditForProduct: string;
  searchProductPlaceholder: string;

  // Contracts
  officialDocumentsTitle: string;
  legalNoticeBox: string;
  btnViewPrint: string;
  btnDirectPdf: string;

  // Settings
  settingsTitle: string;
  securitySectionTitle: string;
  changePinBtn: string;
  currentPinLabel: string;
  newPinLabel: string;
  confirmPinLabel: string;
  pinChangedSuccess: string;
  sellerDetailsSection: string;
  sellerNameLabel: string;
  sellerBusinessLabel: string;
  paymentChannelsSection: string;
  backupSectionTitle: string;
  exportJsonBtn: string;
  importJsonBtn: string;
  resetDemoBtn: string;
  saveSettingsBtn: string;
  savedSuccessAlert: string;
  languageSelectLabel: string;
  langEn: string;
  langAr: string;
  overdueTopNotice: string;
  whatsappRemindNow: string;
  noClientsFound: string;
  noClientsDesc: string;
  newClientFileBtn: string;
  cancel: string;
  save: string;
  quickFillTvExample: string;
  tvExampleNotice: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Taysir',
    appArabicName: 'تيسير',
    appSubtitle: 'Installments & Credit Management',
    tagline: 'Installment sales • Monthly collection • Direct WhatsApp reminders',
    secureOffline: 'Offline Secure Local App',
    encryptedData: '100% Encrypted & Local Data',

    slidePrompt: 'Slide to open',
    slideToUnlock: 'Slide to continue',
    tapToEnterPin: 'Or tap here to enter 4-digit PIN',
    enterPinPrompt: 'Enter your 4-digit secret PIN',
    pinPlaceholder: 'Enter PIN',
    wrongPin: 'Incorrect PIN, please try again',
    clear: 'Clear',
    delete: 'Delete',
    back: 'Back',
    forgotPinHelp: 'Forgot PIN? (Help)',
    defaultPinNotice: 'Default PIN is 1234. You can change it anytime in Settings.',
    hideHelp: 'Hide help',

    lockApp: 'Lock',
    notifications: 'Alerts',
    overdueAlertTitle: 'clients with unpaid overdue months',
    navHome: 'Home',
    navClients: 'Clients',
    navCatalog: 'Catalog',
    navContracts: 'Contracts',
    navSettings: 'Settings',

    recoveryDashboard: 'Recovery Dashboard',
    generalInstallmentTracking: 'General Installment Tracking',
    recoveryRate: 'Global Recovery Rate',
    collectedRate: 'Collected',
    totalCollected: 'Total Collected (Advances + Paid)',
    totalGranted: 'Total Granted Credit',
    totalRemaining: 'Remaining Balance Due',
    capitalInvested: 'Invested Capital (Purchases)',
    expectedProfit: 'Expected / Realized Profit',
    newCreditAction: 'New Credit Deal',
    newCreditDesc: 'TV, Appliances, Furniture',
    catalogAction: 'Items & Stock',
    catalogDesc: 'Monthly expenses',
    upcomingDueTitle: 'Upcoming Due Installments',
    allClientsLink: 'All clients',
    overdueBannerTitle: 'Critical Overdue Alert',
    totalOverdueAmt: 'Total overdue amount:',
    viewList: 'View list',
    remindWhatsApp: 'Send WhatsApp',

    clientDirectory: 'Local Client Directory',
    newCreditBtn: 'New Credit',
    searchPlaceholder: 'Search client name, phone (010...), TV, contract...',
    tabAll: 'All',
    tabOverdue: 'Overdue',
    tabUpToDate: 'Up to date',
    tabCompleted: 'Settled',
    paidInstallments: 'Paid installments',
    remainingDue: 'Remaining due',
    nextDueDate: 'Next due date',
    completedStatus: 'SETTLED (100%)',
    statusUpToDate: 'UP TO DATE',
    statusOverdue: 'OVERDUE',
    statusRedUnpaid: 'UNPAID MONTH (RED STATUS)',
    directCallBtn: 'Direct Call',
    directWhatsAppBtn: 'Direct WhatsApp',
    deferredCountBadge: 'installments shifted to contract end',

    clientSheetTitle: 'Client File & Installment Tracker',
    monthlyInstallmentTracker: 'Monthly Installments Tracker',
    confirmedPaid: 'CONFIRMED COLLECTED • PAID ON',
    unpaidOverdueRed: '🔴 UNPAID MONTH - PAST DUE (RED STATUS)',
    unpaidDeferredRed: '🔴 UNPAID MONTH • SHIFTED TO CONTRACT END',
    deferredExtensionAmber: '📅 DEFERRED EXTENSION INSTALLMENT',
    pendingDue: '⏳ Pending due date',
    dueDateLabel: 'Due date:',
    paidDateLabel: 'Paid on:',
    btnConfirmPaid: 'Confirm Paid (Green)',
    btnNotConfirmed: 'Not Confirmed',
    btnDeferToEnd: 'Shift to End (+1 month)',
    btnUndoDefer: 'Undo Shift',
    btnStatusRed: 'Flag Red Status',
    btnReceiptPdf: 'Receipt PDF',
    btnViewContractPdf: 'View / Print Signed Contract (PDF)',
    btnDownloadContractPdf: 'Direct PDF Download',
    btnDeleteFolder: 'Delete this file',
    confirmDeletePrompt: 'Permanently delete this client credit record?',
    yesDelete: 'Yes, delete',
    noKeep: 'No, keep',

    clientInfoSection: '1. Complete Client Details',
    fullNameLabel: 'Full Name *',
    phoneLabel: 'Direct Phone *',
    whatsappLabel: 'WhatsApp Phone',
    nationalIdLabel: 'National ID / CIN (الرقم القومي)',
    cityLabel: 'City / Governorate',
    addressLabel: 'Full Street Address',
    guarantorSection: '2. Solidary Guarantor (الضامن)',
    guarantorNameLabel: 'Guarantor Full Name *',
    guarantorRelationLabel: 'Relationship / Bond',
    guarantorPhoneLabel: 'Guarantor Phone',
    guarantorAddressLabel: 'Guarantor Address',
    guarantorCinLabel: 'Guarantor National ID',
    callGuarantor: 'Call guarantor',

    step1ClientGuarantor: 'Client & Guarantor',
    step2ProductSimulator: 'Item & Calculator',
    productSelectionLabel: 'Choose item from catalog or custom input',
    customProductOption: '✏️ Manual custom item (TV, Fridge, Furniture...)',
    productDesignationLabel: 'Item Name *',
    categoryLabel: 'Category',
    purchaseCostLabel: 'My Purchase Cost *',
    myProfitMarginLabel: 'My Added Profit (+)',
    downPaymentLabel: 'Down Payment (Advance)',
    durationMonthsLabel: 'Installment Term (Months)',
    totalSalePriceLabel: 'Total Selling Price',
    monthlyPaymentLabel: 'Monthly Installment',
    concurredMethodLabel: 'Agreed Payment Method',
    firstDueDateLabel: 'First Installment Due Date',
    logAsExpenseOption: 'Automatically log this purchase in my Stock Expenses history',
    notesLabel: 'Special notes or terms',
    createCreditBtn: 'Create Credit & Generate Official Contract',

    productCatalogTitle: 'Items & Purchase Expenses',
    btnManualProduct: '+ Manual Item',
    btnNewExpense: '+ New Expense',
    tabCatalogProducts: 'Product Catalog',
    tabExpenseHistory: 'Expense History',
    expenseThisMonth: 'Purchases (This Month)',
    cumulativeExpenses: 'Cumulative purchases:',
    btnMakeCreditForProduct: 'Credit this item',
    searchProductPlaceholder: 'Search TV, Fridge, brand...',

    officialDocumentsTitle: 'Official Documents & Contracts',
    legalNoticeBox: 'Official credit agreements include retention of title clause, guarantor solidary commitment, and dual signatures for print and PDF.',
    btnViewPrint: 'View & Print',
    btnDirectPdf: 'Direct PDF',

    settingsTitle: 'Settings & Security',
    securitySectionTitle: '4-Digit Secret PIN Code',
    changePinBtn: 'Change PIN Code',
    currentPinLabel: 'Current PIN:',
    newPinLabel: 'New 4-Digit PIN:',
    confirmPinLabel: 'Confirm New PIN:',
    pinChangedSuccess: 'PIN changed successfully!',
    sellerDetailsSection: 'Creditor / Seller Details (Me)',
    sellerNameLabel: 'Full Name:',
    sellerBusinessLabel: 'Business / Trade Name:',
    paymentChannelsSection: 'Egyptian Payment Channels (Fawry, Vodafone Cash, InstaPay)',
    backupSectionTitle: '100% Offline Local Backup (JSON)',
    exportJsonBtn: 'Export JSON Backup',
    importJsonBtn: 'Import JSON',
    resetDemoBtn: 'Reset Demo Data',
    saveSettingsBtn: 'Save Details',
    savedSuccessAlert: 'Settings saved successfully!',
    languageSelectLabel: 'Application Language / لغة التطبيق',
    langEn: 'English',
    langAr: 'العربية',
    overdueTopNotice: 'client(s) with unpaid overdue installment this month',
    whatsappRemindNow: 'Send WhatsApp Now',
    noClientsFound: 'No clients found',
    noClientsDesc: 'Adjust your search or create a new client installment file.',
    newClientFileBtn: '+ New Client File',
    cancel: 'Cancel',
    save: 'Save',
    quickFillTvExample: 'Quick Fill (TV 1000 EGP, 200 Advance, 3 Months)',
    tvExampleNotice: 'Simulation loaded: TV 1000 EGP, Down payment 200 EGP, 3 monthly payments of 383 EGP (with profit).',
  },

  ar: {
    appName: 'تيسير',
    appArabicName: 'Taysir',
    appSubtitle: 'نظام إدارة الأقساط والديون الشهرية',
    tagline: 'بيع بالتقسيط • تحصيل شهري • رسائل واتساب مباشرة',
    secureOffline: 'تطبيق محلي آمن يعمل بدون إنترنت',
    encryptedData: 'بيانات مشفرة ومحفوظة على جهازك فقط',

    slidePrompt: 'اسحب للفتح',
    slideToUnlock: 'اسحب للمتابعة',
    tapToEnterPin: 'أو اضغط هنا لإدخال رمز الأمان PIN',
    enterPinPrompt: 'أدخل رمز الأمان المكون من 4 أرقام',
    pinPlaceholder: 'رمز PIN',
    wrongPin: 'الرمز غير صحيح، حاول مرة أخرى',
    clear: 'مسح الكل',
    delete: 'حذف',
    back: 'رجوع',
    forgotPinHelp: 'نسيت رمز PIN؟ (مساعدة)',
    defaultPinNotice: 'رمز PIN الافتراضي هو 1234. يمكنك تغييره في أي وقت من الإعدادات.',
    hideHelp: 'إخفاء المساعدة',

    lockApp: 'قفل',
    notifications: 'التنبيهات',
    overdueAlertTitle: 'عميل لديهم أشهر متأخرة لم تسدد',
    navHome: 'الرئيسية',
    navClients: 'العملاء',
    navCatalog: 'الأجهزة',
    navContracts: 'العقود',
    navSettings: 'الإعدادات',

    recoveryDashboard: 'لوحة التحكم والتحصيل',
    generalInstallmentTracking: 'المتابعة العامة للأقساط',
    recoveryRate: 'نسبة التحصيل الإجمالية',
    collectedRate: 'تم تحصيله',
    totalCollected: 'إجمالي المحصل (المقدم + الأقساط)',
    totalGranted: 'إجمالي قيمة المبيعات بالتقسيط',
    totalRemaining: 'المتبقي للتحصيل',
    capitalInvested: 'رأس المال المستثمر (المشتريات)',
    expectedProfit: 'الربح المتوقع / المحقق',
    newCreditAction: 'قسط جديد لعميل',
    newCreditDesc: 'تلفزيونات، أجهزة منزلية، أثاث',
    catalogAction: 'الأجهزة والمشتريات',
    catalogDesc: 'مصاريف البضاعة الشهرية',
    upcomingDueTitle: 'الأقساط القادمة المستحقة',
    allClientsLink: 'كل العملاء',
    overdueBannerTitle: 'تنبيه: أقساط متأخرة لم تسدد!',
    totalOverdueAmt: 'إجمالي المبالغ المتأخرة:',
    viewList: 'عرض القائمة',
    remindWhatsApp: 'مراسلة واتساب',

    clientDirectory: 'سجل العملاء المحلي',
    newCreditBtn: 'قسط جديد',
    searchPlaceholder: 'ابحث بالاسم، التليفون (010...)، التلفزيون، العقد...',
    tabAll: 'الكل',
    tabOverdue: 'متأخرات',
    tabUpToDate: 'منتظمون',
    tabCompleted: 'سدد بالكامل',
    paidInstallments: 'الأقساط المسددة',
    remainingDue: 'المتبقي',
    nextDueDate: 'الاستحقاق القادم',
    completedStatus: 'خالص بالكامل (100%)',
    statusUpToDate: 'منتظم',
    statusOverdue: 'متأخر',
    statusRedUnpaid: 'شهر غير مسدد (حالة حمراء)',
    directCallBtn: 'اتصال مباشر',
    directWhatsAppBtn: 'واتساب مباشر',
    deferredCountBadge: 'أقساط مرحلة لآخر العقد',

    clientSheetTitle: 'ملف العميل ومتابعة الأقساط',
    monthlyInstallmentTracker: 'جدول الأقساط الشهرية',
    confirmedPaid: 'تم السداد • تم الدفع في',
    unpaidOverdueRed: '🔴 شهر لم يسدد - متأخر (حالة حمراء)',
    unpaidDeferredRed: '🔴 شهر لم يسدد • تم ترحيل القسط لآخر العقد',
    deferredExtensionAmber: '📅 قسط مرحل بنهاية العقد',
    pendingDue: '⏳ في انتظار ميعاد الاستحقاق',
    dueDateLabel: 'تاريخ الاستحقاق:',
    paidDateLabel: 'تاريخ السداد:',
    btnConfirmPaid: 'تأكيد السداد (أخضر)',
    btnNotConfirmed: 'غير مؤكد',
    btnDeferToEnd: 'ترحيل القسط للنهاية (+شهر)',
    btnUndoDefer: 'إلغاء الترحيل',
    btnStatusRed: 'تحديد كحالة حمراء',
    btnReceiptPdf: 'إيصال PDF',
    btnViewContractPdf: 'عرض / طباعة العقد الموقع (PDF)',
    btnDownloadContractPdf: 'تحميل العقد PDF',
    btnDeleteFolder: 'حذف ملف هذا العميل',
    confirmDeletePrompt: 'هل أنت متأكد من حذف ملف هذا العميل نهائياً؟',
    yesDelete: 'نعم، حذف',
    noKeep: 'لا، إبقاء',

    clientInfoSection: '1. بيانات العميل الكاملة',
    fullNameLabel: 'الاسم بالكامل *',
    phoneLabel: 'رقم التليفون المباشر *',
    whatsappLabel: 'رقم الواتساب',
    nationalIdLabel: 'الرقم القومي / البطاقة (14 رقم)',
    cityLabel: 'المحافظة / المدينة',
    addressLabel: 'العنوان التفصيلي (الشارع والعمارة)',
    guarantorSection: '2. بيانات الضامن المتضامن',
    guarantorNameLabel: 'اسم الضامن بالكامل *',
    guarantorRelationLabel: 'صلة القرابة',
    guarantorPhoneLabel: 'تليفون الضامن',
    guarantorAddressLabel: 'عنوان الضامن',
    guarantorCinLabel: 'الرقم القومي للضامن',
    callGuarantor: 'اتصال بالضامن',

    step1ClientGuarantor: 'العميل والضامن',
    step2ProductSimulator: 'السلعة وحساب القسط',
    productSelectionLabel: 'اختر السلعة من القائمة أو أكتب سلعة يدوية',
    customProductOption: '✏️ سلعة يدوية خارج القائمة (شاشة، ثلاجة، غسالة...)',
    productDesignationLabel: 'اسم ومواصفات السلعة *',
    categoryLabel: 'القسم',
    purchaseCostLabel: 'سعر التكلفة / الشراء عليّ *',
    myProfitMarginLabel: 'مكسبي / فائدتي المضافة (+)',
    downPaymentLabel: 'المقدم المدفوع (العربون)',
    durationMonthsLabel: 'مدة التقسيط (بالأشهر)',
    totalSalePriceLabel: 'إجمالي سعر البيع',
    monthlyPaymentLabel: 'قيمة القسط الشهري',
    concurredMethodLabel: 'طريقة التحصيل المتفق عليها',
    firstDueDateLabel: 'تاريخ استحقاق القسط الأول',
    logAsExpenseOption: 'تسجيل شراء هذه السلعة تلقائياً في سجل مصروفات البضاعة',
    notesLabel: 'ملاحظات أو شروط خاصة',
    createCreditBtn: 'إنشاء القسط وإصدار العقد الرسمي',

    productCatalogTitle: 'سجل السلع ومصاريف المشتريات',
    btnManualProduct: '+ سلعة يدوية',
    btnNewExpense: '+ شراء بضاعة',
    tabCatalogProducts: 'قائمة الأجهزة',
    tabExpenseHistory: 'سجل المصروفات',
    expenseThisMonth: 'مشتريات البضاعة (هذا الشهر)',
    cumulativeExpenses: 'إجمالي المشتريات التراكمي:',
    btnMakeCreditForProduct: 'تقسيط هذه السلعة',
    searchProductPlaceholder: 'ابحث عن شاشة، ثلاجة، ماركة...',

    officialDocumentsTitle: 'المستندات والعقود الرسمية',
    legalNoticeBox: 'عقود بيع بالتقسيط قانونية تتضمن بند ملكية السلعة والتزام الضامن المتضامن وخانات التوقيع للطباعة وPDF.',
    btnViewPrint: 'عرض وطباعة',
    btnDirectPdf: 'تحميل PDF',

    settingsTitle: 'الإعدادات والأمان',
    securitySectionTitle: 'رمز الأمان السري PIN (4 أرقام)',
    changePinBtn: 'تغيير رمز PIN',
    currentPinLabel: 'الرمز الحالي:',
    newPinLabel: 'الرمز الجديد (4 أرقام):',
    confirmPinLabel: 'تأكيد الرمز الجديد:',
    pinChangedSuccess: 'تم تغيير رمز PIN بنجاح!',
    sellerDetailsSection: 'بيانات التاجر / البائع (أنا)',
    sellerNameLabel: 'الاسم بالكامل:',
    sellerBusinessLabel: 'اسم المحل / النشاط التجاري:',
    paymentChannelsSection: 'حسابات الدفع المصرية (فودافون كاش، فوري، انستاباي)',
    backupSectionTitle: 'نسخة احتياطية محلية 100% (ملف JSON)',
    exportJsonBtn: 'تصدير نسخة احتياطية',
    importJsonBtn: 'استيراد نسخة',
    resetDemoBtn: 'استرجاع البيانات التجريبية',
    saveSettingsBtn: 'حفظ الإعدادات',
    savedSuccessAlert: 'تم حفظ الإعدادات بنجاح!',
    languageSelectLabel: 'لغة التطبيق / Application Language',
    langEn: 'English',
    langAr: 'العربية',
    overdueTopNotice: 'عميل لديهم أقساط متأخرة لم تسدد هذا الشهر',
    whatsappRemindNow: 'إرسال تذكير واتساب الآن',
    noClientsFound: 'لم يتم العثور على أي عميل',
    noClientsDesc: 'عدل كلمات البحث أو أضف ملف قسط جديد للعميل.',
    newClientFileBtn: '+ ملف عميل جديد',
    cancel: 'إلغاء',
    save: 'حفظ',
    quickFillTvExample: 'تعبئة سريعة (شاشة 1000 ج.م، مقدم 200، 3 أشهر)',
    tvExampleNotice: 'تم تحميل المحاكاة: شاشة 1000 ج.م، مقدم 200 ج.م، 3 أقساط بقيمة 383 ج.م (شاملة الربح).',
  },
};

export const STORAGE_LANG_KEY = 'taysir_app_lang';

export function getStoredLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved === 'ar' || saved === 'en') return saved;
  } catch (e) {
    // fallback
  }
  return 'ar'; // Default Arabic as requested by user
}

export function saveStoredLanguage(lang: Language): void {
  try {
    localStorage.setItem(STORAGE_LANG_KEY, lang);
  } catch (e) {
    // ignore
  }
}
