import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { adminService } from "../../services/api";
import { format } from "date-fns";
import { Search, Plus, Trash2 } from "lucide-react";

const BakraAdd = () => {
  const [beparis, setBeparis] = useState([]);
  const [dukaandars, setDukaandars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [success, setSuccess] = useState(null);
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      bepariId: "",
      totalBakra: 0,
      date: format(new Date(), "yyyy-MM-dd"),
      outFlowDetails: [
        { dukaandarId: "", quantity: 0, rate: 0, totalAmount: 0, notes: "" },
      ],
      paidAmount: 0,
      ratePerBakra: 0,
      finalAmount: 0,
    },
  });
  const formData = getValues();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "outFlowDetails",
  });

  const watchOutFlowDetails = watch("outFlowDetails");
  const watchTotalBakra = watch("totalBakra");

  useEffect(() => {
    fetchBeparis();
    fetchDukaandars();
  }, []);

  useEffect(() => {
    const totalBakra = watchOutFlowDetails.reduce(
      (sum, detail) => sum + Number(detail.quantity || 0),
      0
    );
    setValue("totalBakra", totalBakra);

    const totalAmount = watchOutFlowDetails.reduce(
      (sum, detail) =>
        sum + Number(detail.quantity || 0) * Number(detail.rate || 0),
      0
    );
    if (totalBakra > 0) {
      setValue("ratePerBakra", Math.round(totalAmount / totalBakra));
    }
    setValue("finalAmount", totalAmount);
    watchOutFlowDetails.forEach((detail, index) => {
      const totalAmount =
        Number(detail.quantity || 0) * Number(detail.rate || 0);
      setValue(`outFlowDetails.${index}.totalAmount`, totalAmount);
    });
  }, [watchOutFlowDetails, setValue]);

  const fetchBeparis = async () => {
    try {
      const response = await adminService.getBepari();
      setBeparis(response.message);
    } catch (err) {
      setError("Failed to fetch Beparis");
    }
  };

  const fetchDukaandars = async () => {
    try {
      const response = await adminService.getDukaandar();
      setDukaandars(response.message);
    } catch (err) {
      setError("Failed to fetch Dukaandars");
    }
  };

  const onSubmit = async (data) => {
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmation(false);
    setLoading(true);
    try {
      const response = await adminService.addKhata(formData);
      // Handle success (e.g., show success message, redirect)
      console.log(response);
      if (response.statusCode === 201) {
        setSuccess("Bakra successfully added");
        reset({
          bepariId: "",
          totalBakra: 0,
          date: format(new Date(), "yyyy-MM-dd"),
          outFlowDetails: [
            {
              dukaandarId: "",
              quantity: 0,
              rate: 0,
              totalAmount: 0,
              notes: "",
            },
          ],
          paidAmount: 0,
          ratePerBakra: 0,
          finalAmount: 0,
        });
      }
      // {console.log(formData)}

      setLoading(false);
    } catch (err) {
      setError("Failed to add Bakra");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#F9FAFB] min-h-screen">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#1E3A8A]">
          <p className="text-sm text-gray-600 mb-1">Total Bakra</p>
          <p className="text-2xl font-bold text-[#1E3A8A]">
            {watchTotalBakra || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#16A34A]">
          <p className="text-sm text-gray-600 mb-1">Rate Per Bakra</p>
          <p className="text-2xl font-bold text-[#16A34A]">
            {watch("ratePerBakra") || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-[#2563EB]">
          <p className="text-sm text-gray-600 mb-1">Final Amount</p>
          <p className="text-2xl font-bold text-[#2563EB]">
            {watch("finalAmount") || 0}
          </p>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1E3A8A] font-inter">
            Add Bakra Entry
          </h1>
          {success && (
            <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              ✓ {success}
            </span>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="bepariId"
                className="block text-sm font-medium text-[#111827] font-roboto"
              >
                Bepari Name
              </label>
              <Controller
                name="bepariId"
                control={control}
                rules={{ required: "Bepari selection is required" }}
                render={({ field }) => (
                  <div className="relative">
                    <select
                      {...field}
                      className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all duration-200 font-roboto appearance-none bg-white"
                    >
                      <option value="">Select a Bepari</option>
                      {beparis.map((bepari) => (
                        <option key={bepari._id} value={bepari._id}>
                          {bepari.name}
                        </option>
                      ))}
                    </select>
                    <Search
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                      size={18}
                    />
                  </div>
                )}
              />
              {errors.bepariId && (
                <p className="text-sm text-red-600">
                  {errors.bepariId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="date"
                className="block text-sm font-medium text-[#111827] font-roboto"
              >
                Date
              </label>
              <input
                type="date"
                {...register("date", { required: "Date is required" })}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-200 font-roboto bg-white"
              />
              {errors.date && (
                <p className="text-sm text-red-600">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Outflow Details Section */}
          <div className="bg-gray-50 p-6 rounded-lg border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#1E3A8A] font-inter">
                Outflow Details
              </h2>
            </div>

            {/* Outflow Items */}
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="mb-6 p-5 bg-white rounded-lg border border-[#E5E7EB] hover:border-[#1E3A8A] transition-all duration-200 relative"
              >
                {/* Dukaandar and Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#111827] font-roboto">
                      Dukaandar
                    </label>
                    <Controller
                      name={`outFlowDetails.${index}.dukaandarId`}
                      control={control}
                      rules={{ required: "Dukaandar is required" }}
                      render={({ field }) => (
                        <div className="relative">
                          <select
                            {...field}
                            className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-200 font-roboto appearance-none bg-white"
                          >
                            <option value="">Select Dukaandar</option>
                            {dukaandars.map((dukaandar) => (
                              <option key={dukaandar._id} value={dukaandar._id}>
                                {dukaandar.name}
                              </option>
                            ))}
                          </select>
                          <Search
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]"
                            size={18}
                          />
                        </div>
                      )}
                    />
                    {errors.outFlowDetails?.[index]?.dukaandarId && (
                      <p className="text-sm text-red-600">
                        {errors.outFlowDetails[index].dukaandarId.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#111827] font-roboto">
                      Quantity
                    </label>
                    <input
                      type="number"
                      {...register(`outFlowDetails.${index}.quantity`, {
                        required: "Quantity is required",
                        min: 1,
                        onChange: (e) => {
                          const value = e.target.value;
                          const rate =
                            watch(`outFlowDetails.${index}.rate`) || 0;
                          setValue(
                            `outFlowDetails.${index}.totalAmount`,
                            value * rate
                          );
                        },
                      })}
                      className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-200 font-roboto bg-white"
                    />
                    {errors.outFlowDetails?.[index]?.quantity && (
                      <p className="text-sm text-red-600">
                        {errors.outFlowDetails[index].quantity.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rate and Total Amount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#111827] font-roboto">
                      Rate
                    </label>
                    <input
                      type="number"
                      {...register(`outFlowDetails.${index}.rate`, {
                        required: "Rate is required",
                        min: 1,
                        onChange: (e) => {
                          const value = e.target.value;
                          const quantity =
                            watch(`outFlowDetails.${index}.quantity`) || 0;
                          setValue(
                            `outFlowDetails.${index}.totalAmount`,
                            value * quantity
                          );
                        },
                      })}
                      className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-200 font-roboto bg-white"
                    />
                    {errors.outFlowDetails?.[index]?.rate && (
                      <p className="text-sm text-red-600">
                        {errors.outFlowDetails[index].rate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#111827] font-roboto">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      value={
                        watch(`outFlowDetails.${index}.quantity`) *
                          watch(`outFlowDetails.${index}.rate`) || 0
                      }
                      readOnly
                      className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg bg-gray-50 font-mono text-lg text-gray-700"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#111827] font-roboto">
                    Notes
                  </label>
                  <input
                    type="text"
                    {...register(`outFlowDetails.${index}.notes`)}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-200 font-roboto bg-white"
                    placeholder="Add any additional notes..."
                  />
                </div>

                {/* Remove Button */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="absolute top-4 right-4 p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-all duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}

            {/* Add Dukaandar Button - Now at the bottom */}
            <button
              type="button"
              onClick={() =>
                append({
                  dukaandarId: "",
                  quantity: 0,
                  rate: 0,
                  totalAmount: 0,
                  notes: "",
                })
              }
              className="w-full mt-4 inline-flex items-center justify-center px-4 py-3 text-sm bg-[#1E3A8A] text-white rounded-lg hover:bg-[#2563EB] transition-all duration-200 shadow-sm"
            >
              <Plus size={16} className="mr-2" /> Add Dukaandar
            </button>
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111827] font-roboto">
                Total Bakra
              </label>
              <input
                type="number"
                {...register("totalBakra")}
                readOnly
                className="w-full px-4 py-2.5 bg-gray-50 border border-[#E5E7EB] rounded-lg font-mono text-lg text-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111827] font-roboto">
                Rate Per Bakra
              </label>
              <input
                type="number"
                {...register("ratePerBakra")}
                readOnly
                className="w-full px-4 py-2.5 bg-gray-50 border border-[#E5E7EB] rounded-lg font-mono text-lg text-gray-700"
              />
            </div>
          </div>

          {/* Paid Amount and Final Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111827] font-roboto">
                Paid Amount
              </label>
              <input
                type="number"
                {...register("paidAmount", {
                  required: "Paid Amount is required",
                  min: 0,
                })}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-200 font-mono text-lg"
              />
              {errors.paidAmount && (
                <p className="text-sm text-red-600">
                  {errors.paidAmount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#111827] font-roboto">
                Final Amount
              </label>
              <input
                type="number"
                {...register("finalAmount")}
                readOnly
                className="w-full px-4 py-2.5 bg-green-50 border border-green-200 rounded-lg font-mono text-2xl font-bold text-green-700"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1E3A8A] text-white py-3 px-6 rounded-lg hover:bg-[#2563EB] transition-all duration-300 font-semibold text-lg shadow-sm hover:shadow-md flex items-center justify-center gap-2 mt-8"
          >
            <span>Submit Entry</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full transform transition-all">
            <h2 className="text-xl font-semibold text-[#1E3A8A] mb-4 font-inter">
              Confirm Submission
            </h2>
            <p className="mb-6 text-gray-600">
              Please review all details before submitting. This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-6 py-2.5 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#2563EB] transition-colors duration-200 font-medium shadow-sm hover:shadow"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BakraAdd;
