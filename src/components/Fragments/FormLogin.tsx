import InputForm from "../Elements/Input/Index";
import Button from "../Elements/Button/index";
import LineOr from "../Elements/LineOr/index";
import FormTitle from "../Elements/TitleForm/index";
import { Link, useNavigate } from "react-router-dom";
import StatusFailed from "../Elements/status/statusFailed";
import StatusLoading from "../Elements/status/statusLoading";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../stores/redux/store";
import { login } from "../../stores/redux/slices/userSlice";

const FormLogin = () => {
  const navigate = useNavigate();

  const { status, error } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = {
      email: event.currentTarget.email.value,
      password: event.currentTarget.password.value,
    };
    dispatch(login(data))
      .unwrap()
      .then(() => {
        alert("Login berhasil!");
        navigate("/");
      })
      .catch((error) => {
        alert("Login gagal. Silakan coba lagi.");
        console.log(error);
      });
  };

  if (status === "loading") {
    return <StatusLoading />;
  }

  if (status === "failed") {
    return <StatusFailed errorMessage={error} />;
  }

  return (
    <>
      <FormTitle
        title="Masuk ke Akun"
        paragraph="Yuk, lanjutin belajarmu di videobelajar."
      ></FormTitle>
      <form className="gap-3 flex flex-col" onSubmit={handleSubmit}>
        <InputForm
          label="E-Mail "
          name="email"
          placeholder=""
          type="email"
        ></InputForm>
        <InputForm
          label="Kata Sandi "
          name="password"
          placeholder=""
          type="password"
        ></InputForm>
        <Link
          // Sebaiknya arahkan ke rute yang valid, contoh: /forgot-password
          to="/forgot-password"
          className="font-medium text-sm leading-[140%] tracking-[0.2px] text-[#333333AD] text-right"
        >
          Lupa Password?
        </Link>
        <Button
          label="Masuk"
          bg="bg-[#3ECF4C]"
          textColor="text-white"
          typeButton="submit"
        ></Button>
        <Button
          label="Daftar"
          bg="bg-[#E2FCD9CC]"
          textColor="text-[#3ECF4C]"
          onClick={() => navigate("/register")}
          typeButton="button"
        ></Button>
        <LineOr></LineOr>
        <Button
          label="Masuk Dengan Google"
          bg="bg-white"
          textColor="text-[#4A505C]"
          border="border border-[#F1F1F1] border-solid"
          GoogleImg
          typeButton="button"
        ></Button>
      </form>
    </>
  );
};

export default FormLogin;
