import { createHashRouter } from "react-router";
import { Layout } from "./components/Layout";
import { MerchantDashboard } from "./components/MerchantDashboard";

import { BuyerSuppliersModule } from "./components/BuyerSuppliersModule";
import { InvoicesModule } from "./components/InvoicesModule";
import { BuyerInvoicesModule } from "./components/BuyerInvoicesModule";
import { LoginPage } from "./components/LoginPage";
import { CustomerJourneyPage } from "./components/CustomerJourneyPage";
import { SupplierJourneyPage } from "./components/SupplierJourneyPage";

export const router = createHashRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/custjour",
    Component: CustomerJourneyPage,
  },
  {
    path: "/supjour",
    Component: SupplierJourneyPage,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: MerchantDashboard,
      },
      {
        path: "suppliers",
        Component: BuyerSuppliersModule,
      },
      {
        path: "receivable-invoices",
        Component: InvoicesModule,
      },
      {
        path: "payable-invoices",
        Component: BuyerInvoicesModule,
      },
    ],
  },
]);
