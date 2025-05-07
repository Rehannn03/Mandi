import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Download, Printer } from "lucide-react";

const AkdaInvoicePreview = ({ invoice: propInvoice }) => {
  const [invoice, setInvoice] = useState(propInvoice);
  const [loading, setLoading] = useState(!propInvoice);

  useEffect(() => {
    if (propInvoice) {
      setInvoice(propInvoice);
      setLoading(false);
    } else {
      // Simulate fetching invoice data
      const fetchInvoice = async () => {
        setLoading(true);
        // Mock data
        const mockInvoice = {
          _id: "67952e2c536b03db82eed85c",
          invoiceNumber: "4793456",
          issueDate: "2023-01-16T00:00:00.000Z",
          bepariId: "6773f20570c1d8732dbf62cc",
          totalBakra: 15,
          date: "2025-01-26T00:00:00.000Z",
          kharchaDetails: {
            commision: 200,
            kasar: 50,
            kalamFare: 20,
            jagaBhada: 1000,
            motorBhada: 15000,
            karkoni: 0,
            mandiGawali: 1000,
            charaBhusa: 0,
            mazdoori: 0,
          },
          totalKharcha: 17270,
          paidAmount: 50000,
          balance: 32730,
          bepari: {
            name: "Bepari_4",
            address: "Add4",
            phone: "12345",
          },
          company: {
            name: "Akda Invoice System",
            address: "123 Business Road, City",
            phone: "+123-456-7890",
            email: "info@akdainvoice.com",
          },
        };

        setInvoice(mockInvoice);
        setLoading(false);
      };

      fetchInvoice();
    }
  }, [propInvoice]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Download PDF functionality would be implemented here");
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!invoice) {
    return (
      <div className="text-center py-8 text-red-600">Invoice not found</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-md print:shadow-none">
      <div className="print:hidden mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Invoice Preview</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded"
          >
            <Download size={16} className="mr-1" />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded"
          >
            <Printer size={16} className="mr-1" />
            Print Invoice
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 pb-6 mb-6 print:border-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="bg-[#1E3A8A] text-white p-2 rounded-md mr-3">
              <span className="text-xl font-bold">A</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {invoice.company?.name || "Akda Invoice System"}
              </h2>
              <p className="text-sm text-gray-500">
                Professional Invoice Management
              </p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">INVOICE</h2>
            <p className="text-sm text-gray-500">
              Date: {format(new Date(invoice.date), "MMMM dd, yyyy")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">FROM</h3>
          <p className="font-medium">
            {invoice.company?.name || "Akda Invoice System"}
          </p>
          <p className="text-sm text-gray-600">
            {invoice.company?.address || "123 Business Road, City"}
          </p>
          <p className="text-sm text-gray-600">
            Phone: {invoice.company?.phone || "+123-456-7890"}
          </p>
          <p className="text-sm text-gray-600">
            Email: {invoice.company?.email || "info@akdainvoice.com"}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">TO</h3>
          <p className="font-medium">{invoice.bepari.name}</p>
          <p className="text-sm text-gray-600">
            Address: {invoice.bepari.address}
          </p>
          <p className="text-sm text-gray-600">Phone: {invoice.bepari.phone}</p>
          <p className="text-sm text-gray-600">
            ID: {invoice.bepariId.substring(0, 12)}...
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border border-gray-200 rounded p-3">
          <p className="text-sm text-gray-500">Invoice Number</p>
          <p className="font-semibold">
            {invoice.invoiceNumber || invoice._id}
          </p>
        </div>
        <div className="border border-gray-200 rounded p-3">
          <p className="text-sm text-gray-500">Issue Date</p>
          <p className="font-semibold">
            {format(
              new Date(invoice.issueDate || invoice.date),
              "MMM dd, yyyy"
            )}
          </p>
        </div>
        <div className="border border-gray-200 rounded p-3">
          <p className="text-sm text-gray-500">Total Bakra</p>
          <p className="font-semibold">{invoice.totalBakra}</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-md font-semibold border-b border-gray-200 pb-2 mb-4">
          Kharcha Details
        </h3>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="pb-2">DESCRIPTION</th>
              <th className="pb-2 text-right">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(invoice.kharchaDetails).map(([key, value]) => (
              <tr key={key} className="border-b border-gray-100">
                <td className="py-2 capitalize">{key}</td>
                <td className="py-2 text-right">₹{value.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="pt-4">Total Kharcha</td>
              <td className="pt-4 text-right">
                ₹{invoice.totalKharcha.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Total Amount:</span>
          <span className="font-semibold">
            ₹{invoice.totalKharcha.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-medium">Paid Amount:</span>
          <span className="font-semibold text-green-600">
            ₹{invoice.paidAmount.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-medium">Balance:</span>
          <span className="font-semibold text-red-600">
            ₹{invoice.balance.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-6">
        <h4 className="font-semibold mb-2">NOTES</h4>
        <p>
          Thank you for your business. This invoice includes all expenses
          related to the bakra transaction.
        </p>
      </div>

      <div className="text-sm text-gray-600">
        <h4 className="font-semibold mb-2">TERMS & CONDITIONS</h4>
        <p>
          Payment is due within 15 days. Please make check payable to the
          company name or contact us for bank transfer details.
        </p>
      </div>
    </div>
  );
};

export default AkdaInvoicePreview;
