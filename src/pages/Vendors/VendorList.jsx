import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { TbWallet } from "react-icons/tb";

import Table from "../../components/Table";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import PaymentSuccessScreen from "../Payment/PaymentSuccessScreen";

const vendors = [
  {
    id: 1,
    name: "Rajesh Traders",
    company: "Rajesh Wholesale Pvt Ltd",
    email: "rajesh@wholesale.com",
    phone: "+91 98765 43210",
    address: "12 Market Yard, Pune",
    payable: "₹18,500",
  },
  {
    id: 2,
    name: "Amit Distributors",
    company: "Amit Supply Chain",
    email: "amit@supply.com",
    phone: "+91 98220 44556",
    address: "45 Industrial Area, Mumbai",
    payable: "₹9,700",
  },
  {
    id: 3,
    name: "Global Packaging",
    company: "Global Packaging Ltd",
    email: "info@globalpack.com",
    phone: "+91 98111 77889",
    address: "88 Sector 21, Delhi",
    payable: "₹5,300",
  },
  {
    id: 4,
    name: "Sunrise Suppliers",
    company: "Sunrise Enterprises",
    email: "contact@sunrise.com",
    phone: "+91 98700 11223",
    address: "34 MG Road, Bangalore",
    payable: "₹21,450",
  },
  {
    id: 5,
    name: "Om Industrial Goods",
    company: "Om Industries",
    email: "sales@omindustries.com",
    phone: "+91 98989 66554",
    address: "56 GIDC Area, Ahmedabad",
    payable: "₹3,900",
  },
];

const columns = [
  { key: "sr", label: "Sr No" },
  { key: "name", label: "Vendor Name" },
  { key: "company", label: "Company" },
  { key: "address", label: "Address" },
  { key: "phone", label: "Phone" },
  { key: "payable", label: "Payable" },
];

const VendorList = () => {
  const navigate = useNavigate();

  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [remark, setRemark] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [savedPayment, setSavedPayment] = useState(null);

  const handleSavePayment = () => {
    const today = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    setSavedPayment({
      amount: paymentAmount,
      method: paymentMode,
      date: today,
      customer: {
        first_name: selectedVendor?.name || "",
        last_name: "",
        contact_no_1: selectedVendor?.phone || "",
      },
    });

    setShowPayModal(false);
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    setShowSuccess(false);
    setSavedPayment(null);
    setPaymentAmount("");
    setPaymentMode("Cash");
    setRemark("");
    setSelectedVendor(null);
  };

  if (showSuccess && savedPayment) {
    return (
      <PaymentSuccessScreen
        amount={savedPayment.amount}
        method={savedPayment.method}
        date={savedPayment.date}
        customer={savedPayment.customer}
        onDone={handleSuccessDone}
      />
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            All Vendors
          </h1>
          <p className="text-sm text-gray-400">
            Manage all your vendors in one place.
          </p>
        </div>

        <Button
          variant="navy"
          size="md"
          className="flex items-center gap-2"
          onClick={() => navigate("/vendors/add")}
        >
          <FiPlus size={16} />
          Add Vendor
        </Button>
      </div>

      {/* Vendor Table */}
      <Table
        columns={columns}
        data={vendors.map((v, index) => ({
          ...v,
          sr: index + 1,
        }))}
        searchPlaceholder="Search vendors..."
        onRowClick={(row) => navigate(`/vendors/${row.id}`)}
        renderActions={(row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedVendor(row);
              setShowPayModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-green-600 border border-green-200 hover:bg-green-50 transition"
          >
            <TbWallet size={15} />
            Pay
          </button>
        )}
        onDelete={(row) => console.log("Delete vendor:", row)}
      />

      {/* Payment Modal */}
      {showPayModal && (
        <Modal title="Pay Vendor" onClose={() => setShowPayModal(false)}>
          <div className="space-y-4">

            <div>
              <p className="text-sm text-gray-500">Vendor</p>
              <p className="font-medium">{selectedVendor?.name}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500">Amount</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Payment Mode</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option>Cash</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-500">Remark</label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows="3"
                placeholder="Add note or remark..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPayModal(false)}
                className="px-4 py-2 text-sm border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSavePayment}
                className="px-4 py-2 text-sm bg-[#1e3a8a] text-white rounded-lg"
              >
                Save Payment
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};

export default VendorList;