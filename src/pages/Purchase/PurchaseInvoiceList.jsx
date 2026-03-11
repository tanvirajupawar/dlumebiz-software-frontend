import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus, FiChevronDown, FiCheck, FiEye,
  FiEdit2, FiTrash2, FiCreditCard, FiSearch
} from "react-icons/fi";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
/* ── Data ── */
const initialInvoices = [
  {
    id: 1, invoiceNo: "PI-1001", vendor: "ABC Traders",
    date: "12/03/2026", amount: 25500, confirmed: true,
    items: [
      { item: "Cotton Fabric (White)", bags: "2 × 50", qty: 100, price: 180, total: 18000 },
      { item: "Packaging Material",    bags: "1 × 75", qty: 75,  price: 100, total: 7500  },
    ],
  },
  {
    id: 2, invoiceNo: "PI-1002", vendor: "Global Supplies",
    date: "13/03/2026", amount: 12800, confirmed: false,
    items: [
      { item: "Rubber Sole (Black)", bags: "1 × 80", qty: 80, price: 160, total: 12800 },
    ],
  },
  {
    id: 3, invoiceNo: "PI-1003", vendor: "Sunrise Packaging",
    date: "14/03/2026", amount: 9450, confirmed: true,
    items: [
      { item: "Cardboard Boxes", bags: "3 × 35", qty: 105, price: 60, total: 6300 },
      { item: "Tape Rolls",      bags: "1 × 50", qty: 50,  price: 63, total: 3150 },
    ],
  },
 
 
];

const initialPayables = [
  { id: 1, refNo: "PAY-001", vendor: "ABC Traders",        date: "10/03/2026", amount: 25500, method: "NEFT", status: "Paid"    },
  { id: 2, refNo: "PAY-002", vendor: "Global Supplies",    date: "11/03/2026", amount: 12800, method: "Cash", status: "Pending" },
  { id: 3, refNo: "PAY-003", vendor: "Sunrise Packaging",  date: "12/03/2026", amount: 9450,  method: "UPI",  status: "Paid"    },
  { id: 4, refNo: "PAY-004", vendor: "Metro Distributors", date: "13/03/2026", amount: 32100, method: "RTGS", status: "Pending" },
];

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2 });
const TABS = ["Invoices", "Payables"];

/* ─── Confirm Dialog ─── */
const ConfirmDialog = ({ invoice, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25" onClick={onCancel}>
    <div className="bg-white border border-gray-200 rounded-lg shadow-2xl w-80 p-5" onClick={e => e.stopPropagation()}>
      <p className="text-sm font-semibold text-gray-800 mb-1">Confirm Invoice</p>
      <p className="text-xs text-gray-500 mb-5">
        Mark <strong>{invoice.invoiceNo}</strong> for <strong>{invoice.vendor}</strong> as confirmed?
      </p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel}
          className="px-4 py-1.5 rounded border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
          Cancel
        </button>
        <button onClick={onConfirm}
          className="px-4 py-1.5 rounded bg-[#1e3a8a] text-xs font-medium text-white hover:bg-blue-900 transition">
          Confirm
        </button>
      </div>
    </div>
  </div>
);

