"use client";

import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import { useAuthFlow } from "../hooks/use-auth-flow";
import { authErrorMessage } from "../lib/auth-errors";
import type { AuthAdapter, AuthMode } from "../types/auth-contracts";
import { AuthLayout } from "./auth-layout";
import { LoginForm } from "./login-form";
import { OtpDialog } from "./otp-dialog";
import { RecoveryPanel } from "./recovery-panel";
import { RegisterForm } from "./register-form";

export function AuthScreen({ mode, adapter }: { mode: AuthMode; adapter: AuthAdapter }) {
  return <AuthFlow key={mode} mode={mode} adapter={adapter} />;
}

function AuthFlow({ mode, adapter }: { mode: AuthMode; adapter: AuthAdapter }) {
  const flow = useAuthFlow(mode, adapter);
  return (
    <AuthLayout mode={mode}>
      {mode === "login" && (
        <LoginForm
          pending={flow.pending}
          onSubmit={(input) => void flow.begin(() => adapter.login(input))}
        />
      )}
      {mode === "register" && (
        <RegisterForm
          pending={flow.pending}
          onSubmit={(input) => void flow.begin(() => adapter.register(input))}
        />
      )}
      {mode === "recovery" && <RecoveryPanel flow={flow} adapter={adapter} />}
      {!flow.challenge && flow.failure && (
        <div className="mt-4">
          <Status tone="danger">{authErrorMessage(flow.failure.code)}</Status>
        </div>
      )}
      {flow.contractError && (
        <div className="mt-4">
          <Status tone="danger">
            Verifikasi tidak sesuai atau sudah berakhir. Mulai kembali untuk melanjutkan.
          </Status>
        </div>
      )}
      {flow.grant && (flow.failure?.code === "expired" || flow.failure?.code === "revoked") && (
        <Button className="mt-4" variant="secondary" onClick={flow.restartRecovery}>
          Ulangi verifikasi pemulihan
        </Button>
      )}
      {adapter.mode === "mock" && (
        <p className="mt-4 text-center text-xs text-secondary">
          MODE PENGEMBANGAN · autentikasi dan OTP simulasi.
        </p>
      )}
      {flow.challenge && (
        <OtpDialog
          key={`${flow.challenge.id}-${flow.challenge.expiresAt}`}
          adapter={adapter}
          challenge={flow.challenge}
          pending={flow.pending}
          failure={flow.failure}
          onVerify={(code) => void flow.verify(code)}
          onResend={() => void flow.resend()}
          onClose={flow.closeChallenge}
        />
      )}
    </AuthLayout>
  );
}
