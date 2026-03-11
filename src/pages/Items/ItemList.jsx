import { useState } from "react";

import { FiEdit2 } from "react-icons/fi";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
const initialItems = [
  { id: 1, product: "Previous Outstanding", hsn: "", type: "", size: "", purchasePrice: "₹0.00",   mrp: "₹0.00",   in: 110,   out: 45,    total: 65   },
  { id: 2, product: "Gentleman",            hsn: "", type: "Silicon",      size: "7-10", purchasePrice: "₹60.00",  mrp: "₹140.00", in: 14007, out: 4290,  total: 9717 },
  { id: 3, product: "S Rocky",              hsn: "", type: "Naar Cutting", size: "7-10", purchasePrice: "₹60.00",  mrp: "₹150.00", in: 19175, out: 13255, total: 5920 },
  { id: 4, product: "Skechers",             hsn: "", type: "S 400",        size: "",     purchasePrice: "₹50.00",  mrp: "₹150.00", in: 27605, out: 27518, total: 87   },
  { id: 5, product: "Regular",              hsn: "", type: "",             size: "7-10", purchasePrice: "₹50.00",  mrp: "₹120.00", in: 24135, out: 20655, total: 3480 },
];

const columns = [
  { key: "sr",            label: "Sr No" },
  { key: "product",       label: "Product" },
  { key: "hsn",           label: "HSN No" },
  { key: "type",          label: "Type" },
  { key: "size",          label: "Size/Pack" },
  { key: "purchasePrice", label: "Purchased Price" },
  { key: "mrp",           label: "MRP" },
  { key: "in",            label: "In" },
  { key: "out",           label: "Out" },
  { key: "total",         label: "Total" },
  { key: "actions",       label: "" },
];

/* ── Helper: parse ₹ string to number ── */
const parseAmount = (val) => parseFloat(String(val).replace(/[₹,]/g, "")) || 0;
const formatAmount = (val) => `₹${parseFloat(val || 0).toFixed(2)}`;

const ItemList = () => {
  const [items, setItems] = useState(initialItems);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});

  const openEdit = (item, e) => {
    e.stopPropagation();
    setEditItem(item);
    setForm({
      product:       item.product,
      type:          item.type,
      size:          item.size,
      mrp:           parseAmount(item.mrp),
      addStock:      0,
      subtractStock: 0,
    });
  };

  const closeEdit = () => {
    setEditItem(null);
    setForm({});
  };

  const handleSave = () => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== editItem.id) return it;
        const newTotal =
          it.total + Number(form.addStock || 0) - Number(form.subtractStock || 0);
        return {
          ...it,
          product: form.product,
          type:    form.type,
          size:    form.size,
          mrp:     formatAmount(form.mrp),
          in:      it.in  + Number(form.addStock || 0),
          out:     it.out + Number(form.subtractStock || 0),
          total:   Math.max(0, newTotal),
        };
      })
    );
    closeEdit();
  };

  const tableData = items.map((item, index) => ({
    ...item,
    sr: index + 1,
    actions: (
      <button
        onClick={(e) => openEdit(item, e)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition"
      >
        <FiEdit2 size={12} />
        Edit
      </button>
    ),
  }));

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-semibold text-gray-800">Items</h1>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={tableData}
      />

      {/* ── Edit Modal ── */}
      {editItem && (
  <Modal title="Edit Item" onClose={closeEdit}>

    {/* Product */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-500">Product</label>
      <input
        type="text"
        value={form.product}
        onChange={(e) => setForm({ ...form, product: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
      />
    </div>

    {/* Type */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-500">Type</label>
      <input
        type="text"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
      />
    </div>

    {/* Size */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-500">Size / Pack</label>
      <input
        type="text"
        value={form.size}
        onChange={(e) => setForm({ ...form, size: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
      />
    </div>

    {/* MRP */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-500">MRP</label>
      <input
        type="number"
        value={form.mrp}
        onChange={(e) => setForm({ ...form, mrp: e.target.value })}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
      />
    </div>

    {/* Current Stock */}
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-500">Current Stock</label>
      <div className="w-full px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100 text-sm font-semibold">
        {editItem.total}
      </div>
    </div>

    {/* Stock Controls */}
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-500">Add Stock</label>
        <input
          type="number"
          min="0"
          value={form.addStock}
          onChange={(e) => setForm({ ...form, addStock: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-500">Subtract Stock</label>
        <input
          type="number"
          min="0"
          value={form.subtractStock}
          onChange={(e) => setForm({ ...form, subtractStock: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm"
        />
      </div>
    </div>

    <p className="text-xs text-center text-gray-400">
      Stock updates only after confirmation
    </p>

    {/* Buttons */}
    <div className="flex items-center justify-end gap-3">
      <button
        onClick={closeEdit}
        className="px-5 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100"
      >
        Cancel
      </button>

      <button
        onClick={handleSave}
        className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#1e3a8a] text-white hover:bg-blue-900"
      >
        Save Changes
      </button>
    </div>

  </Modal>
)}

    </div>
  );
};

export default ItemList;