/* ─── Main Page ─── */
const PurchaseInvoiceList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]         = useState("Invoices");
  const [invoices, setInvoices]           = useState(initialInvoices);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [expandedId, setExpandedId]       = useState(null);
  const [search, setSearch]               = useState("");

  const isInvoice = activeTab === "Invoices";

  const toggleRow = (id) => setExpandedId(prev => prev === id ? null : id);

  const handleToggleConfirm = (e, invoice) => {
    e.stopPropagation();
    if (invoice.confirmed) {
      setInvoices(prev => prev.map(inv => inv.id === invoice.id ? { ...inv, confirmed: false } : inv));
    } else {
      setConfirmTarget(invoice);
    }
  };

  const handleConfirm = () => {
    setInvoices(prev => prev.map(inv => inv.id === confirmTarget.id ? { ...inv, confirmed: true } : inv));
    setConfirmTarget(null);
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.vendor.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoiceNo.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPayables = initialPayables.filter(pay =>
    pay.vendor.toLowerCase().includes(search.toLowerCase()) ||
    pay.refNo.toLowerCase().includes(search.toLowerCase())
  );

  const totalPurchases = invoices.reduce((s, i) => s + i.amount, 0);
  const totalPayables  = initialPayables.reduce((s, p) => s + p.amount, 0);


  const [showPayableModal, setShowPayableModal] = useState(false);

const [payableForm, setPayableForm] = useState({
  vendor: "",
  outstanding: "",
  date: "",
  remark: "",
  amount: "",
  paymentMode: "Cash",
});
  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Purchase</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {isInvoice ? "Purchase Overview" : "Payables Overview"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
            {isInvoice ? "Total Purchases" : "Total Payables"}
          </p>
          <p className="text-xl font-bold text-green-600 tabular-nums">
            {fmt(isInvoice ? totalPurchases : totalPayables)}
          </p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-0.5">
          {TABS.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setSearch(""); setExpandedId(null); }}
              className={`px-5 py-1.5 rounded-md text-sm font-medium transition-all duration-150
                ${activeTab === tab ? "bg-[#1e3a8a] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
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
      ? navigate("/purchase-invoice")
      : setShowPayableModal(true)
  }
>
  <FiPlus size={14} />
  {isInvoice ? "New Invoice" : "Add Payable"}
</Button>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Search — matches Table component */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="relative w-1/2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={isInvoice ? "Search purchase invoices..." : "Search payables..."}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
        </div>

        {isInvoice ? (
          <>
            {/* Invoice Table Head */}
            <div className="grid grid-cols-[32px_1fr_140px_130px_130px_120px] border-b border-gray-200 bg-gray-50 px-6">
              <div className="py-3" />
              <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Vendor</div>
              <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice No</div>
              <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</div>
              <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right pr-6">Amount</div>
              <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Status</div>
            </div>

            {filteredInvoices.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-10">No invoices found.</p>
            )}

            {filteredInvoices.map((inv, idx) => {
              const isExpanded = expandedId === inv.id;
              const isLast = idx === filteredInvoices.length - 1;

              return (
                <div key={inv.id} className={!isLast ? "border-b border-gray-100" : ""}>

                  {/* Main row */}
                  <div
                    onClick={() => toggleRow(inv.id)}
                    className={`grid grid-cols-[32px_1fr_140px_130px_130px_120px] px-6 cursor-pointer items-center transition-colors
                      ${isExpanded ? "bg-blue-50/60" : "hover:bg-gray-50"}`}
                  >
                    <div className="flex items-center py-4">
                      <button
                        onClick={(e) => handleToggleConfirm(e, inv)}
                        className={`w-4 h-4 rounded-[3px] border flex items-center justify-center flex-shrink-0 transition-all
                          ${inv.confirmed ? "bg-green-500 border-green-500" : "border-gray-400 bg-white hover:border-green-400"}`}
                      >
                        {inv.confirmed && <FiCheck size={9} className="text-white" strokeWidth={3} />}
                      </button>
                    </div>

                    <div className="py-4 pr-4">
                      <p className="text-sm font-medium text-gray-800 truncate">{inv.vendor}</p>
                    </div>

                    <div className="py-4">
                      <p className="text-sm text-gray-500 font-mono">{inv.invoiceNo}</p>
                    </div>

                    <div className="py-4">
                      <p className="text-sm text-gray-500">{inv.date}</p>
                    </div>

                    <div className="py-4 text-right pr-6">
                      <p className="text-sm font-semibold text-gray-800 tabular-nums">{fmt(inv.amount)}</p>
                    </div>

                    <div className="py-4 flex items-center justify-center gap-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded
                        ${inv.confirmed ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                        {inv.confirmed ? "Confirmed" : "Pending"}
                      </span>
                      <FiChevronDown size={12} className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </div>

                  {/* Expanded panel */}
                  {isExpanded && (
                    <div className="bg-gray-50/80 border-t border-gray-100 py-3">
                      <table className="w-full mb-3 table-fixed">
                        <colgroup>
                          <col style={{ width: "32px" }} />
                          <col />
                          <col style={{ width: "140px" }} />
                          <col style={{ width: "130px" }} />
                          <col style={{ width: "130px" }} />
                          <col style={{ width: "120px" }} />
                        </colgroup>
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="px-6 pb-2" />
                            <th className="text-left px-0 pb-2 text-xs font-semibold text-gray-400 pr-4">Item</th>
                            <th className="text-left px-0 pb-2 text-xs font-semibold text-gray-400">Bags</th>
                            <th className="text-left px-0 pb-2 text-xs font-semibold text-gray-400">Qty</th>
                            <th className="text-right px-0 pb-2 text-xs font-semibold text-gray-400 pr-6">Price</th>
                            <th className="text-center px-0 pb-2 text-xs font-semibold text-gray-400">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inv.items.map((row, i) => (
                            <tr key={i} className="border-b border-gray-100 last:border-0">
                              <td className="px-6" />
                              <td className="py-2 text-xs text-gray-700 font-medium pr-4">{row.item}</td>
                              <td className="py-2 text-xs text-gray-500">{row.bags}</td>
                              <td className="py-2 text-xs text-gray-700">{row.qty}</td>
                              <td className="py-2 text-xs text-gray-500 text-right pr-6">{fmt(row.price)}</td>
                              <td className="py-2 text-xs font-semibold text-green-600 text-center">{fmt(row.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="flex items-center gap-2 px-6 pt-1">
                        <button onClick={() => navigate(`/purchase-invoice/${inv.id}/edit`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 transition">
                          <FiEdit2 size={11} /> Edit
                        </button>
                        <button onClick={() => navigate(`/purchase-invoice/${inv.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 transition">
                          <FiEye size={11} /> View
                        </button>
                        <button onClick={() => console.log("Account", inv)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-blue-200 text-xs font-medium text-blue-600 bg-white hover:bg-blue-50 transition">
                          <FiCreditCard size={11} /> Account
                        </button>
                        <button onClick={() => console.log("Delete", inv)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-red-200 text-xs font-medium text-red-500 bg-white hover:bg-red-50 transition ml-auto">
                          <FiTrash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        ) : (
          <>
            {/* Payables Table Head */}
            <div className="grid grid-cols-[1fr_130px_130px_110px_130px_100px] border-b border-gray-200 bg-gray-50 px-6">
              <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Vendor</div>
              <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ref No</div>
              <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</div>
              <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Method</div>
              <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right pr-6">Amount</div>
              <div className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">Status</div>
            </div>

            {filteredPayables.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-10">No payables found.</p>
            )}

            {filteredPayables.map((pay, idx) => (
              <div key={pay.id}
                className={`grid grid-cols-[1fr_130px_130px_110px_130px_100px] px-6 items-center hover:bg-gray-50 transition-colors
                  ${idx !== filteredPayables.length - 1 ? "border-b border-gray-100" : ""}`}>
                <div className="py-4">
                  <p className="text-sm font-medium text-gray-800">{pay.vendor}</p>
                </div>
                <div className="py-4 text-sm font-mono text-gray-500">{pay.refNo}</div>
                <div className="py-4 text-sm text-gray-500">{pay.date}</div>
                <div className="py-4 text-sm text-gray-500">{pay.method}</div>
                <div className="py-4 text-sm font-semibold text-gray-800 text-right pr-6 tabular-nums">{fmt(pay.amount)}</div>
                <div className="py-4 flex justify-center">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded
                    ${pay.status === "Paid" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                    {pay.status}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {showPayableModal && (
  <Modal title="Add Payable" onClose={() => setShowPayableModal(false)}>

    <div className="space-y-4">

      <input
        placeholder="Vendor"
        value={payableForm.vendor}
        onChange={(e) =>
          setPayableForm({ ...payableForm, vendor: e.target.value })
        }
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />

      <input
        placeholder="Outstanding"
        value={payableForm.outstanding}
        onChange={(e) =>
          setPayableForm({ ...payableForm, outstanding: e.target.value })
        }
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />

      <input
        type="date"
        value={payableForm.date}
        onChange={(e) =>
          setPayableForm({ ...payableForm, date: e.target.value })
        }
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />

      <input
        placeholder="Remark"
        value={payableForm.remark}
        onChange={(e) =>
          setPayableForm({ ...payableForm, remark: e.target.value })
        }
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />

      <input
        type="number"
        placeholder="Amount"
        value={payableForm.amount}
        onChange={(e) =>
          setPayableForm({ ...payableForm, amount: e.target.value })
        }
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />

      <select
        value={payableForm.paymentMode}
        onChange={(e) =>
          setPayableForm({
            ...payableForm,
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
          onClick={() => setShowPayableModal(false)}
          className="px-4 py-2 text-sm border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            console.log(payableForm);
            setShowPayableModal(false);
          }}
          className="px-4 py-2 text-sm bg-[#1e3a8a] text-white rounded-lg"
        >
          Save
        </button>

      </div>

    </div>

  </Modal>
)}

      {/* Confirm dialog */}
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

export default PurchaseInvoiceList;