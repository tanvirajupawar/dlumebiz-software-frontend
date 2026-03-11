import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiSearch } from "react-icons/fi";
import Button from "../../components/Button";
import ExpandableTable from "../../components/ExpandableTable";
import Modal from "../../components/Modal";
/* ── Data ── */
const initialInvoices = [
  {
    id: 1,
    invoiceNo: "INV-00648",
    customer: "Vijay Bhai",
    date: "07/03/2026",
    amount: 4950,
    confirmed: true,
    items: [{ item: "Skechers (S 400)", bags: "1 × 33", qty: 33, price: 150, total: 4950 }],
  },
  {
    id: 2,
    invoiceNo: "INV-00647",
    customer: "Sagar Footwear",
    date: "07/03/2026",
    amount: 21600,
    confirmed: true,
    items: [
      { item: "Gentleman (Silicon)", bags: "2 × 60", qty: 120, price: 140, total: 16800 },
      { item: "S Rocky", bags: "1 × 48", qty: 48, price: 100, total: 4800 },
    ],
  },
  {
    id: 3,
    invoiceNo: "INV-00646",
    customer: "Hitesh Bhai",
    date: "07/03/2026",
    amount: 68400,
    confirmed: false,
    items: [
      { item: "Regular", bags: "4 × 120", qty: 480, price: 120, total: 57600 },
      { item: "Skechers (S 400)", bags: "1 × 72", qty: 72, price: 150, total: 10800 },
    ],
  },
];

const collections = [
  {
    id: 1,
    customer: "International Footwear",
    date: "08/03/2026",
    remark: "Invoice Payment",
    amount: 35000,
    paymentMode: "UPI",
    status: "Received",
  },
  {
    id: 2,
    customer: "Prem Footwear",
    date: "07/03/2026",
    remark: "Advance",
    amount: 20000,
    paymentMode: "Cash",
    status: "Received",
  },
];


const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
const TABS = ["Invoice", "Collection"];

/* ─── Confirm Dialog ─── */
const ConfirmDialog = ({ invoice, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25" onClick={onCancel}>
    <div className="bg-white border border-gray-200 rounded-lg shadow-2xl w-80 p-5" onClick={(e) => e.stopPropagation()}>
      <p className="text-sm font-semibold text-gray-800 mb-1">Confirm Invoice</p>
      <p className="text-xs text-gray-500 mb-5">
        Mark <strong>{invoice.invoiceNo}</strong> for <strong>{invoice.customer}</strong> as confirmed?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-1.5 rounded border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-1.5 rounded bg-[#1e3a8a] text-xs font-medium text-white hover:bg-blue-900 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

/* ─── Main Page ─── */
const SalesInvoiceList = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Invoice");
  const [invoices, setInvoices] = useState(initialInvoices);
  const [confirmTarget, setConfirmTarget] = useState(null);
 const [expandedId, setExpandedId] = useState(null);
const [search, setSearch] = useState("");

const [showCollectionModal, setShowCollectionModal] = useState(false);

const [collectionForm, setCollectionForm] = useState({
  customer: "",
  date: "",
  remark: "",
  amount: "",
  paymentMode: "Cash",
});
  const isInvoice = activeTab === "Invoice";

  const handleToggleConfirm = (e, invoice) => {
    e.stopPropagation();

    if (invoice.confirmed) {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === invoice.id ? { ...inv, confirmed: false } : inv))
      );
    } else {
      setConfirmTarget(invoice);
    }
  };

  const handleConfirm = () => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === confirmTarget.id ? { ...inv, confirmed: true } : inv
      )
    );
    setConfirmTarget(null);
  };

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.customer.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase())
  );

