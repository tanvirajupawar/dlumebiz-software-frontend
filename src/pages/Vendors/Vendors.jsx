import { useState } from "react";

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

const businessTypes = [
  "Proprietorship","Partnership","LLP","Private Limited",
  "Public Limited","OPC","Trust","HUF","Other"
];

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  border: "1.5px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "13.5px",
  color: "#111827",
  background: "#ffffff",
  outline: "none",
  boxSizing: "border-box",
};

const emptyForm = {
  vendor_name: "",
  company_name: "",
  business_type: "",
  vendor_gstin: "",
  vendor_pan: "",
  vendor_phone: "",
  vendor_alt_phone: "",
  vendor_email: "",
  vendor_website: "",
  vendor_address_line1: "",
  vendor_address_line2: "",
  vendor_city: "",
  vendor_state: "",
  vendor_state_code: "",
  vendor_pincode: "",
};

const validateGST = (v) =>
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(v);

const validatePAN = (v) =>
  /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);

const validateEmail = (v) =>
  !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const validatePhone = (v) =>
  !v || /^[6-9][0-9]{9}$/.test(v);

const validatePincode = (v) =>
  !v || /^[1-9][0-9]{5}$/.test(v);

/* ---------- Components ---------- */

function Field({ label, required, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        color: "#111827",
        textTransform: "uppercase",
        marginBottom: "5px"
      }}>
        {label}{required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", readOnly }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      style={{ ...inputStyle, cursor: readOnly ? "not-allowed" : "text" }}
    />
  );
}

function SelectInput({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={onChange} style={inputStyle}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Section({ title, children }) {
  return (
    <div style={{
      background:"#fff",
      borderRadius:"12px",
      border:"1.5px solid #e5e7eb",
      marginBottom:"20px"
    }}>
      <div style={{
        padding:"14px 20px",
        background:"#f8fafc",
        borderBottom:"1.5px solid #e5e7eb",
        fontWeight:700
      }}>
   {title}
      </div>
      <div style={{ padding:"20px" }}>{children}</div>
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function Vendors() {

const [form,setForm]=useState(emptyForm);

const update=(field,value)=>{

if(field==="vendor_state"){
const st=indianStates.find((s)=>s.name===value);

setForm(prev=>({
...prev,
vendor_state:value,
vendor_state_code:st?st.code:""
}));
}
else{
setForm(prev=>({
...prev,
[field]:value
}));
}



};

const validate=()=>{
const e={};

if(!form.vendor_name.trim())
e.vendor_name="Vendor name required";

if(form.vendor_gstin.length===15 && !validateGST(form.vendor_gstin))
e.vendor_gstin="Invalid GSTIN";

if(form.vendor_pan.length===10 && !validatePAN(form.vendor_pan))
e.vendor_pan="Invalid PAN";

if(!validatePhone(form.vendor_phone))
e.vendor_phone="Invalid phone";

if(!validateEmail(form.vendor_email))
e.vendor_email="Invalid email";

if(!form.vendor_address_line1.trim())
e.vendor_address_line1="Address required";

if(!form.vendor_city.trim())
e.vendor_city="City required";

if(!form.vendor_state)
e.vendor_state="State required";

if(!validatePincode(form.vendor_pincode))
e.vendor_pincode="Invalid pincode";

return e;
};

const handleSave=()=>{

const e=validate();

if(Object.keys(e).length){

return;
}


};

const grid2={
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"16px"
};

return (

<div style={{width:"100%"}}>

{/* Header */}

<div style={{marginBottom:"24px"}}>
<h1 style={{fontSize:"24px",fontWeight:800}}>
Add Vendor
</h1>
<p style={{fontSize:"12px",color:"#6b7280"}}>
Create a new vendor record
</p>
</div>

{/* Basic Info */}

<Section title="Basic Information" >
<div style={grid2}>

<Field label="Vendor Name" required>
<TextInput
value={form.vendor_name}
onChange={(e)=>update("vendor_name",e.target.value)}
placeholder="Supplier name"
/>
</Field>

<Field label="Company Name">
<TextInput
value={form.company_name}
onChange={(e)=>update("company_name",e.target.value)}
placeholder="Company Pvt Ltd"
/>
</Field>

<Field label="Business Type">
<SelectInput
value={form.business_type}
onChange={(e)=>update("business_type",e.target.value)}
placeholder="Select Business Type"
options={businessTypes.map(t=>({value:t,label:t}))}
/>
</Field>

</div>
</Section>

{/* Tax */}

<Section title="Tax & Identity" >
<div style={grid2}>

<Field label="GSTIN">
<TextInput
value={form.vendor_gstin}
onChange={(e)=>update("vendor_gstin",e.target.value.toUpperCase())}
placeholder="GSTIN"
/>
</Field>

<Field label="PAN">
<TextInput
value={form.vendor_pan}
onChange={(e)=>update("vendor_pan",e.target.value.toUpperCase())}
placeholder="PAN"
/>
</Field>

</div>
</Section>

{/* Contact */}

<Section title="Contact Details" >
<div style={grid2}>

<Field label="Mobile Number">
<TextInput
value={form.vendor_phone}
onChange={(e)=>update("vendor_phone",e.target.value)}
placeholder="9876543210"
/>
</Field>

<Field label="Alternate Mobile">
<TextInput
value={form.vendor_alt_phone}
onChange={(e)=>update("vendor_alt_phone",e.target.value)}
placeholder="Optional"
/>
</Field>

<Field label="Email">
<TextInput
type="email"
value={form.vendor_email}
onChange={(e)=>update("vendor_email",e.target.value)}
placeholder="vendor@email.com"
/>
</Field>

<Field label="Website">
<TextInput
value={form.vendor_website}
onChange={(e)=>update("vendor_website",e.target.value)}
placeholder="https://"
/>
</Field>

</div>
</Section>

{/* Address */}

<Section title="Address" >
<div style={grid2}>

<Field label="Address Line 1">
<TextInput
value={form.vendor_address_line1}
onChange={(e)=>update("vendor_address_line1",e.target.value)}
/>
</Field>

<Field label="Address Line 2">
<TextInput
value={form.vendor_address_line2}
onChange={(e)=>update("vendor_address_line2",e.target.value)}
/>
</Field>

<Field label="City">
<TextInput
value={form.vendor_city}
onChange={(e)=>update("vendor_city",e.target.value)}
/>
</Field>

<Field label="State">
<SelectInput
value={form.vendor_state}
onChange={(e)=>update("vendor_state",e.target.value)}
placeholder="Select State"
options={indianStates.map(s=>({value:s.name,label:s.name}))}
/>
</Field>

<Field label="State Code">
<TextInput
value={form.vendor_state_code}
readOnly
/>
</Field>

<Field label="Pincode">
<TextInput
value={form.vendor_pincode}
onChange={(e)=>update("vendor_pincode",e.target.value)}
placeholder="400001"
/>
</Field>

</div>
</Section>

{/* Footer */}

<div style={{
display:"flex",
justifyContent:"flex-end",
gap:"12px",
paddingBottom:"40px"
}}>

<button style={{
padding:"11px 28px",
border:"1.5px solid #e5e7eb",
borderRadius:"8px",
background:"#f8fafc"
}}>
Cancel
</button>

<button onClick={handleSave} style={{
padding:"11px 28px",
border:"none",
borderRadius:"8px",
background:"#1e3a5f",
color:"#fff",
fontWeight:700
}}>
💾 Save Vendor
</button>

</div>

</div>
);
}