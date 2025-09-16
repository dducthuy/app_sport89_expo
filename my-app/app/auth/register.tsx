import { IconSymbol } from "@/components/ui/IconSymbol";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import "../../global.css";

const steps = ["Thông tin", "Email", "Mật khẩu", "Xác nhận"];

type StepType = 1 | 2 | 3 | 4;

export default function Register() {
  const [step, setStep] = useState<StepType>(1);
  const [success, setSuccess] = useState(false);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [gender, setGender] = useState<string>("Nam");
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^0\d{9,10}$/.test(phone);
  };

  const validateBirthday = (date: string): boolean => {
    return /^\d{4}-\d{2}-\d{2}$/.test(date);
  };

  // Form errors
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (step >= 1) {
      if (!fullName.trim()) e.fullName = "Họ và tên không được để trống";
      if (!phone.trim()) e.phone = "Số điện thoại không được để trống";
      else if (!validatePhone(phone)) e.phone = "Số điện thoại không hợp lệ";
      if (birthday && !validateBirthday(birthday)) e.birthday = "Ngày sinh không hợp lệ";
      if (!acceptTerms) e.acceptTerms = "Bạn cần đồng ý với điều khoản và điều kiện";
    }
    if (step >= 2) {
      if (!email.trim()) e.email = "Email không được để trống";
      else if (!validateEmail(email)) e.email = "Email không đúng định dạng";
    }
    if (step >= 3) {
      if (!password.trim()) e.password = "Mật khẩu không được để trống";
      else if (password.length < 6) e.password = "Mật khẩu phải có ít nhất 6 ký tự";
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
        e.password = "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số";
      if (!confirmPassword.trim()) e.confirmPassword = "Xác nhận mật khẩu không được để trống";
      else if (password !== confirmPassword) e.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    return e;
  }, [step, fullName, email, password, confirmPassword, phone, birthday, acceptTerms]);

  // Step validation
  const isStepValid = useMemo(() => {
    if (step === 1) return fullName.trim() && phone.trim() && validatePhone(phone) && (!birthday || validateBirthday(birthday)) && acceptTerms;
    if (step === 2) return email.trim() && validateEmail(email);
    if (step === 3) return password.trim() && password.length >= 6 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password) && confirmPassword === password;
    return true;
  }, [step, fullName, email, password, confirmPassword, phone, birthday, acceptTerms]);

  // Handle registration
  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://172.20.10.6:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ho_ten: fullName,
          email,
          mat_khau: password,
          so_dien_thoai: phone,
          dia_chi: address,
          ngay_sinh: birthday,
          gioi_tinh: gender,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Lỗi", data.message || "Đăng ký thất bại");
        return;
      }
      setSuccess(true);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể kết nối tới server");
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const goNext = () => {
    if (step === 1) setTouched((t) => ({ ...t, fullName: true, phone: true, birthday: true, acceptTerms: true }));
    if (step === 2) setTouched((t) => ({ ...t, email: true }));
    if (step === 3) setTouched((t) => ({ ...t, password: true, confirmPassword: true }));
    if (isStepValid && step < 4) setStep((s) => (s + 1) as StepType);
    else if (step === 4) handleRegister();
  };

  const goBack = () => setStep((s) => (s > 1 ? (s - 1) as StepType : s));

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 px-6">
        <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
          <IconSymbol name="person.badge.plus" size={40} color="#8B5CF6" />
        </View>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </SafeAreaView>
    );
  }

  if (success) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
          <IconSymbol name="person.badge.plus" size={40} color="#8B5CF6" />
        </View>
        <View className="flex-col p-4 bg-white rounded-xl w-full">
          <View className="flex-row items-start">
            <IconSymbol name="checkmark.circle" size={24} color="#4CAF50"  />
            <Text className="ml-2 text-gray-800 text-lg font-semibold flex-shrink">
              Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.
            </Text>
          </View>
          <TouchableOpacity
            className="bg-purple-600 py-3 rounded-xl shadow-md my-4"
            onPress={() => {
              setSuccess(false);
              setStep(1);
              setFullName("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              setPhone("");
              setAddress("");
              setBirthday("");
              setGender("Nam");
              setAcceptTerms(false);
              setTouched({});
              router.push("/auth/login");
            }}
          >
            <Text className="text-white text-center font-semibold text-base">Đăng nhập ngay</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "#f9fafb" }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 40 }}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="flex-1 px-6 py-10">
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
                <IconSymbol name="person.badge.plus" size={40} color="#8B5CF6" />
              </View>
              <Text className="text-2xl font-bold text-gray-900">Tạo tài khoản</Text>
              <Text className="text-gray-600 text-center">Đăng ký để bắt đầu mua sắm cùng chúng tôi</Text>
            </View>

            <Stepper step={step} />

            <View className="w-full bg-white rounded-2xl p-6 shadow-lg">
              {step === 1 && (
                <View className="gap-3">
                  <Input
                    label="Họ và tên"
                    value={fullName}
                    onChangeText={(v: string) => {
                      setFullName(v);
                      setTouched((t) => ({ ...t, fullName: true }));
                    }}
                    placeholder="Nhập họ và tên"
                    error={touched.fullName && errors.fullName}
                    autoCapitalize="words"
                    textContentType="name"
                  />
                  <Input
                    label="Số điện thoại"
                    value={phone}
                    onChangeText={(v: string) => {
                      setPhone(v);
                      setTouched((t) => ({ ...t, phone: true }));
                    }}
                    placeholder="Nhập số điện thoại"
                    error={touched.phone && errors.phone}
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                  />
                  <Input
                    label="Địa chỉ"
                    value={address}
                    onChangeText={(v: string) => {
                      setAddress(v);
                      setTouched((t) => ({ ...t, address: true }));
                    }}
                    placeholder="Nhập địa chỉ"
                    error={touched.address && errors.address}
                    textContentType="fullStreetAddress"
                  />
                  <Input
                    label="Ngày sinh (YYYY-MM-DD)"
                    value={birthday}
                    onChangeText={(v: string) => {
                      setBirthday(v);
                      setTouched((t) => ({ ...t, birthday: true }));
                    }}
                    placeholder="2000-05-20"
                    error={touched.birthday && errors.birthday}
                    textContentType="none"
                  />
                  <View className="mb-4">
                    <Text className="text-gray-700 font-medium mb-2">Giới tính</Text>
                    <View className="flex-row">
                      {["Nam", "Nữ", "Khác"].map((option) => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => setGender(option)}
                          className={`px-4 py-2 rounded-xl mr-3 ${gender === option ? "bg-purple-600" : "bg-gray-200"}`}
                        >
                          <Text className={gender === option ? "text-white" : "text-gray-700"}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                  <View className="flex-row items-start">
                    <TouchableOpacity
                      onPress={() => {
                        setAcceptTerms(!acceptTerms);
                        setTouched((t) => ({ ...t, acceptTerms: true }));
                      }}
                      className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center mt-0.5 ${
                        acceptTerms ? "bg-purple-600 border-purple-600" : "border-gray-300"
                      }`}
                    >
                      {acceptTerms && <IconSymbol name="checkmark" size={12} color="white" />}
                    </TouchableOpacity>
                    <Text className="flex-1 text-gray-600 text-sm leading-5">
                      Tôi đồng ý với <Text className="text-purple-600 font-medium">Điều khoản sử dụng</Text> và{" "}
                      <Text className="text-purple-600 font-medium">Chính sách bảo mật</Text>
                    </Text>
                  </View>
                  {touched.acceptTerms && errors.acceptTerms && (
                    <Text className="text-red-500 text-sm mt-1">{errors.acceptTerms}</Text>
                  )}
                </View>
              )}
              {step === 2 && (
                <Input
                  label="Email"
                  value={email}
                  onChangeText={(v: string) => {
                    setEmail(v);
                    setTouched((t) => ({ ...t, email: true }));
                  }}
                  placeholder="Nhập email"
                  error={touched.email && errors.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                />
              )}
              {step === 3 && (
                <View className="gap-3">
                  <Input
                    label="Mật khẩu"
                    value={password}
                    onChangeText={(v: string) => {
                      setPassword(v);
                      setTouched((t) => ({ ...t, password: true }));
                    }}
                    placeholder="Nhập mật khẩu"
                    error={touched.password && errors.password}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    textContentType="password"
                    showToggle
                    toggleShow={() => setShowPassword(!showPassword)}
                    isToggled={showPassword}
                  />
                  <Input
                    label="Xác nhận mật khẩu"
                    value={confirmPassword}
                    onChangeText={(v: string) => {
                      setConfirmPassword(v);
                      setTouched((t) => ({ ...t, confirmPassword: true }));
                    }}
                    placeholder="Nhập lại mật khẩu"
                    error={touched.confirmPassword && errors.confirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    textContentType="password"
                    showToggle
                    toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                    isToggled={showConfirmPassword}
                  />
                </View>
              )}
              {step === 4 && (
                <View className="gap-4">
                  <Text className="text-base font-semibold text-gray-800">Xác nhận thông tin</Text>
                  <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <Row label="Họ và tên" value={fullName} />
                    <Row label="Số điện thoại" value={phone} />
                    <Row label="Địa chỉ" value={address || "-"} />
                    <Row label="Ngày sinh" value={birthday || "-"} />
                    <Row label="Giới tính" value={gender} />
                    <Row label="Email" value={email} />
                  </View>
                  <Text className="text-gray-500 text-xs">* Mật khẩu được ẩn vì lý do bảo mật</Text>
                </View>
              )}
            </View>

            <View className="mt-4 flex-row gap-3">
              {step > 1 && (
                <Button gray onPress={goBack} disabled={isLoading} label="Quay lại" />
              )}
              <Button
                purple
                disabled={!isStepValid || isLoading}
                onPress={goNext}
                loading={isLoading && step === 4}
                label={step < 4 ? "Tiếp tục" : "Đăng ký"}
              />
            </View>

            <View className="mt-8 flex-row justify-center">
              <Text className="text-gray-600">Đã có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")} disabled={isLoading}>
                <Text className="text-purple-600 font-semibold">Đăng nhập ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

function Stepper({ step }: { step: StepType }) {
  return (
    <View className="w-full mb-4">
      <View className="flex-row justify-between items-center">
        {steps.map((_, idx) => {
          const index = (idx + 1) as StepType;
          const active = step === index;
          const done = step > index;
          return (
            <React.Fragment key={index}>
              <View
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  done ? "bg-green-500" : active ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                {done ? (
                  <IconSymbol name="checkmark" size={18} color="#fff" />
                ) : (
                  <Text className="text-white text-sm">{index}</Text>
                )}
              </View>
              {index !== 4 && <View className="flex-1 h-0.5 bg-gray-300 mx-2" />}
            </React.Fragment>
          );
        })}
      </View>
      <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
        <View style={{ width: `${((step - 1) / 3) * 100}%` }} className="h-2 bg-purple-600" />
      </View>
    </View>
  );
}

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  showToggle,
  toggleShow,
  isToggled,
  ...props
}: any) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <View
        className={`flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border ${
          error ? "border-red-500" : "border-transparent"
        }`}
      >
        <TextInput
          className="flex-1 text-base text-gray-900"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        {showToggle && (
          <TouchableOpacity onPress={toggleShow}>
            <IconSymbol name={isToggled ? "eye.slash" : "eye"} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
      <Text className="text-gray-500">{label}</Text>
      <Text className="text-gray-800 font-medium">{value || "-"}</Text>
    </View>
  );
}

function Button({ purple, gray, label, onPress, disabled, loading }: any) {
  return (
    <TouchableOpacity
      className={`flex-1 py-3 rounded-xl ${purple ? (disabled ? "bg-purple-300" : "bg-purple-600") : "bg-gray-200"}`}
      onPress={onPress}
      disabled={disabled}
    >
      <View className="flex-row justify-center items-center">
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className={`text-center font-semibold ${purple ? "text-white" : "text-gray-800"}`}>{label}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}