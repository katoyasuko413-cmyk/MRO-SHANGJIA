/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginView from './components/auth/LoginView';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './views/Dashboard';
import QualificationWizard from './views/QualificationWizard';
import QualificationMgmt from './views/QualificationMgmt';
import ProductMgmt from './views/ProductMgmt';
import OrderMgmt from './views/OrderMgmt';
import AfterSalesMgmt from './views/AfterSalesMgmt';
import AfterSalesAddressPage from './views/AfterSalesAddress';
import FulfillmentMgmt from './views/FulfillmentMgmt';
import SettlementMgmt from './views/SettlementMgmt';
import SettlementList from './views/SettlementList';
import StoreMgmt from './views/StoreMgmt';
import BrandRecords from './views/BrandRecords';
import DataCenter from './views/DataCenter';
import AccountMgmt from './views/AccountMgmt';
import OrgMgmt from './views/OrgMgmt';
import RoleMgmt from './views/RoleMgmt';

import ContractMgmt from './views/ContractMgmt';

import Notifications from './views/Notifications';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route element={<MainLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="contract" element={<ContractMgmt />} />
          <Route path="qualification-wizard" element={<QualificationWizard />} />
          <Route path="qualification" element={<QualificationMgmt />} />
          <Route path="product" element={<ProductMgmt />} />
          <Route path="order" element={<OrderMgmt />} />
          <Route path="after-sales">
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<AfterSalesMgmt />} />
            <Route path="addresses" element={<AfterSalesAddressPage />} />
          </Route>
          <Route path="fulfillment" element={<FulfillmentMgmt />} />
          <Route path="settlement">
            <Route index element={<Navigate to="list" replace />} />
            <Route path="list" element={<SettlementMgmt />} />
            <Route path="invoice" element={<SettlementList />} />
          </Route>
          <Route path="store">
            <Route index element={<Navigate to="info" replace />} />
            <Route path="info" element={<StoreMgmt />} />
            <Route path="brand-records" element={<BrandRecords />} />
          </Route>
          <Route path="data" element={<DataCenter />} />
          <Route path="account" element={<AccountMgmt />} />
          <Route path="org" element={<OrgMgmt />} />
          <Route path="role" element={<RoleMgmt />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
