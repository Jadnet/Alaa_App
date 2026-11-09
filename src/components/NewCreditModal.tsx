import React, { useState, useId } from 'react';
import { X, Calculator, UserCheck, Shield, Check, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { ClientCredit, ProductCategory, PaymentMethod, ProductItem, Installment } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { Language, translations } from '../utils/translations';

interface NewCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: ClientCredit, logExpense: boolean) => void;
  products: ProductItem[];
  currency: string;
  lang?: Language;
}

export const NewCreditModal: React.FC<NewCreditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  products,
  currency,
  lang = 'ar',
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const formId = useId();

  // Step state (1: Fiche Client & Garant, 2: Produit & Calculateur Financier)
  const [step, setStep] = useState<1 | 2>(1);

  // Client Details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [city, setCity] = useState(isRtl ? 'القاهرة' : 'Le Caire');
  const [address, setAddress] = useState('');

  // Guarantor Details
  const [guarantorName, setGuarantorName] = useState('');
  const [guarantorPhone, setGuarantorPhone] = useState('');
  const [guarantorRelation, setGuarantorRelation] = useState(isRtl ? 'أخ' : 'Frère');
  const [guarantorAddress, setGuarantorAddress] = useState('');
  const [guarantorNationalId, setGuarantorNationalId] = useState('');

  // Product Selection / Creation
  const [selectedProductId, setSelectedProductId] = useState<string>('custom');
  const [productName, setProductName] = useState('Smart TV Samsung 43" UHD');
  const [productCategory, setProductCategory] = useState<ProductCategory>('tv');

  // Financial Calculator
  const [costPrice, setCostPrice] = useState<number>(1000);
  const [profitMargin, setProfitMargin] = useState<number>(200);
  const [advancePayment, setAdvancePayment] = useState<number>(200);
  const [numberOfMonths, setNumberOfMonths] = useState<number>(3);
  const [firstDueDate, setFirstDueDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(5);
    return d.toISOString().split('T')[0];
  });
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState<PaymentMethod>('vodafone_cash');
  const [logAsExpense, setLogAsExpense] = useState<boolean>(true);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Real-time calculations
  const totalPrice = Math.max(0, costPrice + profitMargin);
  const remainingBalance = Math.max(0, totalPrice - advancePayment);
  const monthlyAmount = numberOfMonths > 0 ? Math.round(remainingBalance / numberOfMonths) : 0;

  // Generate preview of installments
  const previewInstallments: Installment[] = [];
  if (numberOfMonths > 0 && monthlyAmount > 0) {
    const baseDate = new Date(firstDueDate);
    for (let i = 1; i <= numberOfMonths; i++) {
      const d = new Date(baseDate);
      d.setMonth(baseDate.getMonth() + (i - 1));
      previewInstallments.push({
        id: `temp-${i}`,
        number: i,
        dueDate: d.toISOString().split('T')[0],
        amount: i === numberOfMonths ? remainingBalance - monthlyAmount * (numberOfMonths - 1) : monthlyAmount,
        status: 'pending',
      });
    }
  }

  const handleSelectProduct = (prodId: string) => {
    setSelectedProductId(prodId);
    if (prodId === 'custom') {
      setProductName('');
      setCostPrice(1000);
      setProfitMargin(200);
    } else {
      const p = products.find((x) => x.id === prodId);
      if (p) {
        setProductName(p.name);
        setProductCategory(p.category);
        setCostPrice(p.suggestedCostPrice);
        setProfitMargin(Math.max(100, p.suggestedSalePrice - p.suggestedCostPrice));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert(isRtl ? 'يرجى كتابة اسم العميل ورقم هاتفه على الأقل.' : 'Veuillez renseigner au moins le nom et le numéro de téléphone du client.');
      setStep(1);
      return;
    }
    if (!productName) {
      alert(isRtl ? 'يرجى كتابة اسم المنتج أو السلعة.' : 'Veuillez indiquer le produit acheté.');
      setStep(2);
      return;
    }

    const now = new Date();
    const contractNumber = `AMN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const installments: Installment[] = [];
    const baseDate = new Date(firstDueDate);

    for (let i = 1; i <= numberOfMonths; i++) {
      const d = new Date(baseDate);
      d.setMonth(baseDate.getMonth() + (i - 1));
      const isLast = i === numberOfMonths;
      const amt = isLast ? remainingBalance - monthlyAmount * (numberOfMonths - 1) : monthlyAmount;

      installments.push({
        id: `inst-${Date.now()}-${i}`,
        number: i,
        dueDate: d.toISOString().split('T')[0],
        amount: amt,
        status: 'pending',
      });
    }

    const newClient: ClientCredit = {
      id: `client-${Date.now()}`,
      contractNumber,
      createdAt: now.toISOString(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsapp: (whatsapp.trim() || phone.trim()),
      nationalId: nationalId.trim(),
      city: city.trim(),
      address: address.trim(),
      guarantorName: guarantorName.trim(),
      guarantorPhone: guarantorPhone.trim(),
      guarantorRelation: guarantorRelation.trim(),
      guarantorAddress: guarantorAddress.trim(),
      guarantorNationalId: guarantorNationalId.trim(),
      productName: productName.trim(),
      productCategory,
      productCostPrice: Number(costPrice) || 0,
      advancePayment: Number(advancePayment) || 0,
      profitMargin: Number(profitMargin) || 0,
      totalPrice,
      remainingBalance,
      numberOfMonths: Number(numberOfMonths) || 1,
      monthlyInstallmentAmount: monthlyAmount,
      preferredPaymentMethod,
      installments,
      status: 'active',
      notes: notes.trim(),
    };

    onSave(newClient, logAsExpense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#FAF8F5] text-stone-900 w-full max-w-lg rounded-3xl shadow-2xl border border-stone-300 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header in Taysir Olive */}
        <div className="bg-[#24321D] text-[#FAF8F5] px-5 py-4 flex items-center justify-between border-b border-[#364735]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#1B2516] text-[#C29B38] border border-[#3E5333]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-[#F4EFEA]">
                {t.newCreditBtn}
              </h2>
              <p className="text-[11px] text-stone-300">
                {isRtl ? 'حاسبة الأقساط وعقد البيع الرسمي' : 'Calculateur de crédit et contrat officiel'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="bg-[#ECE5DC] px-5 py-2.5 flex items-center justify-between border-b border-stone-300 text-xs">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              step === 1 ? 'text-[#24321D] font-bold' : 'text-stone-500'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 1 ? 'bg-[#24321D] text-white shadow-xs' : 'bg-stone-300 text-stone-700'
              }`}
            >
              1
            </span>
            {t.step1ClientGuarantor}
          </button>
          <span className="text-stone-400">&rarr;</span>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              step === 2 ? 'text-[#24321D] font-bold' : 'text-stone-500'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 2 ? 'bg-[#24321D] text-white shadow-xs' : 'bg-stone-300 text-stone-700'
              }`}
            >
              2
            </span>
            {t.step2ProductSimulator}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {step === 1 ? (
            /* STEP 1: CLIENT & GUARANTOR */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#24321D] border-b border-stone-200 pb-1.5">
                <UserCheck className="w-4 h-4 text-[#C29B38]" />
                <span>{t.clientInfoSection}</span>
              </div>

              <div>
                <label htmlFor={`${formId}-client-fullname`} className="block text-xs font-semibold text-stone-700 mb-1">
                  {isRtl ? 'اسم المشتري واللقب (العميل) *' : 'Nom et Prénom du client *'}
                </label>
                <input
                  id={`${formId}-client-fullname`}
                  type="text"
                  required
                  placeholder={isRtl ? 'مثال: أحمد محمود حسن' : 'Ex: Ahmed Mahmoud Hassan'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-client-phone`} className="block text-xs font-semibold text-stone-700 mb-1">
                    {isRtl ? 'الهاتف المباشر *' : 'Téléphone direct *'}
                  </label>
                  <input
                    id={`${formId}-client-phone`}
                    type="tel"
                    required
                    placeholder="01012345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                  />
                  <span className="text-[10px] text-stone-500">
                    {isRtl ? 'زر اتصال فوري بدون حفظ' : 'Bouton appel direct sur vignette'}
                  </span>
                </div>
                <div>
                  <label htmlFor={`${formId}-client-whatsapp`} className="block text-xs font-semibold text-stone-700 mb-1">
                    {isRtl ? 'رقم الواتساب' : 'Numéro WhatsApp'}
                  </label>
                  <input
                    id={`${formId}-client-whatsapp`}
                    type="tel"
                    placeholder="01012345678"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                  />
                  <span className="text-[10px] text-stone-500">
                    {isRtl ? 'تذكير مباشر وتلقائي' : 'Sans enregistrer dans répertoire'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-client-cin`} className="block text-xs font-semibold text-stone-700 mb-1">
                    {isRtl ? 'الرقم القومي (14 رقم)' : 'Carte Nationale / CIN (الرقم القومي)'}
                  </label>
                  <input
                    id={`${formId}-client-cin`}
                    type="text"
                    placeholder="29304151201948"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-client-city`} className="block text-xs font-semibold text-stone-700 mb-1">
                    {isRtl ? 'المحافظة / المدينة' : 'Gouvernorat / Ville'}
                  </label>
                  <input
                    id={`${formId}-client-city`}
                    type="text"
                    placeholder={isRtl ? 'القاهرة، الجيزة، الدقي...' : 'Le Caire, Gizeh, Dokki...'}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${formId}-client-address`} className="block text-xs font-semibold text-stone-700 mb-1">
                  {isRtl ? 'العنوان التفصيلي (للعقد الرسمي)' : 'Adresse complète détaillée (pour contrat officiel)'}
                </label>
                <textarea
                  id={`${formId}-client-address`}
                  rows={2}
                  placeholder={isRtl ? 'الشارع، رقم العقار، الدور، الشقة، علامة مميزة...' : 'Rue, N° Immeuble, Étage, Appartement, Repère...'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 resize-none shadow-xs"
                />
              </div>

              {/* Guarantor Section */}
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#24321D] border-b border-stone-200 pb-1.5 mb-3">
                  <Shield className="w-4 h-4 text-[#C29B38]" />
                  <span>{isRtl ? '2. بيانات الضامن المتضامن (الضامن)' : '2. Le Garant / Cautionnaire Solidaire (الضامن)'}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor={`${formId}-guarantor-name`} className="block text-xs font-semibold text-stone-700 mb-1">
                      {isRtl ? 'اسم الضامن رباعي *' : 'Nom complet du garant *'}
                    </label>
                    <input
                      id={`${formId}-guarantor-name`}
                      type="text"
                      placeholder={isRtl ? 'محمد محمود حسن' : 'Ex: Mohamed Mahmoud Hassan'}
                      value={guarantorName}
                      onChange={(e) => setGuarantorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-guarantor-relation`} className="block text-xs font-semibold text-stone-700 mb-1">
                      {isRtl ? 'صلة القرابة' : 'Lien de parenté / Relation'}
                    </label>
                    <select
                      id={`${formId}-guarantor-relation`}
                      value={guarantorRelation}
                      onChange={(e) => setGuarantorRelation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                    >
                      <option value="Frère">Frère (أخ)</option>
                      <option value="Père">Père (أب)</option>
                      <option value="Mère">Mère (أم)</option>
                      <option value="Conjoint">Époux / Épouse (زوج/زوجة)</option>
                      <option value="Oncle/Tante">Oncle / Tante (عم/خال)</option>
                      <option value="Cousin">Cousin (ابن عم)</option>
                      <option value="Ami">Ami proche (صديق)</option>
                      <option value="Collègue">Collègue de travail (زميل)</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`${formId}-guarantor-phone`} className="block text-xs font-semibold text-stone-700 mb-1">
                      {isRtl ? 'هاتف الضامن' : 'Téléphone du garant'}
                    </label>
                    <input
                      id={`${formId}-guarantor-phone`}
                      type="tel"
                      placeholder="01123456789"
                      value={guarantorPhone}
                      onChange={(e) => setGuarantorPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-guarantor-cin`} className="block text-xs font-semibold text-stone-700 mb-1">
                      {isRtl ? 'الرقم القومي للضامن' : 'CIN Garant (الرقم القومي)'}
                    </label>
                    <input
                      id={`${formId}-guarantor-cin`}
                      type="text"
                      placeholder="N° national du garant"
                      value={guarantorNationalId}
                      onChange={(e) => setGuarantorNationalId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 rounded-2xl bg-[#24321D] hover:bg-[#34472B] active:scale-[0.99] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>{isRtl ? 'المتابعة : السلعة وحساب الأقساط' : 'Continuer : Produit & Calcul des Traites'}</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: PRODUCT & FINANCIAL SIMULATOR */
            <div className="space-y-4">
              {/* Product Select */}
              <div>
                <label htmlFor={`${formId}-catalog-product`} className="block text-xs font-semibold text-stone-700 mb-1">
                  {isRtl ? 'اختيار منتج من الكتالوج أو كتابة منتج حر' : 'Choisir un produit du catalogue ou saisie libre'}
                </label>
                <select
                  id={`${formId}-catalog-product`}
                  value={selectedProductId}
                  onChange={(e) => handleSelectProduct(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                >
                  <option value="custom">✏️ {isRtl ? 'منتج مخصص جديد (شاشة، ثلاجة، أثاث...)' : 'Article manuel libre (TV, Frigo, Mobilier...)'}</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - Coût: {formatCurrency(p.suggestedCostPrice, currency)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label htmlFor={`${formId}-product-name`} className="block text-xs font-semibold text-stone-700 mb-1">
                    {isRtl ? 'اسم السلعة / الجهاز *' : "Désignation de l'article *"}
                  </label>
                  <input
                    id={`${formId}-product-name`}
                    type="text"
                    required
                    placeholder={isRtl ? 'مثال: شاشة سامسونج 50 بوصة 4K' : 'Ex: Smart TV Samsung 50 pouces 4K'}
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-product-category`} className="block text-xs font-semibold text-stone-700 mb-1">
                    {isRtl ? 'التصنيف' : 'Catégorie'}
                  </label>
                  <select
                    id={`${formId}-product-category`}
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value as ProductCategory)}
                    className="w-full px-2.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                  >
                    <option value="tv">📺 {isRtl ? 'شاشة' : 'TV'}</option>
                    <option value="electromenager">❄️ {isRtl ? 'أجهزة' : 'Électro'}</option>
                    <option value="climatisation">💨 {isRtl ? 'تكييف' : 'Clim'}</option>
                    <option value="mobilier">🛋️ {isRtl ? 'أثاث' : 'Mobilier'}</option>
                    <option value="parabole_tech">📡 {isRtl ? 'دش' : 'Tech'}</option>
                    <option value="autre">📦 {isRtl ? 'أخرى' : 'Autre'}</option>
                  </select>
                </div>
              </div>

              {/* SIMULATOR CARD in Olive Green */}
              <div className="bg-[#24321D] text-[#FAF8F5] p-4 rounded-2xl border border-[#3E5333] shadow-md space-y-3">
                <div className="flex items-center justify-between border-b border-[#34472B] pb-2">
                  <span className="text-xs uppercase tracking-widest text-[#C29B38] font-bold">
                    {isRtl ? 'حاسبة تقسيط الشاشات والأجهزة' : 'Simulateur de Facilités de Paiement'}
                  </span>
                  <span className="text-[11px] bg-[#1B2516] px-2 py-0.5 rounded-full text-stone-200 border border-[#3E5333]">
                    {isRtl ? 'حساب فوري' : 'Calcul instantané'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`${formId}-cost-price`} className="block text-[11px] text-stone-300 mb-1">
                      {isRtl ? 'سعر الشراء / التكلفة الأصلية *' : "Prix d'achat / Coût (Moi) *"}
                    </label>
                    <div className="relative">
                      <input
                        id={`${formId}-cost-price`}
                        type="number"
                        min="0"
                        step="50"
                        value={costPrice}
                        onChange={(e) => setCostPrice(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-[#1B2516] border border-[#3E5333] text-sm font-bold text-white focus:outline-none focus:border-[#C29B38]"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] text-stone-400 font-semibold">{currency}</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${formId}-profit-margin`} className="block text-[11px] text-stone-300 mb-1">
                      {isRtl ? 'هامش ربحي المضاف (+)' : 'Mon Bénéfice ajouté (+)'}
                    </label>
                    <div className="relative">
                      <input
                        id={`${formId}-profit-margin`}
                        type="number"
                        min="0"
                        step="50"
                        value={profitMargin}
                        onChange={(e) => setProfitMargin(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-[#1B2516] border border-[#3E5333] text-sm font-bold text-emerald-400 focus:outline-none focus:border-[#C29B38]"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] text-stone-400 font-semibold">{currency}</span>
                    </div>
                  </div>
                </div>

                {/* Quick margin shortcuts */}
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span className="text-stone-300">{isRtl ? 'اختصارات الربح:' : 'Raccourcis :'}</span>
                  {[150, 200, 300, 500].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setProfitMargin(m)}
                      className={`px-2 py-0.5 rounded-md border cursor-pointer ${
                        profitMargin === m
                          ? 'bg-[#C29B38] text-black font-bold border-[#C29B38]'
                          : 'bg-[#1B2516] text-stone-300 border-[#3E5333]'
                      }`}
                    >
                      +{m}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label htmlFor={`${formId}-advance-payment`} className="block text-[11px] text-stone-300 mb-1">
                      {isRtl ? 'المقدم المدفوع (العربون)' : 'Avance versée (Acompte)'}
                    </label>
                    <div className="relative">
                      <input
                        id={`${formId}-advance-payment`}
                        type="number"
                        min="0"
                        step="50"
                        value={advancePayment}
                        onChange={(e) => setAdvancePayment(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-xl bg-[#1B2516] border border-[#3E5333] text-sm font-bold text-[#E5D2A8] focus:outline-none focus:border-[#C29B38]"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] text-stone-400 font-semibold">{currency}</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${formId}-number-of-months`} className="block text-[11px] text-stone-300 mb-1">
                      {isRtl ? 'عدد الأقساط (شهور)' : "Nombre d'échéances (Mois)"}
                    </label>
                    <select
                      id={`${formId}-number-of-months`}
                      value={numberOfMonths}
                      onChange={(e) => setNumberOfMonths(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#1B2516] border border-[#3E5333] text-sm font-bold text-white focus:outline-none focus:border-[#C29B38]"
                    >
                      <option value="1">1 {isRtl ? 'شهر' : 'mois'}</option>
                      <option value="2">2 {isRtl ? 'شهرين' : 'mois'}</option>
                      <option value="3">3 {isRtl ? 'شهور (الموصى به)' : 'mois (Conseillé TV 1000)'}</option>
                      <option value="4">4 {isRtl ? 'شهور' : 'mois'}</option>
                      <option value="5">5 {isRtl ? 'شهور' : 'mois'}</option>
                      <option value="6">6 {isRtl ? 'شهور' : 'mois'}</option>
                      <option value="10">10 {isRtl ? 'شهور' : 'mois'}</option>
                      <option value="12">12 {isRtl ? 'شهراً (سنة)' : 'mois (1 an)'}</option>
                    </select>
                  </div>
                </div>

                {/* Calculation summary banner */}
                <div className="mt-3 p-3 rounded-xl bg-[#162012] border border-[#34472B] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider">
                      {isRtl ? 'إجمالي سعر البيع' : 'Prix Total de Vente'}
                    </div>
                    <div className="text-sm font-bold text-white font-mono">{formatCurrency(totalPrice, currency)}</div>
                    <div className="text-[10px] text-stone-300">
                      {isRtl ? 'المتبقي للتقسيط: ' : 'Reste à payer : '}
                      <strong className="text-rose-400">{formatCurrency(remainingBalance, currency)}</strong>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#C29B38] font-bold uppercase tracking-wider">
                      {isRtl ? 'القسط الشهري' : 'Traite Mensuelle'}
                    </div>
                    <div className="text-xl font-bold font-serif text-[#E5D2A8]">
                      {formatCurrency(monthlyAmount, currency)} <span className="text-xs font-sans font-normal text-stone-300">{isRtl ? '/ شهر' : '/ mois'}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold">
                      {isRtl ? 'صافي الربح: ' : 'Bénéfice net : '} +{formatCurrency(profitMargin, currency)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment method & First date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`${formId}-payment-method`} className="block text-xs font-semibold text-stone-700 mb-1">
                    {isRtl ? 'طريقة السداد المتفق عليها' : 'Mode de versement convenu'}
                  </label>
                  <select
                    id={`${formId}-payment-method`}
                    value={preferredPaymentMethod}
                    onChange={(e) => setPreferredPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                  >
                    <option value="vodafone_cash">📱 Vodafone Cash (فودافون كاش)</option>
                    <option value="instapay">⚡ InstaPay (انستاباي)</option>
                    <option value="fawry">🟡 Fawry (فوري)</option>
                    <option value="cash">💵 Espèces / Cash direct (نقداً)</option>
                    <option value="orange_cash">🟠 Orange Money / Cash</option>
                    <option value="etisalat_cash">🟢 Etisalat Cash</option>
                    <option value="paypal">🌐 PayPal</option>
                    <option value="bank_transfer">🏦 Virement bancaire</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-first-due-date`} className="block text-xs font-semibold text-stone-700 mb-1">
                    {isRtl ? 'تاريخ أول قسط' : 'Date de la 1ère traite'}
                  </label>
                  <input
                    id={`${formId}-first-due-date`}
                    type="date"
                    value={firstDueDate}
                    onChange={(e) => setFirstDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                  />
                </div>
              </div>

              {/* Installments preview list */}
              <div>
                <span className="block text-xs font-semibold text-stone-700 mb-1.5">
                  {isRtl ? `جدول الأقساط المحسوبة تلقائياً (${previewInstallments.length} أقساط):` : `Échéancier calculé automatiquement (${previewInstallments.length} traites) :`}
                </span>
                <div className="bg-[#ECE5DC] p-2.5 rounded-xl border border-stone-300/80 space-y-1.5 max-h-36 overflow-y-auto">
                  {previewInstallments.map((inst) => (
                    <div key={inst.id} className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-white rounded-lg shadow-2xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#24321D] text-white flex items-center justify-center text-[10px] font-bold">
                          {inst.number}
                        </span>
                        <span className="font-medium text-stone-800">
                          {new Date(inst.dueDate).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <span className="font-bold text-[#24321D] font-mono">
                        {formatCurrency(inst.amount, currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Option to log as expense in stock */}
              <label className="flex items-center gap-2 text-xs text-stone-800 cursor-pointer p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <input
                  type="checkbox"
                  checked={logAsExpense}
                  onChange={(e) => setLogAsExpense(e.target.checked)}
                  className="rounded text-[#24321D] focus:ring-[#24321D] w-4 h-4 cursor-pointer"
                />
                <span className="font-medium">
                  {isRtl ? `تسجيل شراء هذه السلعة (${formatCurrency(costPrice, currency)}) تلقائياً في سجل المصاريف` : `Enregistrer automatiquement l'achat de cet article (${formatCurrency(costPrice, currency)}) dans mon Historique des Dépenses de Stock`}
                </span>
              </label>

              {/* Notes */}
              <div>
                <label htmlFor={`${formId}-credit-notes`} className="block text-xs font-semibold text-stone-700 mb-1">
                  {isRtl ? 'ملاحظات أو شروط خاصة' : 'Remarques ou conditions particulières'}
                </label>
                <input
                  id={`${formId}-credit-notes`}
                  type="text"
                  placeholder={isRtl ? 'مثال: تم تسليم الجهاز للمنزل مع الضمان...' : 'Ex: Facture du magasin conservée, livraison effectuée à domicile...'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#24321D]/20 shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs transition-all cursor-pointer"
                >
                  &larr; {isRtl ? 'رجوع' : 'Retour'}
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-3 rounded-2xl bg-[#24321D] hover:bg-[#34472B] active:scale-[0.99] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4 text-[#C29B38]" />
                  <span>{isRtl ? 'حفظ التقسيط وإصدار العقد' : 'Créer le Crédit & Générer le Contrat'}</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
