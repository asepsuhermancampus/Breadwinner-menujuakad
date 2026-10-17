"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Status } from "@/components/ui/status";
import styles from "./auth-form.module.css";

export function GoogleAuthButton({ disabled }: { disabled: boolean }) {
  const [explanation, setExplanation] = useState(false);
  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className={styles.google}
        disabled={disabled}
        onClick={() => setExplanation(true)}
      >
        <span className={styles.googleMark} aria-hidden="true">
          G
        </span>
        Lanjutkan dengan Google
      </Button>
      {explanation && (
        <Status>
          Google belum terhubung pada preview ini. Gunakan formulir simulasi di bawah untuk
          melanjutkan.
        </Status>
      )}
    </>
  );
}
