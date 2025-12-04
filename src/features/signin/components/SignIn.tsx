import { signIn } from "../../../services/auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("cognito", {}, "lang=ja");
      }}
    >
      <button className="border rounded" type="submit">
        サインイン
      </button>
    </form>
  );
}
