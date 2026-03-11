import { useState, useEffect } from "react";
import axios from "axios";
import SearchSelect from "../../components/SearchSelect";
// ─── Constants ────────────────────────────────────────────────────────────────

const indianStates = [
  { code: "01", name: "Jammu & Kashmir" }, { code: "02", name: "Himachal Pradesh" },
  { code: "03", name: "Punjab" }, { code: "04", name: "Chandigarh" },
  { code: "05", name: "Uttarakhand" }, { code: "06", name: "Haryana" },
  { code: "07", name: "Delhi" }, { code: "08", name: "Rajasthan" },
  { code: "09", name: "Uttar Pradesh" }, { code: "10", name: "Bihar" },
  { code: "11", name: "Sikkim" }, { code: "12", name: "Arunachal Pradesh" },
  { code: "13", name: "Nagaland" }, { code: "14", name: "Manipur" },
  { code: "15", name: "Mizoram" }, { code: "16", name: "Tripura" },
  { code: "17", name: "Meghalaya" }, { code: "18", name: "Assam" },
  { code: "19", name: "West Bengal" }, { code: "20", name: "Jharkhand" },
  { code: "21", name: "Odisha" }, { code: "22", name: "Chhattisgarh" },
  { code: "23", name: "Madhya Pradesh" }, { code: "24", name: "Gujarat" },
  { code: "27", name: "Maharashtra" }, { code: "29", name: "Karnataka" },
  { code: "30", name: "Goa" }, { code: "32", name: "Kerala" },
  { code: "33", name: "Tamil Nadu" }, { code: "34", name: "Puducherry" },
  { code: "36", name: "Telangana" }, { code: "37", name: "Andhra Pradesh" },
];

const businessInfo = {
  name: "GLS TECHNOLOGIST",
  address: "Plot No. PAP-A-78, TTC Industrial Area, Pawane MIDC, Turbhe, Navi Mumbai, Maharashtra - 400709",
  state_code: "27",
  email: "glstechnologist2020@gmail.com",
  gst: "27AAUFG7297B1ZV",
  phone: "+91 98765 43210",
};

const businessTypes = ["Proprietorship", "Partnership", "LLP", "Private Limited", "Public Limited", "OPC", "Trust", "HUF", "Other"];
const gstOptions = [0, 5, 12, 18, 28];
const units = ["NOS", "PCS", "KG", "MTR", "LTR", "SET", "BOX", "ROLL", "PAIR"];
const itemTypes = ["Goods", "Service", "Raw Material", "Finished Goods", "Semi-Finished", "Consumable", "Asset"];
const paymentModes = ["Cash", "Bank Transfer", "UPI", "Cheque", "NEFT/RTGS"];
const purchaseTypeOptions = ["Credit", "Cash"];

const WALKIN_ID = "__walkin__";

const emptyVendor = {
  name: "", company_name: "", business_type: "",
  gstin: "", pan: "", phone: "",
  address_line1: "", address_line2: "", city: "", state: "", state_code: "", pincode: "",
};

