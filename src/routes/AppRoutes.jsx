import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Invoices from "../pages/Invoices/Invoices";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../layout/MainLayout";
import Customers from "../pages/Customers/Customers";
import InvoiceDetail from "../pages/Invoices/InvoiceDetail";
import Profile from "../pages/Profile/Profile";
import CustomerList from "../pages/Customers/CustomerList";
import CustomerProfile from "../pages/Customers/Customerprofile";
import VendorList from "../pages/Vendors/VendorList";
import Vendors from "../pages/Vendors/Vendors";
import PurchaseInvoice from "../pages/Purchase/PurchaseInvoice";
import PurchaseInvoiceList from "../pages/Purchase/PurchaseInvoiceList";
import SalesInvoiceList from "../pages/Sales/SalesInvoiceList";
import SalesInvoice from "../pages/Sales/SalesInvoice";
import Items from "../pages/Items/ItemList";
import Collections from "../pages/Sales/Collections";
import Payables from "../pages/Purchase/Payables";
import PaymentSuccessScreen from "../pages/Payment/Paymentsuccessscreen";



const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Wrapper */}
      <Route element={<ProtectedRoute />}>
        
        {/* Layout Wrapper */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="customers" element={<Customers />} />
          <Route path="invoice/:id" element={<InvoiceDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/customer-list" element={<CustomerList />} />
          <Route path="/customers/:id" element={<CustomerProfile />} />
       <Route path="/vendor-list" element={<VendorList />} />
<Route path="/vendors" element={<Vendors />} />
<Route path="/vendors/:id" element={<Vendors />} />
<Route path="/purchase-invoice" element={<PurchaseInvoice />} />
<Route path="/purchase-invoice-list" element={<PurchaseInvoiceList />} />
<Route path="/sales-invoice-list" element={<SalesInvoiceList />} />
<Route path="/sales-invoice" element={<SalesInvoice />} />
<Route path="/item-list" element={<Items />} />
<Route path="/collections" element={<Collections />} />
<Route path="/payables" element={<Payables />} />
<Route path="/payment-success" element={<PaymentSuccessScreen />} />


        </Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;