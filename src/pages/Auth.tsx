import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("يرجى إدخال البريد وكلمة المرور");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("فشل تسجيل الدخول");
    } else {
      toast.success("تم تسجيل الدخول بنجاح");
      navigate("/dashboard");
    }
  };

  const handleSignup = async () => {
    if (!email || !password) {
      toast.error("يرجى إدخال البريد وكلمة المرور");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        full_name: "",
        phone: "",
        role: "user",
      });
    }

    toast.success("تم إنشاء الحساب بنجاح");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full border p-3 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="كلمة المرور"
            className="w-full border p-3 rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isLogin ? (
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-md"
            >
              تسجيل الدخول
            </button>
          ) : (
            <button
              onClick={handleSignup}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-md"
            >
              إنشاء حساب
            </button>
          )}

          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 underline"
            >
              {isLogin
                ? "ليس لديك حساب؟ إنشاء حساب"
                : "لديك حساب بالفعل؟ تسجيل الدخول"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