const SAVED_VENDORS = [
  { id: 1, name: "Sharma Enterprises", company_name: "Sharma Ent Pvt Ltd", business_type: "Private Limited", gstin: "27ABCSH1234F1Z5", pan: "ABCSH1234F", phone: "9876543210",  address_line1: "12, Industrial Estate", address_line2: "Andheri East", city: "Mumbai", state: "Maharashtra", state_code: "27", pincode: "400001" },
  { id: 2, name: "National Distributors", company_name: "", business_type: "Partnership", gstin: "29NATDX5678L1Z2", pan: "NATDX5678L", phone: "9123456789", address_line1: "45 MG Road", address_line2: "", city: "Bangalore", state: "Karnataka", state_code: "29", pincode: "560001" },
  { id: 3, name: "Rajesh & Co", company_name: "", business_type: "Proprietorship", gstin: "33RAJCO9012M1Z8", pan: "RAJCO9012M", phone: "9988776655", address_line1: "7, Anna Salai", address_line2: "", city: "Chennai", state: "Tamil Nadu", state_code: "33", pincode: "600002" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const numberToWords = (num) => {
  if (num === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + convert(n % 1000) : "");
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + convert(n % 100000) : "");
    return convert(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
  };
  return convert(Math.round(num));
};

// ─── Shared UI (exact copy from SalesInvoice) ─────────────────────────────────

const inputStyle = {
  width: "100%", padding: "9px 12px", border: "1.5px solid #e5e7eb",
  borderRadius: "8px", fontSize: "13.5px", color: "#111827",
  background: "#ffffff", outline: "none", boxSizing: "border-box",
};

const Field = ({ label, required, children, className = "", hint }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "#111827", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "4px" }}>
      {label}
      {required && <span style={{ color: "#ef4444" }}>*</span>}
      {!required && hint && (
        <span style={{ color: "#9ca3af", fontSize: "10px", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>({hint})</span>
      )}
    </label>
    {children}
  </div>
);

const TextInput = ({ value, onChange, placeholder, type = "text", readOnly }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
    style={{ ...inputStyle, background: "#ffffff", cursor: readOnly ? "not-allowed" : "text" }}
    onFocus={(e) => !readOnly && (e.target.style.borderColor = "#3b82f6")}
    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
  />
);

const SelectInput = ({ value, onChange, options = [], placeholder }) => (
  <select
    value={value}
    onChange={onChange}
    style={{
      ...inputStyle,
      appearance: "none",
      backgroundImage:
        `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center"
    }}
  >
    <option value="">{placeholder}</option>

    {options.map((o, index) => {

      const value = typeof o === "object" ? o.value : o;
      const label = typeof o === "object" ? o.label : o;

      return (
        <option key={index} value={value}>
          {label}
        </option>
      );

    })}
  </select>
);

const Section = ({ title, children }) => (
  <div style={{ background: "#fff", borderRadius: "12px", border: "1.5px solid #e5e7eb", marginBottom: "20px" }}>
    <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#374151", textTransform: "uppercase" }}>{title}</span>
    </div>
    <div style={{ padding: "20px" }}>{children}</div>
  </div>
);

const OtpInput = ({ value, onChange, length, numbersOnly = false }) => (
  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
    {Array.from({ length }).map((_, index) => (
      <input
        key={index}
        maxLength={1}
        value={value[index] || ""}
        onChange={(e) => {
          const raw = numbersOnly
            ? e.target.value.replace(/[^0-9]/g, "")
            : e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
          const newVal = value.substring(0, index) + raw + value.substring(index + 1);
          onChange(newVal);
          if (raw && e.target.nextSibling) e.target.nextSibling.focus();
        }}
        onKeyDown={(e) => {
          if (e.key === "Backspace" && !value[index] && e.target.previousSibling) e.target.previousSibling.focus();
          if (e.key === "ArrowLeft" && e.target.previousSibling) { e.preventDefault(); e.target.previousSibling.focus(); }
          if (e.key === "ArrowRight" && e.target.nextSibling) { e.preventDefault(); e.target.nextSibling.focus(); }
        }}
        style={{ width: "32px", height: "36px", textAlign: "center", fontSize: "14px", fontWeight: 600, border: "1.5px solid #d1d5db", borderRadius: "6px", outline: "none" }}
        onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
        onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
      />
    ))}
  </div>
);

// ─── Vendor Detail Form (mirrors AddressForm from SalesInvoice) ───────────────

const VendorForm = ({ form, update, title, states, cities }) => (  <div>
    <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e3a5f", marginBottom: "14px", paddingBottom: "8px", borderBottom: "1.5px solid #f0f4f8" }}>
      {title}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
      {/* Row 1 — Identity */}
      <Field label="Vendor / Contact Name" hint="optional">
        <TextInput value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Supplier name" />
      </Field>
      <Field label="Company Name" hint="optional">
        <TextInput value={form.company_name} onChange={(e) => update("company_name", e.target.value)} placeholder="Company Pvt Ltd" />
      </Field>
      <Field label="Business Type" hint="optional">
        <SelectInput value={form.business_type} onChange={(e) => update("business_type", e.target.value)} placeholder="Select type"
          options={businessTypes.map((t) => ({ value: t, label: t }))} />
      </Field>

      {/* Row 2 — Tax */}
      <Field label="GSTIN" hint="optional">
        <OtpInput value={form.gstin || ""} onChange={(v) => update("gstin", v)} length={15} />
      </Field>
      <Field label="PAN" hint="optional">
        <OtpInput value={form.pan || ""} onChange={(v) => update("pan", v)} length={10} />
      </Field>
      <div />

      {/* Row 3 — Contact */}
      <Field label="Mobile Number" hint="optional">
        <OtpInput value={form.phone || ""} onChange={(v) => update("phone", v)} length={10} numbersOnly />
      </Field>


      {/* Divider */}
      <div style={{ gridColumn: "1 / -1", height: "1px", background: "#f0f4f8" }} />

      {/* Row 4 — Address */}
      <Field label="Address Line 1" hint="optional">
        <TextInput value={form.address_line1} onChange={(e) => update("address_line1", e.target.value)} placeholder="Building, Street, Area" />
      </Field>
      <Field label="Address Line 2" hint="optional">
        <TextInput value={form.address_line2} onChange={(e) => update("address_line2", e.target.value)} placeholder="Landmark (optional)" />
      </Field>
<Field label="City" hint="optional">

<SearchSelect
value={form.city}
onChange={(val)=>update("city",val)}
options={cities}
placeholder="Search City"
/>

</Field>
     <Field label="State" hint="optional">

<SearchSelect
value={form.state}
onChange={(val)=>update("state",val)}
options={states}
placeholder="Search State"
/>

</Field>
      <Field label="State Code">
        <TextInput value={form.state_code} readOnly placeholder="27" />
      </Field>
      <Field label="Pincode" hint="optional">
        <TextInput value={form.pincode} onChange={(e) => update("pincode", e.target.value)} placeholder="400001" />
      </Field>
      <div />
    </div>
  </div>
);

// ─── Add Vendor Modal ─────────────────────────────────────────────────────────

function AddVendorModal({ onSave, onClose }) {

  const [form, setForm] = useState({ ...emptyVendor });

  const update = (field, val) => {

    if (field === "state") {

      const st = indianStates.find((s) => s.name === val);

      setForm((f) => ({
        ...f,
        state: val,
        state_code: st ? st.code : ""
      }));

    } else {

      setForm((f) => ({
        ...f,
        [field]: val
      }));

    }

  };

  const handleSave = () => {

    if (!form.name.trim()) {
      alert("Vendor name is required");
      return;
    }

    onSave({
      ...form,
      id: Date.now()
    });

  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "700px", boxShadow: "0 24px 64px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column", maxHeight: "90vh", overflow: "hidden" }}>

        <div style={{ background: "#1e3a5f", padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: "15px" }}>Add New Vendor</div>
          </div>
          <button onClick={onClose}>×</button>
        </div>

        <div style={{ padding: "20px" }}>
<VendorForm
  form={form}
  update={update}
  title="Vendor Details"
states={indianStates.map(s => ({ value: s.name, label: s.name }))}  cities={[]}
/>        </div>

        <div style={{ padding: "14px 24px", borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save Vendor</button>
        </div>

      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PurchaseInvoice() {
  const today = new Date().toISOString().split("T")[0];


  const [states, setStates] = useState([]);
const [cities, setCities] = useState([]);
const [hsnList, setHsnList] = useState([]);

useEffect(() => {

  fetchStates();
  fetchHSN();

}, []);


const fetchStates = async () => {

  try {

    const res = await axios.get("http://localhost:8000/api/states");

    if (res.data.success) {
      setStates(res.data.data);
    }

  } catch (err) {
    console.log(err);
  }

};


const fetchCities = async (state) => {

  try {

    const res = await axios.get(`http://localhost:8000/api/cities/${state}`);

    if (res.data.success) {
      setCities(res.data.data);
    }

  } catch (err) {
    console.log(err);
  }

};


const fetchHSN = async () => {

  try {

    const res = await axios.get("http://localhost:8000/api/hsn");

    if (res.data.success) {
      setHsnList(res.data.data);
    }

  } catch (err) {
    console.log(err);
  }

};
  // Purchase meta
  const [supplierInvNo, setSupplierInvNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [entryDate, setEntryDate] = useState(today);
  const [purchaseType, setPurchaseType] = useState("Credit");
  const [notes, setNotes] = useState("");

  // Vendors
  const [vendors, setVendors] = useState(SAVED_VENDORS);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorForm, setVendorForm] = useState({ ...emptyVendor });
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(vendorSearch.toLowerCase())
  );

  const selectVendor = (v) => {
    setSelectedVendor(v);
    setVendorForm({ ...v });
    setShowVendorDropdown(false);
    setVendorSearch("");
  };

  const selectWalkIn = () => {
    const walkin = { ...emptyVendor, id: WALKIN_ID, name: "Walk-in" };
    setSelectedVendor(walkin);
    setVendorForm({ ...emptyVendor, name: "Walk-in" });
    setShowVendorDropdown(false);
    setVendorSearch("");
  };

  const updateVendorForm = (field, val) => {
    if (field === "state") {
fetchCities(val);

const st = indianStates.find((s) => s.name === val);
      setVendorForm((f) => ({ ...f, state: val, state_code: st ? st.code : f.state_code }));
    } else {
      setVendorForm((f) => ({ ...f, [field]: val }));
    }
  };

  const handleAddVendorSave = (newVendor) => {
    setVendors((prev) => [...prev, newVendor]);
    selectVendor(newVendor);
    setShowAddVendorModal(false);
  };

  const vendorTypeLabel =
    selectedVendor?.id === WALKIN_ID ? "Walk-in" :
    selectedVendor ? "Saved Vendor" : "";

  // Items
  const [items, setItems] = useState([
    { name: "", itemType: "Goods", sku: "", hsn: "", qty: 1, unit: "NOS", purchasePrice: 0, discount: 0, gstRate: 18 },
  ]);
  const [otherCharges, setOtherCharges] = useState(0);
  const [otherChargesLabel, setOtherChargesLabel] = useState("Freight / Shipping");

  const updateItem = (i, f, v) => { const u = [...items]; u[i][f] = v; setItems(u); };
  const addItem = () => setItems([...items, { name: "", itemType: "Goods", sku: "", hsn: "", qty: 1, unit: "NOS", purchasePrice: 0, discount: 0, gstRate: 18 }]);
  const removeItem = (i) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i));

  const itemTaxable = (item) => { const g = item.qty * item.purchasePrice; return g - (g * item.discount) / 100; };
  const itemTax = (item) => (itemTaxable(item) * item.gstRate) / 100;
  const itemTotal = (item) => itemTaxable(item) + itemTax(item);
  const subtotal = items.reduce((s, i) => s + i.qty * i.purchasePrice, 0);
  const totalDiscount = items.reduce((s, i) => s + (i.qty * i.purchasePrice * i.discount) / 100, 0);
  const taxableAmount = subtotal - totalDiscount;
  const totalTax = items.reduce((s, i) => s + itemTax(i), 0);
  const beforeRound = taxableAmount + totalTax + Number(otherCharges);
  const grandTotal = Math.round(beforeRound);
  const roundOff = grandTotal - beforeRound;

  const taxSummary = items.reduce((acc, item) => {
    const key = item.hsn || "N/A";
    if (!acc[key]) acc[key] = { hsn: key, taxable: 0, taxAmt: 0, rate: item.gstRate };
    acc[key].taxable += itemTaxable(item);
    acc[key].taxAmt += itemTax(item);
    return acc;
  }, {});

  // Payment
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentRef, setPaymentRef] = useState("");
  const balancePayable = grandTotal - Number(amountPaid);

