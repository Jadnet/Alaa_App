import React, { useState, useId } from 'react';
import {
  ShoppingBag,
  Plus,
  Tv,
  Refrigerator,
  Wind,
  Sofa,
  Radio,
  Package,
  Calendar,
  Receipt,
  Search,
  ExternalLink,
  Trash2,
  DollarSign,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { ProductItem, PurchaseExpense, ProductCategory } from '../types';
import { formatCurrency } from '../utils/whatsapp';
import { Language, translations } from '../utils/translations';

interface CatalogViewProps {
  products: ProductItem[];
  expenses: PurchaseExpense[];
  onAddProduct: (prod: ProductItem) => void;
  onAddExpense: (exp: PurchaseExpense) => void;
  onSelectProductForCredit: (prod: ProductItem) => void;
  currency: string;
  lang?: Language;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  expenses,
  onAddProduct,
  onAddExpense,
  onSelectProductForCredit,
  currency,
  lang = 'ar',
}) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const formId = useId();
  const [subTab, setSubTab] = useState<'catalog' | 'expenses'>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Manual Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('tv');
  const [newProdBrand, setNewProdBrand] = useState('');
  const [newProdCostPrice, setNewProdCostPrice] = useState(1000);
  const [newProdSalePrice, setNewProdSalePrice] = useState(1250);
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Manual Expense Modal
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expProductName, setExpProductName] = useState('');
  const [expCategory, setExpCategory] = useState<ProductCategory>('tv');
  const [expSupplier, setExpSupplier] = useState('');
  const [expPrice, setExpPrice] = useState(1000);
  const [expInvoice, setExpInvoice] = useState('');
  const [expClientName, setExpClientName] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  // Categories helper
  const categories: { id: string; labelFr: string; labelAr: string; icon: React.ReactNode }[] = [
    { id: 'all', labelFr: 'Tous', labelAr: 'الكل', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'tv', labelFr: 'TV & Écrans', labelAr: 'شاشات وتلفاز', icon: <Tv className="w-3.5 h-3.5" /> },
    { id: 'electromenager', labelFr: 'Électroménager', labelAr: 'أجهزة منزلية', icon: <Refrigerator className="w-3.5 h-3.5" /> },
    { id: 'climatisation', labelFr: 'Climatisation', labelAr: 'تكييف وتبريد', icon: <Wind className="w-3.5 h-3.5" /> },
    { id: 'mobilier', labelFr: 'Mobilier', labelAr: 'أثاث منزلي', icon: <Sofa className="w-3.5 h-3.5" /> },
    { id: 'parabole_tech', labelFr: 'Parabole/Tech', labelAr: 'دش وتكنولوجيا', icon: <Radio className="w-3.5 h-3.5" /> },
  ];

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Calculate monthly expense totals
  const totalExpenseAll = expenses.reduce((sum, e) => sum + e.purchasePrice, 0);
  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
  const currentMonthExpenses = expenses.filter((e) => e.date.startsWith(currentMonthStr));
  const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.purchasePrice, 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const prod: ProductItem = {
      id: `prod-custom-${Date.now()}`,
      name: newProdName.trim(),
      category: newProdCategory,
      brand: newProdBrand.trim() || 'Standard',
      model: 'Modèle Sur Mesure',
      suggestedCostPrice: Number(newProdCostPrice) || 0,
      suggestedSalePrice: Number(newProdSalePrice) || 0,
      imageUrl:
        newProdImage.trim() ||
        'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
      description: newProdDesc.trim() || 'Article ajouté manuellement hors catalogue standard',
      isCustom: true,
    };

    onAddProduct(prod);
    setShowAddProductModal(false);
    setNewProdName('');
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expProductName) return;

    const exp: PurchaseExpense = {
      id: `exp-${Date.now()}`,
      date: expDate,
      productName: expProductName.trim(),
      category: expCategory,
      supplier: expSupplier.trim() || 'Fournisseur Local',
      purchasePrice: Number(expPrice) || 0,
      invoiceNumber: expInvoice.trim(),
      assignedClientName: expClientName.trim(),
    };

    onAddExpense(exp);
    setShowAddExpenseModal(false);
    setExpProductName('');
  };

  return (
    <div className="pb-24 pt-2 px-4 max-w-md mx-auto space-y-4 text-[#24321D]">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C29B38]">
            {isRtl ? 'إدارة المشتريات والمخزون' : 'Gestion du Matériel'}
          </span>
          <h2 className="text-xl font-serif font-bold text-[#24321D]">
            {isRtl ? 'المنتجات والمشتريات' : 'Articles & Achats'}
          </h2>
        </div>

        {subTab === 'catalog' ? (
          <button
            type="button"
            onClick={() => setShowAddProductModal(true)}
            className="py-2 px-3 rounded-2xl bg-[#24321D] hover:bg-[#34472B] active:scale-95 text-[#FAF8F5] text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-[#C29B38]" />
            <span>{isRtl ? 'منتج مخصص' : 'Article Manuel'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddExpenseModal(true)}
            className="py-2 px-3 rounded-2xl bg-[#24321D] hover:bg-[#34472B] active:scale-95 text-[#FAF8F5] text-xs font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-[#C29B38]" />
            <span>{isRtl ? 'شراء جديد' : 'Nouvel Achat'}</span>
          </button>
        )}
      </div>

      {/* Main Switcher: Catalogue Produits vs Historique des Achats */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#ECE5DC] border border-[#DDD4C7] text-xs font-bold shadow-inner">
        <button
          type="button"
          onClick={() => setSubTab('catalog')}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            subTab === 'catalog'
              ? 'bg-[#24321D] text-[#FAF8F5] shadow-md'
              : 'text-[#64705A] hover:text-[#24321D]'
          }`}
        >
          {isRtl ? `الكتالوج (${products.length})` : `Catalogue (${products.length})`}
        </button>
        <button
          type="button"
          onClick={() => setSubTab('expenses')}
          className={`py-2 rounded-xl transition-all cursor-pointer ${
            subTab === 'expenses'
              ? 'bg-[#24321D] text-[#FAF8F5] shadow-md'
              : 'text-[#64705A] hover:text-[#24321D]'
          }`}
        >
          {isRtl ? `سجل النفقات (${expenses.length})` : `Dépenses (${expenses.length})`}
        </button>
      </div>

      {subTab === 'catalog' ? (
        /* CATALOG VIEW */
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#86917E] rtl:left-auto rtl:right-3.5" />
            <input
              type="text"
              placeholder={isRtl ? 'بحث عن شاشات، أجهزة، ماركات...' : 'Rechercher TV, Frigo, marque...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 rounded-2xl bg-white border border-[#E0D7CC] text-xs sm:text-sm text-[#24321D] placeholder-[#9AA592] focus:outline-none focus:border-[#24321D] shadow-inner"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#24321D] text-[#FAF8F5] shadow-sm'
                    : 'bg-[#F2ECE3] text-[#55634D] border border-[#DDD4C7] hover:bg-[#EAE2D7]'
                }`}
              >
                {cat.icon}
                <span>{isRtl ? cat.labelAr : cat.labelFr}</span>
              </button>
            ))}
          </div>

          {/* Products List Cards */}
          <div className="space-y-3">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-[#FAF8F5] rounded-3xl p-3.5 border border-[#E5DDD0] shadow-sm flex items-center gap-3.5 hover:border-[#24321D]/40 transition-all"
              >
                <div className="w-20 h-20 rounded-2xl bg-[#ECE5DC] overflow-hidden shrink-0 border border-[#DDD4C7] relative">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {p.isCustom && (
                    <span className="absolute top-1 left-1 text-[8px] font-bold bg-[#C29B38] text-white px-1.5 py-0.2 rounded-full shadow-xs">
                      {isRtl ? 'مخصص' : 'Manuel'}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] uppercase font-bold bg-[#ECE5DC] text-[#44553B] border border-[#DDD4C7] px-2 py-0.5 rounded-full">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-[#7A8772] font-mono">
                      {p.brand}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-[#24321D] truncate mt-1">
                    {p.name}
                  </h3>
                  <p className="text-[11px] text-[#6B7563] line-clamp-1">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#ECE5DC]">
                    <div className="text-[11px]">
                      <span className="text-[#7A8772]">{isRtl ? 'التكلفة: ' : 'Coût: '}</span>
                      <strong className="text-[#24321D]">{formatCurrency(p.suggestedCostPrice, currency)}</strong>
                      <span className="text-emerald-700 font-bold ml-1.5">
                        +{formatCurrency(p.suggestedSalePrice - p.suggestedCostPrice, currency)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectProductForCredit(p)}
                      className="py-1 px-2.5 rounded-xl bg-[#24321D] hover:bg-[#34472B] active:scale-95 text-[#FAF8F5] text-[10px] font-bold flex items-center gap-1 shadow-xs cursor-pointer transition-all"
                    >
                      <Plus className="w-3 h-3 text-[#C29B38]" />
                      <span>{isRtl ? 'بدء تقسيط' : 'Faire Crédit'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* EXPENSES & PURCHASES HISTORY VIEW */
        <div className="space-y-3">
          {/* Expense stats card in Taysir Olive Style */}
          <div className="bg-gradient-to-br from-[#24321D] via-[#2F4226] to-[#1C2817] text-[#FAF8F5] p-4 rounded-3xl border border-[#3E5233] shadow-md flex items-center justify-between">
            <div>
              <div className="text-[10px] text-[#D8B965] font-bold uppercase tracking-wider">
                {isRtl ? 'مصاريف البضائع هذا الشهر' : 'Dépenses Achats (Ce Mois)'}
              </div>
              <div className="text-2xl font-serif font-bold text-[#FAF8F5]">
                {formatCurrency(currentMonthTotal, currency)}
              </div>
              <div className="text-[10px] text-[#D0C7B9] mt-0.5">
                {isRtl ? 'المجموع التراكمي: ' : 'Total cumulé : '}
                <span className="text-white font-mono">{formatCurrency(totalExpenseAll, currency)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-emerald-300">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>

          {/* Expenses list */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#44553B] uppercase tracking-wider block">
              {isRtl ? 'سجل مشتريات البضائع وفواتير الموردين:' : 'Historique des dépenses de marchandises :'}
            </span>

            {expenses.length === 0 ? (
              <p className="text-xs text-[#7A8772] text-center py-6 bg-[#FAF8F5] rounded-3xl border border-[#E5DDD0]">
                {isRtl ? 'لا توجد فواتير مشتريات مسجلة حالياً.' : "Aucun achat enregistré pour l'instant."}
              </p>
            ) : (
              expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E5DDD0] shadow-xs flex items-center justify-between hover:border-[#24321D]/40 transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#24321D]">{exp.productName}</span>
                      {exp.invoiceNumber && (
                        <span className="text-[10px] bg-[#ECE5DC] text-[#44553B] border border-[#DDD4C7] px-1.5 py-0.2 rounded font-mono">
                          {exp.invoiceNumber}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6B7563]">
                      {isRtl ? 'المورد : ' : 'Fournisseur : '}
                      <strong className="text-[#24321D]">{exp.supplier}</strong>
                    </div>
                    {exp.assignedClientName && (
                      <div className="text-[10px] text-[#8C6D23] font-medium">
                        {isRtl ? 'للعميل: ' : 'Pour le client : '} {exp.assignedClientName}
                      </div>
                    )}
                  </div>

                  <div className="text-right rtl:text-left">
                    <div className="text-sm font-bold text-[#24321D] font-mono">
                      {formatCurrency(exp.purchasePrice, currency)}
                    </div>
                    <div className="text-[10px] text-[#7A8772]">
                      {new Date(exp.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: AJOUTER ARTICLE MANUEL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] text-[#24321D] w-full max-w-sm rounded-3xl shadow-2xl border border-[#DDD4C7] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#ECE5DC] pb-2">
              <h3 className="text-sm font-serif font-bold text-[#24321D]">
                {isRtl ? 'إضافة منتج مخصص جديد' : 'Ajouter un Article Manuel'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="text-[#7A8772] hover:text-[#24321D] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label htmlFor={`${formId}-manual-prod-name`} className="block font-semibold text-[#24321D] mb-1">
                  {isRtl ? 'اسم المنتج *' : 'Nom du produit *'}
                </label>
                <input
                  id={`${formId}-manual-prod-name`}
                  type="text"
                  required
                  placeholder={isRtl ? 'مثال: شاشة سامسونج 55 بوصة' : 'Ex: Balador / Récepteur spécial...'}
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={`${formId}-manual-prod-cat`} className="block font-semibold text-[#24321D] mb-1">
                    {isRtl ? 'التصنيف' : 'Catégorie'}
                  </label>
                  <select
                    id={`${formId}-manual-prod-cat`}
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                    className="w-full px-2 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                  >
                    <option value="tv">TV & Écran</option>
                    <option value="electromenager">Électroménager</option>
                    <option value="climatisation">Climatisation</option>
                    <option value="mobilier">Mobilier</option>
                    <option value="parabole_tech">Parabole/Tech</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={`${formId}-manual-prod-brand`} className="block font-semibold text-[#24321D] mb-1">
                    {isRtl ? 'الماركة' : 'Marque'}
                  </label>
                  <input
                    id={`${formId}-manual-prod-brand`}
                    type="text"
                    placeholder="Ex: Sony, Sharp..."
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={`${formId}-manual-prod-cost`} className="block font-semibold text-[#24321D] mb-1">
                    {isRtl ? 'سعر التكلفة' : 'Prix Achat (Coût)'}
                  </label>
                  <input
                    id={`${formId}-manual-prod-cost`}
                    type="number"
                    value={newProdCostPrice}
                    onChange={(e) => setNewProdCostPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-manual-prod-sale`} className="block font-semibold text-[#24321D] mb-1">
                    {isRtl ? 'سعر التقسيط المقترح' : 'Prix Revente suggéré'}
                  </label>
                  <input
                    id={`${formId}-manual-prod-sale`}
                    type="number"
                    value={newProdSalePrice}
                    onChange={(e) => setNewProdSalePrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${formId}-manual-prod-img`} className="block font-semibold text-[#24321D] mb-1">
                  {isRtl ? 'رابط صورة (اختياري)' : 'URL Image internet (optionnel)'}
                </label>
                <input
                  id={`${formId}-manual-prod-img`}
                  type="url"
                  placeholder="https://..."
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#24321D] hover:bg-[#34472B] text-[#FAF8F5] font-bold text-xs mt-2 cursor-pointer shadow-md transition-all"
              >
                {isRtl ? 'حفظ المنتج في الكتالوج' : "Enregistrer l'article"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOUVEL ACHAT / DÉPENSE */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] text-[#24321D] w-full max-w-sm rounded-3xl shadow-2xl border border-[#DDD4C7] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#ECE5DC] pb-2">
              <h3 className="text-sm font-serif font-bold text-[#24321D]">
                {isRtl ? 'تسجيل فاتورة شراء بضاعة' : 'Enregistrer un Achat / Dépense'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddExpenseModal(false)}
                className="text-[#7A8772] hover:text-[#24321D] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label htmlFor={`${formId}-exp-prod-name`} className="block font-semibold text-[#24321D] mb-1">
                  {isRtl ? 'المنتج المشترى *' : 'Article acheté *'}
                </label>
                <input
                  id={`${formId}-exp-prod-name`}
                  type="text"
                  required
                  placeholder="Ex: Téléviseur Samsung 50 pouces"
                  value={expProductName}
                  onChange={(e) => setExpProductName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={`${formId}-exp-price`} className="block font-semibold text-[#24321D] mb-1">
                    {isRtl ? 'المبلغ المدفوع *' : `Montant Payé (${currency}) *`}
                  </label>
                  <input
                    id={`${formId}-exp-price`}
                    type="number"
                    required
                    value={expPrice}
                    onChange={(e) => setExpPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-exp-date`} className="block font-semibold text-[#24321D] mb-1">
                    {isRtl ? 'تاريخ الشراء' : "Date d'achat"}
                  </label>
                  <input
                    id={`${formId}-exp-date`}
                    type="date"
                    value={expDate}
                    onChange={(e) => setExpDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor={`${formId}-exp-supplier`} className="block font-semibold text-[#24321D] mb-1">
                  {isRtl ? 'المورد / المتجر' : 'Fournisseur / Magasin'}
                </label>
                <input
                  id={`${formId}-exp-supplier`}
                  type="text"
                  placeholder="Ex: Grossiste El-Araby..."
                  value={expSupplier}
                  onChange={(e) => setExpSupplier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={`${formId}-exp-invoice`} className="block font-semibold text-[#24321D] mb-1">
                    {isRtl ? 'رقم الفاتورة' : 'N° Facture / Reçu'}
                  </label>
                  <input
                    id={`${formId}-exp-invoice`}
                    type="text"
                    placeholder="Ex: FAC-4819"
                    value={expInvoice}
                    onChange={(e) => setExpInvoice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                  />
                </div>
                <div>
                  <label htmlFor={`${formId}-exp-client`} className="block font-semibold text-[#24321D] mb-1">
                    {isRtl ? 'اسم العميل' : 'Client Destinataire'}
                  </label>
                  <input
                    id={`${formId}-exp-client`}
                    type="text"
                    placeholder="Ex: Ahmed Mahmoud"
                    value={expClientName}
                    onChange={(e) => setExpClientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD4C7] text-[#24321D] focus:outline-none focus:border-[#24321D]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#24321D] hover:bg-[#34472B] text-[#FAF8F5] font-bold text-xs mt-2 cursor-pointer shadow-md transition-all"
              >
                {isRtl ? 'تأكيد وحفظ النفقة' : 'Valider la Dépense'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