const filteredCollections = collections.filter(
  (col) =>
    col.customer.toLowerCase().includes(search.toLowerCase()) ||
    col.remark?.toLowerCase().includes(search.toLowerCase())
);
  const totalSales = invoices.reduce((s, i) => s + i.amount, 0);
  const totalCollected = collections
    .filter((c) => c.status === "Received")
    .reduce((s, c) => s + c.amount, 0);

    
  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Sales</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {isInvoice ? "Sales Overview" : "Collections Overview"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
            {isInvoice ? "Total Sales" : "Total Collected"}
          </p>
          <p className="text-xl font-bold text-green-600 tabular-nums">
            {fmt(isInvoice ? totalSales : totalCollected)}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSearch("");
                setExpandedId(null);
              }}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all duration-150
              ${activeTab === tab ? "bg-[#1e3a8a] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Button
          variant="navy"
          size="sm"
          className="flex items-center gap-1.5"
onClick={() =>
  isInvoice
    ? navigate("/sales-invoice")
    : setShowCollectionModal(true)
}        >
          <FiPlus size={14} />
          {isInvoice ? "New Invoice" : "Add Collection"}
        </Button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Search */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="relative w-1/2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isInvoice ? "Search invoices..." : "Search collections..."}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {isInvoice ? (
          <ExpandableTable
            invoices={filteredInvoices}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            onToggleConfirm={handleToggleConfirm}
            nameKey="customer"
            editPath="/sales-invoice"
            viewPath="/invoice"
          />
) : (
  <>
    {/* Collection Table Head */}
    <div className="grid grid-cols-[1fr_130px_1fr_130px_130px_100px] border-b border-gray-200 bg-gray-50 px-6">
      <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Customer
      </div>
      <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Date
      </div>
      <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Remark
      </div>
      <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right pr-6">
        Amount
      </div>
      <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Payment Mode
      </div>
      <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
        Status
      </div>
    </div>

    {filteredCollections.length === 0 && (
      <p className="text-center text-sm text-gray-400 py-10">
        No collections found.
      </p>
    )}

    {filteredCollections.map((col, idx) => (
      <div
        key={col.id}
        className={`grid grid-cols-[1fr_130px_1fr_130px_130px_100px] px-6 items-center hover:bg-gray-50 transition-colors ${
          idx !== filteredCollections.length - 1
            ? "border-b border-gray-100"
            : ""
        }`}
      >
        <div className="py-4 text-sm font-medium text-gray-800">
          {col.customer}
        </div>

        <div className="py-4 text-sm text-gray-500">
          {col.date}
        </div>

        <div className="py-4 text-sm text-gray-500">
          {col.remark || "-"}
        </div>

        <div className="py-4 text-sm text-right pr-6 font-semibold tabular-nums">
          {fmt(col.amount)}
        </div>

        <div className="py-4 text-sm text-gray-500">
          {col.paymentMode}
        </div>

        <div className="py-4 flex justify-center">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
              col.status === "Received"
                ? "bg-green-50 text-green-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {col.status}
          </span>
        </div>
      </div>
    ))}
   </>
  )}
</div>

{showCollectionModal && (
  <Modal title="Add Collection" onClose={() => setShowCollectionModal(false)}>

    <div className="space-y-4">

      <input
        placeholder="Customer"
        value={collectionForm.customer}
        onChange={(e) =>
          setCollectionForm({ ...collectionForm, customer: e.target.value })
        }
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />

<input
         placeholder="Outstanding"
        value={collectionForm.outstanding}
        onChange={(e) =>
          setCollectionForm({ ...collectionForm, outstanding: e.target.value })
        }
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />
      <input
        type="date"
        value={collectionForm.date}
        onChange={(e) =>
          setCollectionForm({ ...collectionForm, date: e.target.value })
        }
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />

      <input
        placeholder="Remark"
        value={collectionForm.remark}
        onChange={(e) =>
          setCollectionForm({ ...collectionForm, remark: e.target.value })
        }
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />

      <input
        type="number"
        placeholder="Amount"
        value={collectionForm.amount}
        onChange={(e) =>
          setCollectionForm({ ...collectionForm, amount: e.target.value })
        }
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />

      <select
        value={collectionForm.paymentMode}
        onChange={(e) =>
          setCollectionForm({
            ...collectionForm,
            paymentMode: e.target.value,
          })
        }
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      >
        <option>Cash</option>
        <option>UPI</option>
        <option>Bank Transfer</option>
      </select>

      <div className="flex justify-end gap-3 pt-2">

        <button
          onClick={() => setShowCollectionModal(false)}
          className="px-4 py-2 text-sm border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            console.log(collectionForm);
            setShowCollectionModal(false);
          }}
          className="px-4 py-2 text-sm bg-[#1e3a8a] text-white rounded-lg"
        >
          Save
        </button>

      </div>

    </div>

  </Modal>
)}

{/* Confirm Dialog */}
{confirmTarget && (
  <ConfirmDialog
    invoice={confirmTarget}
    onConfirm={handleConfirm}
    onCancel={() => setConfirmTarget(null)}
  />
)}

</div>
);
};

export default SalesInvoiceList;