const handleSavePurchase = async () => {

  if (!supplierInvNo) {
    alert("Supplier Invoice No is required");
    return;
  }

  if (!vendorForm.name) {
    alert("Vendor name is required");
    return;
  }

  const payload = {
    supplierInvNo,
    invoiceDate,
    entryDate,
    purchaseType,
    notes,
    vendor: vendorForm,
    items,
    otherCharges,
    otherChargesLabel,
    grandTotal,
    payment: {
      mode: paymentMode,
      amountPaid,
      remark: paymentRef
    }
  };

  try {

    const res = await axios.post(
      "http://localhost:8000/api/purchase/create",
      payload
    );

    if (res.data.success) {
      alert("Purchase Saved Successfully");
      console.log(res.data);
    } else {
      alert(res.data.message || "Error saving purchase");
    }

  } catch (err) {
    console.error(err);
    alert("Server Error");
  }

};

  return (
    <div style={{ width: "100%", margin: "0" }}>
      {showAddVendorModal && <AddVendorModal onSave={handleAddVendorSave} onClose={() => setShowAddVendorModal(false)} />}

      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 800, color: "#0b1324", letterSpacing: "-0.3px" }}>Add Stock / Purchase Entry</h1>
          <p style={{ margin: 0, fontSize: "12.5px", color: "#6b7280", marginTop: "2px" }}>Record a new stock purchase from a supplier</p>
        </div>
      </div>

      {/* Company Banner */}
      <div style={{ background: "#1e3a5f", borderRadius: "12px", padding: "20px 24px", marginBottom: "20px", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "0.5px", marginBottom: "4px" }}>{businessInfo.name}</div>
            <div style={{ fontSize: "12px", opacity: 0.8, maxWidth: "420px", lineHeight: "1.5" }}>{businessInfo.address},</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>State Code : {businessInfo.state_code}</div>
            <div style={{ fontSize: "12px", opacity: 0.75, marginTop: "4px" }}>{businessInfo.email} · {businessInfo.phone}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "2px", letterSpacing: "0.05em" }}>GSTIN</div>
            <div style={{ fontSize: "13.5px", fontWeight: 700, fontFamily: "monospace", letterSpacing: "1px" }}>{businessInfo.gst}</div>
          </div>
        </div>
      </div>

      {/* ── Purchase Details ── */}
      <Section title="Purchase Details">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <Field label="Supplier Invoice No." required>
            <TextInput value={supplierInvNo} onChange={(e) => setSupplierInvNo(e.target.value)} placeholder="e.g. SUP/2526/001" />
          </Field>
          <Field label="Invoice Date" required>
            <TextInput type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
          </Field>
          <Field label="Entry Date">
            <TextInput type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} />
          </Field>
          <Field label="Purchase Type" required>
            <SelectInput value={purchaseType} onChange={(e) => setPurchaseType(e.target.value)} placeholder="Select Type"
              options={purchaseTypeOptions.map((p) => ({ value: p, label: p }))} />
          </Field>
          <Field label="Notes / Remarks" hint="optional">
            <TextInput value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any notes about this purchase..." />
          </Field>
        </div>
      </Section>

      {/* ── Vendor / Supplier ── */}
      <Section title="Vendor / Supplier">

        {/* Vendor selector row — mirrors customer selector in SalesInvoice */}
        <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1.5px dashed #e5e7eb" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", alignItems: "end" }}>

            <Field label="Select Existing Vendor">
              <div style={{ position: "relative" }}>
                <div onClick={() => setShowVendorDropdown(!showVendorDropdown)}
                  style={{ ...inputStyle, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <span style={{ color: selectedVendor ? "#111827" : "#9ca3af" }}>
                    {selectedVendor
                      ? (selectedVendor.id === WALKIN_ID ? "🚶 Walk-in Vendor" : selectedVendor.name)
                      : "Search & select vendor..."}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {selectedVendor && (
                      <span
                        onClick={(e) => { e.stopPropagation(); setSelectedVendor(null); setVendorForm({ ...emptyVendor }); }}
                        style={{ fontSize: "15px", color: "#9ca3af", cursor: "pointer", lineHeight: 1 }}
                        title="Clear">×</span>
                    )}
                    <span style={{ fontSize: "10px", color: "#6b7280" }}>▼</span>
                  </div>
                </div>

                {showVendorDropdown && (
                  <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, overflow: "hidden" }}>
                    <div style={{ padding: "10px" }}>
                      <input autoFocus value={vendorSearch} onChange={(e) => setVendorSearch(e.target.value)}
                        placeholder="Search vendor..." style={{ ...inputStyle, background: "#f9fafb" }} />
                    </div>

                    {/* Walk-in option */}
                    <div onClick={selectWalkIn}
                      style={{ padding: "10px 14px", cursor: "pointer", borderTop: "1px solid #f3f4f6", background: "#fffbeb", display: "flex", alignItems: "center", gap: "10px", borderBottom: "1px solid #fde68a" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fef3c7")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#fffbeb")}>
                      <span style={{ fontSize: "16px" }}>🚶</span>
                      <div>
                        <div style={{ fontWeight: 700, color: "#92400e", fontSize: "13px" }}>Walk-in Vendor</div>
                        <div style={{ fontSize: "11px", color: "#b45309" }}>One-time purchase — fill details below as needed</div>
                      </div>
                      <span style={{ marginLeft: "auto", fontSize: "10px", background: "#f59e0b", color: "#fff", padding: "2px 8px", borderRadius: "20px", fontWeight: 700, whiteSpace: "nowrap" }}>QUICK</span>
                    </div>

                    {/* Saved vendor list */}
                    <div style={{ maxHeight: "180px", overflowY: "auto" }}>
                      {filteredVendors.length === 0 && (
                        <div style={{ padding: "12px 14px", fontSize: "12.5px", color: "#9ca3af", textAlign: "center" }}>No vendors found</div>
                      )}
                      {filteredVendors.map((v) => (
                        <div key={v.id} onClick={() => selectVendor(v)}
                          style={{ padding: "10px 14px", cursor: "pointer", fontSize: "13px", borderTop: "1px solid #f3f4f6" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
                          <div style={{ fontWeight: 600, color: "#111827" }}>{v.name}</div>
                          <div style={{ fontSize: "11px", color: "#6b7280" }}>{v.gstin} · {v.city}</div>
                        </div>
                      ))}
                    </div>

                    {/* Add new vendor */}
                    <div style={{ padding: "10px 14px", borderTop: "1.5px solid #e5e7eb" }}>
                      <button onClick={(e) => { e.stopPropagation(); setShowVendorDropdown(false); setShowAddVendorModal(true); }}
                        style={{ background: "none", border: "none", color: "#3b82f6", fontSize: "13px", fontWeight: 600, cursor: "pointer", padding: 0 }}>
                        + Add New Vendor
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Field>

            {/* Vendor Type — auto-detected, mirrors Customer Type field */}
            <Field label="Vendor Type">
              <TextInput value={vendorTypeLabel} readOnly placeholder="Vendor Type" />
            </Field>
          </div>
        </div>

        {/* Vendor detail form — always editable, prefilled when vendor selected */}
<VendorForm

  form={vendorForm}
  update={updateVendorForm}
  title="Vendor Details"
  states={states}
  cities={cities}
/></Section>

      {/* ── Items / Stock ── */}
      <Section title="Items / Stock">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["#", "Item Name", "Item Type", "SKU / Code", "HSN/SAC", "Unit", "Qty", "Purchase Price (₹)", "Disc %", "Taxable (₹)", "GST %", "Tax (₹)", "Total (₹)", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 10px", textAlign: ["Purchase Price (₹)", "Taxable (₹)", "Tax (₹)", "Total (₹)"].includes(h) ? "right" : "left", fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em", color: "#6b7280", textTransform: "uppercase", borderBottom: "1.5px solid #e5e7eb", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "8px 10px", color: "#9ca3af", fontWeight: 600, fontSize: "12px" }}>{i + 1}</td>
                  <td style={{ padding: "5px 6px", minWidth: "150px" }}>
                    <input value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} placeholder="Item name" style={{ ...inputStyle, padding: "6px 9px", fontSize: "12.5px" }} />
                  </td>
                  <td style={{ padding: "5px 6px", minWidth: "120px" }}>
                    <select value={item.itemType} onChange={(e) => updateItem(i, "itemType", e.target.value)} style={{ ...inputStyle, padding: "6px 7px", fontSize: "12px" }}>
                      {itemTypes.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "5px 6px", width: "90px" }}>
                    <input value={item.sku} onChange={(e) => updateItem(i, "sku", e.target.value)} placeholder="SKU" style={{ ...inputStyle, padding: "6px 9px", fontSize: "12.5px" }} />
                  </td>
                  <td style={{ padding: "5px 6px", width: "80px" }}>
                  

<select
  value={item.hsn}
  onChange={(e) => updateItem(i, "hsn", e.target.value)}
  style={{ ...inputStyle, padding: "6px 7px", fontSize: "12px" }}
>

<option value="">Select HSN</option>

{hsnList.map((h, index) => {

  const code =
    h.code ||
    h.hsn ||
    h.HSNCode ||
    "";

  const description =
    h.description ||
    h.desc ||
    h.Description ||
    "";

  return (
    <option key={index} value={code}>
      {code} - {description}
    </option>
  );

})}

</select>               </td>
                  <td style={{ padding: "5px 6px", width: "75px" }}>
                    <select value={item.unit} onChange={(e) => updateItem(i, "unit", e.target.value)} style={{ ...inputStyle, padding: "6px 7px", fontSize: "12px" }}>
                      {units.map((u) => <option key={u}>{u}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "5px 6px", width: "60px" }}>
                    <input type="number" min={1} value={item.qty} onChange={(e) => updateItem(i, "qty", Number(e.target.value))} style={{ ...inputStyle, padding: "6px 8px", fontSize: "12.5px", textAlign: "center" }} />
                  </td>
                  <td style={{ padding: "5px 6px", width: "110px" }}>
                    <input type="number" value={item.purchasePrice} onChange={(e) => updateItem(i, "purchasePrice", Number(e.target.value))} style={{ ...inputStyle, padding: "6px 8px", fontSize: "12.5px", textAlign: "right" }} />
                  </td>
                  <td style={{ padding: "5px 6px", width: "60px" }}>
                    <input type="number" min={0} max={100} value={item.discount} onChange={(e) => updateItem(i, "discount", Number(e.target.value))} style={{ ...inputStyle, padding: "6px 8px", fontSize: "12.5px", textAlign: "center" }} />
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 600, color: "#374151", whiteSpace: "nowrap", fontSize: "12.5px" }}>
                    ₹ {itemTaxable(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "5px 6px", width: "70px" }}>
                    <select value={item.gstRate} onChange={(e) => updateItem(i, "gstRate", Number(e.target.value))} style={{ ...inputStyle, padding: "6px 7px", fontSize: "12px" }}>
                      {gstOptions.map((r) => <option key={r} value={r}>{r}%</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", color: "#374151", whiteSpace: "nowrap", fontSize: "12.5px" }}>
                    ₹ {itemTax(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#1e3a5f", whiteSpace: "nowrap", fontSize: "12.5px" }}>
                    ₹ {itemTotal(item).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "5px 6px", textAlign: "center" }}>
                    <button onClick={() => removeItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "16px", padding: "4px 6px", borderRadius: "6px" }} title="Remove">×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button onClick={addItem} style={{ marginTop: "12px", padding: "8px 16px", border: "1.5px dashed #d1d5db", borderRadius: "8px", background: "none", fontSize: "13px", fontWeight: 600, color: "#3b82f6", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "16px" }}>+</span> Add Item
        </button>

        {/* Totals — identical structure to SalesInvoice */}
        <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "340px", background: "#f8fafc", borderRadius: "10px", padding: "16px", border: "1.5px solid #e5e7eb" }}>
            {[
              { label: "Subtotal (Gross)", value: `₹ ${subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` },
              { label: "Total Discount", value: `- ₹ ${totalDiscount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` },
              { label: "Taxable Amount", value: `₹ ${taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}` },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px", color: "#374151" }}>
                <span>{row.label}</span>
                <span style={{ fontWeight: 600 }}>{row.value}</span>
              </div>
            ))}
            <div style={{ height: "1px", background: "#e5e7eb", margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#374151" }}>
              <span>Total Tax Amount</span>
              <span style={{ fontWeight: 600 }}>₹ {totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            {/* Other Charges — editable row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", gap: "8px" }}>
              <input value={otherChargesLabel} onChange={(e) => setOtherChargesLabel(e.target.value)}
                style={{ ...inputStyle, fontSize: "13px", padding: "5px 8px", flex: 1 }} />
              <input type="number" value={otherCharges} onChange={(e) => setOtherCharges(e.target.value)}
                style={{ ...inputStyle, fontSize: "13px", padding: "5px 8px", width: "100px", textAlign: "right" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "13px", color: "#374151" }}>
              <span>Round Off</span>
              <span style={{ color: roundOff >= 0 ? "#10b981" : "#ef4444" }}>{roundOff >= 0 ? "+" : ""}₹ {roundOff.toFixed(2)}</span>
            </div>
            <div style={{ background: "#1e3a5f", borderRadius: "8px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>Grand Total</span>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: "16px" }}>₹ {grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={{ marginTop: "10px", fontSize: "11.5px", color: "#6b7280", lineHeight: "1.5" }}>
              <span style={{ fontWeight: 700, color: "#374151" }}>In Words: </span>
              {numberToWords(Math.round(grandTotal))} Rupees Only
            </div>
          </div>
        </div>
      </Section>

      {/* ── Tax Summary (HSN-wise) ── */}
      <Section title="Tax Summary (HSN-wise)">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Sr.", "HSN/SAC", "Taxable Value", "GST Rate", "Tax Amount", "Total"].map((h) => (
                  <th key={h} style={{ padding: "10px 12px", textAlign: ["Taxable Value", "Tax Amount", "Total"].includes(h) ? "right" : "left", fontSize: "11px", fontWeight: 700, letterSpacing: "0.04em", color: "#6b7280", textTransform: "uppercase", borderBottom: "1.5px solid #e5e7eb" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.values(taxSummary).map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "10px 12px", color: "#9ca3af" }}>{i + 1}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{row.hsn}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>₹ {row.taxable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: "10px 12px" }}>{row.rate}%</td>
                  <td style={{ padding: "10px 12px", textAlign: "right" }}>₹ {row.taxAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#1e3a5f" }}>₹ {(row.taxable + row.taxAmt).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
              <tr style={{ background: "#f0f4f8" }}>
                <td colSpan={2} style={{ padding: "10px 12px", fontWeight: 700, fontSize: "12px", color: "#374151" }}>TOTAL</td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>₹ {taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td />
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700 }}>₹ {totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#1e3a5f" }}>₹ {(taxableAmount + totalTax).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── Payment Details ── */}
      <Section title="Payment Details">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          <Field label="Payment Mode" required>
            <SelectInput value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} placeholder="Select Mode"
              options={paymentModes.map((m) => ({ value: m, label: m }))} />
          </Field>
          <Field label="Amount Paid">
            <TextInput type="number" value={amountPaid} onChange={(e) => setAmountPaid(Number(e.target.value))} placeholder="0.00" />
          </Field>
          <Field label="Remark" hint="optional">
            <TextInput value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} placeholder="" />
          </Field>
        </div>

        {/* Balance Summary — identical to SalesInvoice */}
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: "340px", background: "#f8fafc", borderRadius: "10px", padding: "16px", border: "1.5px solid #e5e7eb" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px", color: "#374151" }}>
              <span>Grand Total</span>
              <span style={{ fontWeight: 600 }}>₹ {grandTotal.toLocaleString("en-IN")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px", color: "#374151" }}>
              <span>Amount Paid</span>
              <span style={{ fontWeight: 600 }}>₹ {Number(amountPaid).toLocaleString("en-IN")}</span>
            </div>
            <div style={{ height: "1px", background: "#e5e7eb", margin: "12px 0" }} />
            <div style={{ background: balancePayable > 0 ? "#1e3a5f" : "#065f46", borderRadius: "8px", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700 }}>{balancePayable > 0 ? "Balance Payable" : "Advance / Change"}</span>
              <span style={{ color: "#fff", fontWeight: 800 }}>₹ {Math.abs(balancePayable).toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer Actions */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingBottom: "40px" }}>
        <button style={{ padding: "11px 28px", border: "1.5px solid #d1d5db", borderRadius: "8px", background: "#fff", fontSize: "13.5px", fontWeight: 600, color: "#374151", cursor: "pointer" }}>Cancel</button>
       <button
  onClick={handleSavePurchase}
  style={{
    padding: "11px 28px",
    border: "none",
    borderRadius: "8px",
    background: "#1e3a5f",
    fontSize: "13.5px",
    fontWeight: 700,
    color: "#fff",
    cursor: "pointer",
    letterSpacing: "0.3px"
  }}
>
  Save Purchase Entry
</button>
      </div>
    </div>
  );
}