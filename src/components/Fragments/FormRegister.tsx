import InputForm from "../Elements/Input/Index";
import Button from "../Elements/Button";
import LineOr from "../Elements/LineOr";
import FormTitle from "../Elements/TitleForm";
import OptionGender from "../Elements/OptionGender/Index";
import { Link, useNavigate } from "react-router-dom";
import NoHp from "../Elements/NoHp/index";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../stores/redux/store";
import { registerNewUser } from "../../stores/redux/slices/userSlice";
import StatusLoading from "../Elements/status/statusLoading";

const FormRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.user);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.currentTarget;

    const inputUser = {
      name: target.namalenkap.value,
      email: target.email.value,
      gender: target.gender.value,
      phone: target.phone.value,
      password: target.password.value,
      konfirmasiPassword: target.konfirmasipassword.value,
      countryCode: target.countryCode.value,
      id: Math.random().toString(36),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(inputUser);

    dispatch(registerNewUser(inputUser))
      .unwrap()
      .then(() => {
        alert("Pendaftaran berhasil!");
        navigate("/login");
      })
      .catch((error) => {
        alert("Pendaftaran gagal. Silakan coba lagi.");
        console.error(error);
      });
  };

  if (status === "loading") {
    return <StatusLoading />;
  }

  return (
    <>
      <FormTitle
        title="Pendaftaran Akun"
        paragraph="Yuk, daftarkan akunmu sekarang juga!"
      ></FormTitle>

      <form className="gap-3 flex flex-col" onSubmit={handleSubmit}>
        <InputForm
          label="Nama Lengkap"
          name="namalenkap"
          placeholder=""
          type="text"
        ></InputForm>
        <InputForm
          label="E-Mail "
          name="email"
          placeholder=""
          type="email"
        ></InputForm>
        <OptionGender label="Jenis Kelamin " name="gender"></OptionGender>
        <NoHp
          label="No. Hp "
          name="phone"
          placeholder=""
          type="tel"
          countryCode="countryCode"
        ></NoHp>
        <InputForm
          label="Kata Sandi "
          name="password"
          placeholder=""
          type="password"
        ></InputForm>
        <InputForm
          label="Konfirmasi Kata Sandi "
          name="konfirmasipassword"
          placeholder=""
          type="password"
        ></InputForm>
        <Link
          to="/forgot-password"
          className="font-medium text-sm leading-[140%] tracking-[0.2px] text-[#333333AD] text-right"
        >
          Lupa Password?
        </Link>
        <Button
          label="Daftar"
          bg="bg-[#3ECF4C]"
          textColor="text-white"
          typeButton="submit"
        ></Button>
        <Button
          label="Masuk"
          bg="bg-[#E2FCD9CC]"
          textColor="text-[#3ECF4C]"
          onClick={() => navigate("/login")}
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

export default FormRegister;
