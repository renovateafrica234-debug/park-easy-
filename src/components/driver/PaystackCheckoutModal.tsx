import React, { useState } from 'react';
import { ParkingLot, Bay, Booking } from '../../types';
import { parkingStore } from '../../services/parkingStore';
import { PLATFORM_COMMISSION_RATE } from '../../data/mockData';
import { X, Shield, CreditCard, Clock, Car, Check, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaystackCheckoutModalProps {
  lot: ParkingLot;
  selectedBayId?: string;
  bays: Bay[];
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

export const PaystackCheckoutModal: React.FC<PaystackCheckoutModalProps> = ({
  lot,
  selectedBayId,
  bays,
  onClose,
  onSuccess,
}) => {
  const currentUser = parkingStore.getCurrentUser();
  const [step, setStep] = useState<'details' | 'paystack_dialog' | 'otp_verify' | 'processing'>('details');

  // Form State
  const [vehiclePlate, setVehiclePlate] = useState('ABJ-');
  const [driverName, setDriverName] = useState(currentUser.full_name || 'Driver');
  const [driverPhone, setDriverPhone] = useState(currentUser.phone || '+234 803 000 0000');
  const [durationHours, setDurationHours] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'ussd'>('card');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Paystack Card inputs (prefilled with Paystack test card)
  const [cardNumber, setCardNumber] = useState('4084 0840 8408 4081');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('408');
  const [otpCode, setOtpCode] = useState('123456');

  // Calculations
  const totalParkingFee = lot.price_per_hour * durationHours;
  const platformFee = Math.round(totalParkingFee * PLATFORM_COMMISSION_RATE);

  const availableBay = selectedBayId
    ? bays.find((b) => b.id === selectedBayId)
    : bays.find((b) => b.lot_id === lot.id && b.status === 'open');

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehiclePlate || vehiclePlate.trim().length < 5) {
      setErrorMsg('Please enter a valid vehicle plate number (e.g. ABJ-482-XY)');
      return;
    }
    setErrorMsg(null);
    setStep('paystack_dialog');
  };

  const handlePaystackPay = () => {
    setStep('otp_verify');
  };

  const handleVerifyOtp = () => {
    setStep('processing');
    setTimeout(() => {
      try {
        const paystackRef = `PSTK_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        const newBooking = parkingStore.createBooking({
          lotId: lot.id,
          bayId: availableBay?.id,
          driverName,
          driverPhone,
          vehiclePlate,
          durationHours,
          paymentMethod,
          paystackRef,
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#004D40', '#D4E157', '#F5F1E8'],
        });

        onSuccess(newBooking);
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Reservation failed');
        setStep('details');
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#004D40]/10 overflow-hidden my-6">
        {/* Test Mode Badge Header */}
        <div className="bg-[#004D40] text-[#F5F1E8] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#D4E157] text-[#004D40] text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              Test Mode
            </span>
            <span className="text-sm font-bold font-editorial">ParkEasy Abuja Checkout</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#F5F1E8]/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Details & Duration */}
        {step === 'details' && (
          <form onSubmit={handleProceedToPayment} className="p-6 space-y-5">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-[#004D40]">
                Reserve Bay at {lot.name}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {lot.address} • Assigned Bay:{' '}
                <strong className="text-[#004D40]">
                  {availableBay ? availableBay.label : 'Next Available'}
                </strong>
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Vehicle Plate Input */}
            <div>
              <label className="block text-xs font-bold text-[#004D40] uppercase tracking-wider mb-1.5">
                Vehicle Plate Number
              </label>
              <div className="relative">
                <Car className="absolute left-3.5 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. ABJ-772-KJ"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F5F1E8] border border-gray-200 rounded-xl text-sm font-bold tracking-wider uppercase text-[#004D40] focus:outline-none focus:ring-2 focus:ring-[#004D40]"
                />
              </div>
              <div className="flex gap-2 mt-1.5">
                {['ABJ-819-XY', 'RSH-421-KD', 'KJA-552-AB'].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setVehiclePlate(sample)}
                    className="text-[11px] text-[#004D40] bg-[#F5F1E8] hover:bg-[#D4E157]/30 px-2 py-0.5 rounded font-medium border border-gray-200"
                  >
                    + {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Driver Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#004D40] uppercase tracking-wider mb-1.5">
                  Driver Name
                </label>
                <input
                  type="text"
                  required
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F1E8] border border-gray-200 rounded-xl text-sm text-[#004D40] focus:outline-none focus:ring-2 focus:ring-[#004D40]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#004D40] uppercase tracking-wider mb-1.5">
                  Phone (WhatsApp / SMS)
                </label>
                <input
                  type="tel"
                  required
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F1E8] border border-gray-200 rounded-xl text-sm text-[#004D40] focus:outline-none focus:ring-2 focus:ring-[#004D40]"
                />
              </div>
            </div>

            {/* Duration Picker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#004D40] uppercase tracking-wider">
                  Parking Duration
                </label>
                <span className="text-xs text-gray-500 font-medium">₦{lot.price_per_hour}/hr</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { hours: 1, label: '1 Hour' },
                  { hours: 2, label: '2 Hours' },
                  { hours: 4, label: '4 Hours' },
                  { hours: 8, label: 'Full Day' },
                ].map((item) => (
                  <button
                    key={item.hours}
                    type="button"
                    onClick={() => setDurationHours(item.hours)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                      durationHours === item.hours
                        ? 'bg-[#004D40] text-[#D4E157] border-[#004D40] shadow-sm'
                        : 'bg-[#F5F1E8] text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-[#F5F1E8] p-4 rounded-2xl border border-[#004D40]/10 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Parking Fee ({durationHours} hrs × ₦{lot.price_per_hour})</span>
                <span className="font-semibold text-gray-800">₦{totalParkingFee}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-[11px]">
                <span>Platform Commission (12% included)</span>
                <span className="text-emerald-700 font-medium">₦{platformFee}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline font-bold text-sm text-[#004D40]">
                <span className="font-editorial text-base">Total Due</span>
                <span className="font-editorial text-xl text-[#004D40]">₦{totalParkingFee}</span>
              </div>
            </div>

            <button
              id="continue-to-paystack-btn"
              type="submit"
              className="w-full py-3.5 bg-[#D4E157] hover:bg-[#c6d445] text-[#004D40] rounded-2xl font-black text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay ₦{totalParkingFee} with Paystack</span>
            </button>
          </form>
        )}

        {/* STEP 2: Paystack Checkout Dialog (Simulated Paystack Inline) */}
        {step === 'paystack_dialog' && (
          <div className="p-6 space-y-5 bg-[#FAFAFA]">
            {/* Paystack Official-Style Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <button
                onClick={() => setStep('details')}
                className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0BA4DB]">paystack</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  SECURE
                </span>
              </div>
            </div>

            {/* Merchant Details */}
            <div className="text-center py-1">
              <span className="text-xs text-gray-400">Paying ParkEasy Abuja</span>
              <div className="text-3xl font-black font-editorial text-[#004D40] mt-1">
                ₦{totalParkingFee}.00
              </div>
              <span className="text-[11px] text-gray-500">{driverPhone}</span>
            </div>

            {/* Payment Options */}
            <div className="flex rounded-xl bg-gray-200 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  paymentMethod === 'card' ? 'bg-white text-[#004D40] shadow-xs' : 'text-gray-600'
                }`}
              >
                Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  paymentMethod === 'bank_transfer' ? 'bg-white text-[#004D40] shadow-xs' : 'text-gray-600'
                }`}
              >
                Bank Transfer
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('ussd')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  paymentMethod === 'ussd' ? 'bg-white text-[#004D40] shadow-xs' : 'text-gray-600'
                }`}
              >
                USSD
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Card Number (Paystack Test Card)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-800"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                      Expiry
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-mono font-bold text-gray-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <div className="text-gray-600">Simulated Virtual Account:</div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="text-xs text-emerald-800 font-semibold">Wema Bank / Paystack Checkout</div>
                  <div className="text-base font-mono font-bold text-emerald-950 mt-1">998 102 3918</div>
                  <div className="text-[10px] text-emerald-700 mt-0.5">Expires in 30 minutes</div>
                </div>
              </div>
            )}

            {paymentMethod === 'ussd' && (
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
                <div className="text-gray-600">Dial on your registered phone:</div>
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 font-mono font-bold text-sm text-blue-950 text-center">
                  *737*000*8192#
                </div>
              </div>
            )}

            <button
              id="authorize-paystack-btn"
              type="button"
              onClick={handlePaystackPay}
              className="w-full py-3.5 bg-[#004D40] hover:bg-[#00382E] text-[#D4E157] rounded-2xl font-black text-sm shadow-md transition active:scale-98 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Authorize ₦{totalParkingFee}</span>
            </button>
          </div>
        )}

        {/* STEP 3: OTP 3D-Secure Verification */}
        {step === 'otp_verify' && (
          <div className="p-6 space-y-5 bg-white text-center">
            <div className="w-12 h-12 rounded-full bg-[#004D40]/10 text-[#004D40] flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-[#004D40]">
                Enter Paystack 3D-Secure OTP
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                A verification code was simulated for your card. Enter test OTP below.
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full py-3 text-center tracking-widest font-mono text-2xl font-black bg-[#F5F1E8] border border-gray-300 rounded-2xl text-[#004D40] focus:ring-2 focus:ring-[#004D40]"
              />
              <span className="text-[11px] text-gray-400 mt-1 block">Test OTP is 123456</span>
            </div>

            <button
              id="verify-otp-btn"
              type="button"
              onClick={handleVerifyOtp}
              className="w-full py-3.5 bg-[#D4E157] hover:bg-[#c6d445] text-[#004D40] rounded-2xl font-black text-sm shadow-md transition active:scale-98"
            >
              Confirm & Complete Reservation
            </button>
          </div>
        )}

        {/* STEP 4: Processing Animation */}
        {step === 'processing' && (
          <div className="p-10 text-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#004D40] animate-spin mx-auto" />
            <h3 className="font-editorial text-xl font-bold text-[#004D40]">
              Verifying Payment with Paystack...
            </h3>
            <p className="text-xs text-gray-500">
              Allocating parking space and generating your digital access QR pass.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
