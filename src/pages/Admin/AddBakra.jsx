import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { adminService } from '../../services/api';
import { format } from 'date-fns';
import { Search, Plus, Trash2 } from 'lucide-react';

const BakraAdd = () => {
  const [beparis, setBeparis] = useState([]);
  const [dukaandars, setDukaandars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
    const [success, setSuccess] = useState(null);
  const { register, control, handleSubmit, watch, setValue, formState: { errors } ,getValues,reset} = useForm({
    defaultValues: {
      bepariId: '',
      totalBakra: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      outFlowDetails: [{ dukaandarId: '', quantity: 0, rate: 0, totalAmount: 0, notes: '' }],
      paidAmount: 0,
      ratePerBakra: 0,
      finalAmount: 0
    }
  });
  const formData = getValues();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "outFlowDetails"
  });

  const watchOutFlowDetails = watch("outFlowDetails");
  const watchTotalBakra = watch("totalBakra");

  useEffect(() => {
    fetchBeparis();
    fetchDukaandars();
  }, []);

  useEffect(() => {
    const totalBakra = watchOutFlowDetails.reduce(
      (sum, detail) => sum + Number(detail.quantity),
      0
    );
    setValue("totalBakra", totalBakra);

    const totalAmount = watchOutFlowDetails.reduce(
      (sum, detail) => sum + Number(detail.quantity) * Number(detail.rate),
      0
    );
    if (totalBakra > 0) {
      setValue("ratePerBakra", Math.round(totalAmount / totalBakra));
    }
    setValue("finalAmount", totalAmount);
    watchOutFlowDetails.forEach((detail, index) => {
      const totalAmount = Number(detail.quantity) * Number(detail.rate);
      setValue(`outFlowDetails.${index}.totalAmount`, totalAmount);
    });
  }, [watchOutFlowDetails, setValue]);

  const fetchBeparis = async () => {
    try {
      const response = await adminService.getBepari();
      setBeparis(response.message);
    } catch (err) {
      setError('Failed to fetch Beparis');
    }
  };

  const fetchDukaandars = async () => {
    try {
      const response = await adminService.getDukaandar();
      setDukaandars(response.message);
    } catch (err) {
      setError('Failed to fetch Dukaandars');
    }
  };

  const onSubmit = async (data) => {
    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmation(false);
    setLoading(true);
    try {
      const response=await adminService.addKhata(formData)
      // Handle success (e.g., show success message, redirect)
      console.log(response)
      if(response.statusCode===201){
        setSuccess('Bakra successfully added');
        reset({
            bepariId: '',
            totalBakra: 0,
            date: format(new Date(), 'yyyy-MM-dd'),
            outFlowDetails: [{ dukaandarId: '', quantity: 0, rate: 0, totalAmount: 0, notes: '' }],
            paidAmount: 0,
            ratePerBakra: 0,
            finalAmount: 0
        })
        }
    // {console.log(formData)}
    
      setLoading(false);
    } catch (err) {
      setError('Failed to add Bakra');
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-[#F9FAFB]">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#1E3A8A] mb-6 font-inter">Add Bakra</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {success && <div className="text-green-500 text-center mb-4">{success}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bepariId" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
              Bepari
            </label>
            <Controller
              name="bepariId"
              control={control}
              rules={{ required: "Bepari is required" }}
              render={({ field }) => (
                <div className="relative">
                  <select
                    {...field}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                  >
                    <option value="">Select Bepari</option>
                    {beparis.map((bepari) => (
                      <option key={bepari._id} value={bepari._id}>{bepari.name}</option>
                    ))}
                  </select>
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={20} />
                </div>
              )}
            />
            {errors.bepariId && <p className="mt-1 text-sm text-red-600">{errors.bepariId.message}</p>}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
              Date
            </label>
            <input
              type="date"
              {...register("date", { required: "Date is required" })}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#1E3A8A] mb-4 font-inter">Outflow Details</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4 p-4 border border-[#E5E7EB] rounded-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`outFlowDetails.${index}.dukaandarId`} className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
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
                          className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                        >
                          <option value="">Select Dukaandar</option>
                          {dukaandars.map((dukaandar) => (
                            <option key={dukaandar._id} value={dukaandar._id}>{dukaandar.name}</option>
                          ))}
                        </select>
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" size={20} />
                      </div>
                    )}
                  />
                  {errors.outFlowDetails?.[index]?.dukaandarId && <p className="mt-1 text-sm text-red-600">{errors.outFlowDetails[index].dukaandarId.message}</p>}
                </div>

                <div>
                  <label htmlFor={`outFlowDetails.${index}.quantity`} className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                    Quantity
                  </label>
                  <input
                    type="number"
                    {...register(`outFlowDetails.${index}.quantity`, { required: "Quantity is required", min: 1 })}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                  />
                  {errors.outFlowDetails?.[index]?.quantity && <p className="mt-1 text-sm text-red-600">{errors.outFlowDetails[index].quantity.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor={`outFlowDetails.${index}.rate`} className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                    Rate
                  </label>
                  <input
                    type="number"
                    {...register(`outFlowDetails.${index}.rate`, { required: "Rate is required", min: 1 })}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                  />
                  {errors.outFlowDetails?.[index]?.rate && <p className="mt-1 text-sm text-red-600">{errors.outFlowDetails[index].rate.message}</p>}
                </div>

                <div>
                  <label htmlFor={`outFlowDetails.${index}.totalAmount`} className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                    Total Amount
                  </label>
                  <input
                    type="number"
                    value={watch(`outFlowDetails.${index}.quantity`) * watch(`outFlowDetails.${index}.rate`) || 0}
                    readOnly
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                  />
                  {/* {errors.outFlowDetails?.[index]?.totalAmount && <p className="mt-1 text-sm text-red-600">{errors.outFlowDetails[index].totalAmount.message}</p>} */}
                </div>
              </div>

              <div>
                <label htmlFor={`outFlowDetails.${index}.notes`} className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
                  Notes
                </label>
                <input
                  type="text"
                  {...register(`outFlowDetails.${index}.notes`)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
                />
              </div>

              {index > 0 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ dukaandarId: '', quantity: 0, rate: 0, totalAmount: 0, notes: '' })}
            className="mt-2 flex items-center text-[#1E3A8A] hover:text-[#2563EB] transition-colors duration-200"
          >
            <Plus size={20} className="mr-1" /> Add Another Dukaandar
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="totalBakra" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
              Total Bakra
            </label>
            <input
              type="number"
              {...register("totalBakra", { required: "Total Bakra is required", min: 1 })}
              readOnly
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md bg-gray-100 font-roboto"
            />
          </div>

          <div>
            <label htmlFor="paidAmount" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
              Paid Amount
            </label>
            <input
              type="number"
              {...register("paidAmount", { required: "Paid Amount is required", min: 0 })}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] transition-all duration-300 font-roboto"
            />
            {errors.paidAmount && <p className="mt-1 text-sm text-red-600">{errors.paidAmount.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="ratePerBakra" className="block text-sm font-medium text-[#111827] mb-1 font-roboto">
            Rate Per Bakra
          </label>
          <input
            type="number"
            {...register("ratePerBakra", { required: "Rate Per Bakra is required", min: 1 })}
            readOnly
            className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md bg-gray-100 font-roboto"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="finalAmount"
            className="block text-xl font-semibold text-[#1E3A8A] mb-2 font-inter"
          >
            Final Amount
          </label>
          <input
            type="number"
            {...register("finalAmount")}
            readOnly
            className="w-full px-4 py-3 text-2xl font-bold text-[#16A34A] border border-[#E5E7EB] rounded-md bg-gray-100 font-inter"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#1E3A8A] text-white py-2 px-4 rounded-md hover:bg-[#2563EB] transition-colors duration-300 font-inter font-semibold"
        >
          Submit
        </button>
      </form>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-[#1E3A8A] mb-4 font-inter">Confirm Submission</h2>
            <p className="mb-4 text-[#111827] font-roboto">Are you sure you want to submit this Bakra entry?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-[#E5E7EB] text-[#111827] rounded-md hover:bg-[#D1D5DB] transition-colors duration-300 font-inter"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 bg-[#1E3A8A] text-white rounded-md hover:bg-[#2563EB] transition-colors duration-300 font-inter"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BakraAdd;

